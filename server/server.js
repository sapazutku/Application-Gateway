const express = require('express');
const fs = require('fs');
const storage = require('./storage');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', (req, res) => {
    const filename = storage.saveFile(req);
    res.json({ filename });
});

app.get('/download/:filename', (req, res) => {
    const fileStream = storage.getFile(req.params.filename);
    fileStream.pipe(res);
});

app.listen(3001, () => {
    console.log('Server started!');
} );

