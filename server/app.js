
const express = require("express");
const Soundcloud = require("soundcloud.ts").default;
const NodeID3 = require('node-id3');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
// const soundcloud = new Soundcloud()
const soundcloud = new Soundcloud({
    clientId: 'odn1E9M0osmPI1UsMDnFDuKcK5WSjS7s',
    oauthToken: '2-293847-1068764815-lEWnQ9Wlbu4Mn',
})
const pathToTracks = './public/tracks/'

// app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({extended: true}));
app.get("/download", async (req, res) => {
    let track = await soundcloud.tracks.getV2(req.query?.track);
    if (!track) {
        console.log('Track not aviable')
        return
    }
    const generateRandomString = () => Math.floor(Math.random() * Date.now()).toString(36);
    const hash = generateRandomString();
    await soundcloud.util.downloadTrack(track, pathToTracks+hash)
    const file = fs.readdirSync(pathToTracks+hash)[0];
    const coverAsBuffer = async (artworkUrl) => {
        let url = artworkUrl.replace('-large', '-t500x500');
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer
    }

    const tags = {
        title: track?.title,
        artist: track?.user?.username,
        APIC: track.artwork_url ? await coverAsBuffer(track.artwork_url) : '',

    }
    const filePath = pathToTracks + `${hash}/${file}`;
    const success = NodeID3.update(tags, filePath);
    // res.cookie('track', req.query?.track, { maxAge: 900000 })
    res.download(filePath, file, () => {
        fs.unlink(filePath, () => {
            fs.rmdirSync(pathToTracks + hash);
        });
    });

});
  
app.listen(8080);

exports.default = app;