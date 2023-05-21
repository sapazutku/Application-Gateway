const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const auth = require('./auth');
const app = express();
const fileServerUrl = 'http://localhost:3001';
const FormData = require("form-data");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/auth', (req, res) => {
    const user = req.body.username;
    const token = auth.generateToken(user);
    res.json({ token });
});

app.post("/upload", auth.verifyToken, async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req);
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
    res.json(fileServerResponse.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});


app.get('/download/:filename', auth.verifyToken, (req, res) => {
    // Stream the response from the file server to the client
    axios.get(`${fileServerUrl}/download/${req.params.filename}`, {
        responseType: 'stream'
    }).then(fileServerResponse => {
        fileServerResponse.data.pipe(res);
    }).catch(err => {
        res.status(500).json({ error: err.toString() });
    });
});

app.listen(3000, () => console.log('Proxy server listening on port 3000'));
