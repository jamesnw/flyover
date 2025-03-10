import fs from "fs";
import path from "path";
import * as prettier from "prettier";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const writeCall = async (content) => {
  const currentDate = new Date(content.createdAt);
  const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-"); // Formats to avoid invalid filename characters

  // Define the filename
  const filename = `call_${formattedDate}.md`;

  // Path to the file (optional, in case you want to save it to a specific folder)
  const filePath = path.join(__dirname, "../content/calls/", filename);

  const frontmatter = {
    birds: content.analysis.structuredData.birds,
    callDate: content.analysis.structuredData.date,
    cost: content.cost,
    recordingUrl: content.recordingUrl,
  };

  const messageSplitter = (text) => {
    const sentences = text.split(". ");
    return sentences.reduce((acc, sentence, index) => {
      if (index % 5 === 0) acc = acc + "\n\n";
      return acc + sentence + ". ";
    }, "");
  };

  const transcript = content.messages.reduce((acc, message) => {
    if (message.role !== "user") return acc;
    const timeLink = `<control-button commandfor='player' command='goto' time='${message.secondsFromStart}'><button>Go</button></control-button>`;
    return acc + timeLink + messageSplitter(message.message) + "\n\n";
  }, "");

  const output = `---
${JSON.stringify(frontmatter)}
---
${transcript}
`;

  const formattedOutput = await prettier.format(output, {
    parser: "markdown",
    trailingComma: "none",
  });

  fs.writeFile(filePath, formattedOutput, (err) => {
    if (err) {
      return console.error(`Error writing file: ${err}`);
    }
    console.log(`File successfully written as: ${filename}`);
  });
  return content;
};
