const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const auth = require('./auth');
const app = express();
const fileServerUrl = 'http://localhost:3001';
const FormData = require("form-data");

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false, limit: "200mb" }));


app.post('/auth', (req, res) => {
    const user = req.body.username;
    const token = auth.generateToken(user);
    res.json({ token });
});

app.post(
  "/upload",
  auth.verifyToken,
  express.raw({ limit: "200mb" }),
  async (req, res) => {
    try {
      const formData = new FormData();
      formData.append("file", req.body);
      const fileServerResponse = await axios.post(
        `${fileServerUrl}/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "x-access-token": req.headers["x-access-token"],
          },
        }
      );

      var sizeInMB = req.body.length / (1024 * 1024);
      // log the file size in mb
      console.log(`Sent to FTP: 📦 ${sizeInMB.toFixed(2)} MB`);


      res.json(fileServerResponse.data);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  }
);


// download large file considering the integrity of the file
app.get("/download/:filename", auth.verifyToken, async (req, res) => {
  try {
    const fileServerResponse = await axios.get(
      `${fileServerUrl}/download/${req.params.filename}`,
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
        responseType: "stream",
      }
    );

    let size = 0;
    await fileServerResponse.data.on("data", (chunk) => {
      size += chunk.length;
    });

    await fileServerResponse.data.on("end", () => {
      //console.log(`File downloaded: ${filename} 📦 ${size / 1024} kb`);
      var sizeInMB = size / (1024 * 1024);
        console.log(`Got from FTP : 📦 ${sizeInMB.toFixed(2)} MB`);

    });

    fileServerResponse.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log('Proxy server listening on port 3000'));
