
const express = require("express");
// const Soundcloud = require("../soundcloud.ts").default;
const Soundcloud = require("soundcloud.ts").default;
const NodeID3 = require('node-id3');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const fetch = require("node-fetch").default;

const app = express();
const soundcloud = new Soundcloud()
const pathToTracks = '/tmp/tracks/' // stores locally in c: disk

// app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({extended: true}));
app.get("/download", async (req, res) => {
    try {
        if (!req.query?.track) {
            res.json({ error: 'No track given' })
            console.log('No track given')
            return
        }
        let track = await soundcloud.tracks.getV2(req.query.track);
        if (!track) {
            res.json({ error: 'Track not found' })
            console.log('Track not found')
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
    } catch (error) {
        console.error('catched error ', error);
		res.status(500).send(error);
    }

});

app.get("/", (req, res) => {
    res.json('Server is running. Use /download in a form action to download a track from soundcloud')
});
  
app.listen(8080,  () => console.log('Server is runnung on http://localhost:8080'));

exports.default = app;