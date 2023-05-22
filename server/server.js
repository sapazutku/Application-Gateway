const express = require('express');
const fs = require('fs');
const storage = require('./storage');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', (req, res) => {
    const filename = storage.saveFile(req);
    console.log(`File uploaded: ${filename} 📦`);
    res.json({ filename });
});

app.get('/download/:filename', (req, res) => {
    const fileStream = storage.getFile(req.params.filename);
    console.log(`File downloaded: ${req.params.filename} 📦`);
    fileStream.pipe(res);
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
} );

