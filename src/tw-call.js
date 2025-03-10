import twilio from "twilio";
import "dotenv/config";

const { TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER, PHONE_TO_CALL, TWILIO_AUTH_TOKEN, TWILIO_FLOW_ID } = process.env;

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function main(){

  client.studio.v2.flows(TWILIO_FLOW_ID)
    .executions
    .create({
      // to: '+15745384152',
      to: PHONE_TO_CALL,
      from: TWILIO_PHONE_NUMBER,
    })
    .then(execution => console.log(execution));
}

main();