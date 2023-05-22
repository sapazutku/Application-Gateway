const axios = require("axios");
const fs = require("fs");
const proxyServerUrl = "http://localhost:3000";

async function authenticate(username) {
  const response = await axios.post(`${proxyServerUrl}/auth`, { username });
  return response.data.token;
}

async function uploadFile(token, filename) {
  const fileStream = fs.createReadStream(filename);
  const response = await axios.post(`${proxyServerUrl}/upload`, fileStream, {
    headers: {
      "x-access-token": token,
      "Content-Type": "application/octet-stream",
    },
  });
  console.log("File was sent")
  return response.data.filename;
}

async function downloadFile(token, filename) {
  const response = await axios.get(`${proxyServerUrl}/download/${filename}`, {
    headers: {
      "x-access-token": token,
    },
    responseType: "stream",
  });
  let size = 0;
  await response.data.on("data", (chunk) => {
    size += chunk.length;
  });
  
  await response.data.on("end", () => {
    //console.log(`File downloaded: ${filename} 📦 ${size / 1024} kb`);
    // MB
    var sizeInMB = size / (1024 * 1024);
    console.log(`File downloaded: 📦 ${sizeInMB.toFixed(2)} MB`);
  });

  response.data.pipe(fs.createWriteStream(filename));

}

(async () => {
  const token = await authenticate("username");
  const filename = await uploadFile(token, "test.txt");
  await downloadFile(token, filename);
})();
