const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const crypto = require("crypto-js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

router.post("/upload", upload.single("file"), async (req, res) => {
    const encryptedData = crypto.AES.encrypt(fs.readFileSync(req.file.path, "utf8"), process.env.JWT_SECRET).toString();

    const fileMetadata = { name: req.file.originalname, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] };
    const media = { mimeType: req.file.mimetype, body: encryptedData };

    const file = await drive.files.create({ resource: fileMetadata, media });
    fs.unlinkSync(req.file.path);

    res.json({ fileId: file.data.id });
});

module.exports = router;
