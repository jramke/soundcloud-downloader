
const express = require("express");
const Soundcloud = require("soundcloud.ts").default;
const NodeID3 = require('node-id3');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const soundcloud = new Soundcloud({
    clientId: 'odn1E9M0osmPI1UsMDnFDuKcK5WSjS7s',
    oauthToken: '2-293847-1068764815-lEWnQ9Wlbu4Mn',
})

// app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({extended: true}));
app.get("/download", async (req, res) => {
    let track = await soundcloud.tracks.getV2(req.query?.track);
    await soundcloud.util.downloadTrack(track, "./tracks/randomHash") // todo: random hash
    const file = fs.readdirSync("./tracks/randomHash")[0];
    const coverAsBuffer = async () => {
        let url = track?.artwork_url.replace('-large', '-t500x500');
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer
    }

    const tags = {
        title: track?.title,
        artist: track?.user?.username,
        APIC: await coverAsBuffer(),

    }
    const filePath = './tracks/randomHash/' + file;
    const success = NodeID3.update(tags, filePath);
    res.download(filePath);

    //TODO: delete file
    // fs.unlinkSync(filePath);
});
  
app.listen(8080);



async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
  
    fs.writeFile(filename, response.data, (err) => {
      if (err) throw err;
    //   console.log('Image downloaded successfully!');
    });
  }