import twilio from "twilio";
import "dotenv/config";
import https from 'node:https';
import fs from 'node:fs';
import { parse, stringify } from "yaml";
import transcribe from "./transcribe.js";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory



const { TWILIO_ACCOUNT_SID, PHONE_TO_CALL, TWILIO_AUTH_TOKEN } = process.env;

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const API_PATH = 'api.twilio.com';

const getLastChecked = () => {
  const file = fs.readFileSync( path.join(__dirname,"last-checked.yml"), "utf8");
  const { lastChecked } = parse(file);
  return lastChecked;
}

const setLastChecked = () => {
  let yourDate = new Date();
  const offset = yourDate.getTimezoneOffset()
  yourDate = new Date(yourDate.getTime() - (offset*60*1000))
  const lastChecked = yourDate.toISOString().split('T')[0];

  const output = stringify({ lastChecked });
  const filePath = path.join(__dirname, "last-checked.yml");
  fs.writeFile(filePath, output, (err) => {
    if (err) {
      return console.error(`Error writing file: ${err}`);
    }
    console.log(`Last checked file ${filePath} successfully written with ${lastChecked}`);
  });
}

async function writeTranscript(transcript, name){
  const filePath = path.join(__dirname, "../content/calls/", name);
  await fs.writeFile(filePath, JSON.stringify(transcript, null, 2), (err) => {
    if (err) {
      return console.error(`Error writing file: ${err}`);
    }
    console.log(`Transcript written to ${filePath}.`);
  });
}

const recordingUri = (recording) => {
  return recording.uri.replace(/\.json$/, '.wav');
}

const request = (recording) => {
  var auth = 'Basic ' + Buffer.from(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN).toString('base64');
  return {
    hostname: API_PATH,
    path: recordingUri(recording),
    headers: {
      Authorization: auth
    }
  }
}

/**
 * getTranscript
 * @param {import('twilio/lib').CallInstance} call 
 */
async function getRecordings(call) {
  try {
    await call.recordings().each(async recording => {
      // if(recording.sid !== 'REaf3eac3669595f703c10ff64563b9555') return;
      console.log(recording);
      const filePath = path.join(__dirname, `../public/recordings/${recording.sid}.wav`);
      var file = fs.createWriteStream(filePath);
      var requestT = https.get(request(recording), async function (response) {
        response.pipe(file);
        console.log(`Wrote recording ${recording.sid}`)
        const transcription = await transcribe(filePath);
        console.log(transcription);
        await writeTranscript(transcription, recording.sid)
      });
      return requestT;
    });
  } catch (error) {
    console.warn('error', error)
  }
}

async function listCall() {
  console.log(getLastChecked());
  const calls = await client.calls.list({
    to: PHONE_TO_CALL,
    // to: '+15745384152',
    limit: 20,
    startTimeAfter: getLastChecked()
  });
  setLastChecked();

  calls.forEach(getRecordings);
  // await getRecordings(calls[0]);
  console.log('done')
}

listCall();