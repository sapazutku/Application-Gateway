const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const storagePath = path.join(__dirname, "storage");

exports.saveFile = (stream) => {
  const filename = crypto.randomBytes(16).toString("hex");
  const filePath = path.join(storagePath, filename);
  const writeStream = fs.createWriteStream(filePath);

  stream.pipe(writeStream);

  return filename;
};

exports.getFile = (filename) => {
  const filePath = path.join(storagePath, filename);
  return fs.createReadStream(filePath);
};
