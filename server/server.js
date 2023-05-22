const express = require('express');
const fs = require('fs');
const storage = require('./storage');
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true , limit: '200mb'}));

const storagePath = path.join(__dirname, "storage");


app.post('/upload', express.raw({ limit: "200mb" }), async (req, res) => {
        console.log(
          `Received file size: ${
            req.headers["content-length"] / 1024 / 1024
          } MB`
        );
    const filename = storage.saveFile(req);
    //console.log( `File size: ${req.body.length / 1024 / 1024} MB`);
    //console.log(`File uploaded: ${filename} 📦`);
    res.json({ filename });
});

app.get('/download/:filename', async (req, res) => {
   const stats = fs.statSync(path.join(storagePath, req.params.filename));
   const fileSizeInBytes = stats.size;
   const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
   console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);
    const fileStream =  storage.getFile(req.params.filename);
    console.log(`File downloaded: ${req.params.filename} 📦`);
    fileStream.pipe(res);
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
} );

