import "dotenv/config";
import fs from "fs";
import path from "path";
import { writeCall } from "./write-call.js";
import { getRawFileName } from "./util.js";
import { writeData } from "./write-data.js";
import { parse, stringify } from "yaml";
import { stringSimilarity } from "string-similarity-js";

const { VAPI_TOKEN } = process.env;

const createdAtGe = "2024-09-20T15:40:42.624Z";

const ignoreFile = fs.readFileSync("./src/ignore-ids.yml", "utf8");

const { ignoreIds } = parse(ignoreFile);

function getCalls() {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${VAPI_TOKEN}` },
  };

  fetch(`https://api.vapi.ai/call?createdAtGe=${createdAtGe}`, options)
    .then((response) => response.json())
    .then(checkForNew)
    .then(writeCalls)
    .catch((err) => console.error(err));
}

function existingCalls() {
  const calls = [];
  const files = fs.readdirSync("_data/calls");

  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    calls.push(file);
  });
  return calls;
}

function isLikelySameRecording(newCall, existingCallPaths) {
  return existingCallPaths.some((existingCallPath) => {
    const message = typeof existingCallPath === 'string' ? fs.readFileSync(
      path.join("_data/calls", existingCallPath),
      "utf8",
    ) : JSON.stringify(existingCallPath);
    const { transcript } = JSON.parse(message);
    const similarity = stringSimilarity(transcript, newCall.transcript);
    const LEVEL = 0.82;
    const isSimilar =  similarity > LEVEL;
    if(isSimilar){
      console.log(`${existingCallPath} and ${newCall.id} - ${similarity}`)
    }
    return isSimilar
  });
}

async function checkForNew(calls) {
  const successfulCalls = calls
    .filter((call) => call.analysis.successEvaluation === "true")
    .filter((call) => call.type === "outboundPhoneCall")
    .filter((call) => call.messages?.length)
    .filter((call) => !ignoreIds.includes(call.id));
  // .filter((call) => call.analysis.structuredData?.birds?.length);
  const existing = await existingCalls();
  const newCalls = [];
  successfulCalls.forEach((call) => {
    const filename = getRawFileName(call, "json");
    if (existing.includes(filename)) {
      console.log("already exists");
      return;
    }
    if (isLikelySameRecording(call, existing)) {
      console.log(`${call.id} likely matches another call`);
      addToIgnore(call.id);
      return;
    }
    newCalls.push(call);
    existing.push(call);
  });

  return newCalls;
}

function addToIgnore(callId) {
  const newIgnoreIds = [...ignoreIds];
  newIgnoreIds.push(callId);
  const output = stringify({ ignoreIds: newIgnoreIds });
  const filePath = "./src/ignore-ids.yml";
  fs.writeFile(filePath, output, (err) => {
    if (err) {
      return console.error(`Error writing file: ${err}`);
    }
    console.log(`Ignore files successfully written as: ${filePath}`);
  });
}

function writeCalls(calls) {
  console.log(`writing ${calls.length} calls`);
  calls.forEach(writeData);
  calls.forEach(writeCall);
}

function main() {
  getCalls();
}

main();
