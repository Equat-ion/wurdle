// please run with node
// this is a scrambler script
// not meant to be ran by the browser or during runtime
// this is a utility to create scramble on first run

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fpath = process.argv[2];
if (!fpath) {
  console.error(`Usage: node scrambler.js <words.txt>`);
  process.exit(1);
}

const absolutePath = path.resolve(__dirname, fpath);

function scramble(inputWords) {
  for (let i = inputWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [inputWords[i], inputWords[j]] = [inputWords[j], inputWords[i]];
  }

  return inputWords;
}


const text = fs.readFileSync(absolutePath, "utf-8");
let inputWords = text.match(/.+(?:\r?\n|$)/g);

let payload = "";
