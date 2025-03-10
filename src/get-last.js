import "dotenv/config";
import { writeCall } from "./write-call";
import { writeData } from "./write-data";

const { VAPI_TOKEN } = process.env;

function getCall() {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${VAPI_TOKEN}` },
  };

  fetch("https://api.vapi.ai/call", options)
    .then((response) => response.json())
    .then(unwrap)
    // .then(pickCall)
    .then(writeData)
    .then(writeCall)
    .catch((err) => console.error(err));
}
// const pickCall = (content) => {
//   return content.find(({id}) => id === 'f2a18e32-b887-4de6-9e1c-171784e4cc56')
// }
const unwrap = (content) => content[0];

getCall();
