"use strict";

const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "www");
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of ["index.html", "style.css", "script.js"]) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}

const assetDirectory = path.join(__dirname, "assets");
if (fs.existsSync(assetDirectory)) {
  fs.cpSync(assetDirectory, path.join(outputDirectory, "assets"), { recursive: true });
}
