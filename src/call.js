import "dotenv/config";
import assistant from "./assistant.js";
const { VAPI_TOKEN, PHONE_NUMBER_ID, PHONE_TO_CALL, TEST } = process.env;

const options = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${VAPI_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Call with extension",
    assistant,

    phoneNumberId: PHONE_NUMBER_ID,
    customer: {
      numberE164CheckEnabled: true,
      extension: "1",
      number: PHONE_TO_CALL,
      name: "Bird Hotline",
    },
  }),
};

if (TEST === "yes") {
  console.log("Not actually calling");
} else {
  fetch("https://api.vapi.ai/call", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}
