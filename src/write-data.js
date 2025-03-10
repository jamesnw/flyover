import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as prettier from "prettier";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const writeData = async (content) => {
  // Get current date and time
  const currentDate = new Date(content.createdAt);
  const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-"); // Formats to avoid invalid filename characters

  // Define the filename
  const filename = `call_${formattedDate}.json`;

  // Path to the file (optional, in case you want to save it to a specific folder)
  const filePath = path.join(__dirname, "../_data/calls/", filename);

  const output = await prettier.format(JSON.stringify(content), {
    parser: "json",
    trailingComma: false,
  });

  fs.writeFile(filePath, output, (err) => {
    if (err) {
      return console.error(`Error writing file: ${err}`);
    }
    console.log(`File successfully written as: ${filename}`);
  });
  return content;
};
