import { writeCall } from "./write-call.js";
import fs from "node:fs";
import path from "node:path";

const rewrite = (file) => {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    let call = JSON.parse(data);
    writeCall(call);
  });

  console.log(`Rewrote ${file}`);
};

// rewrite('_data/calls/call_2024-09-20T15-40-42-624Z.json')

fs.readdir("_data/calls", function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    rewrite(path.join("_data/calls", file));
  });
});
