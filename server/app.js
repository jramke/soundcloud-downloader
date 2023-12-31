import express from "express";
// const Soundcloud = require("../soundcloud.ts").default;
import { Soundcloud } from "soundcloud.ts"
import NodeID3 from "node-id3";
import fs from "fs";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import 'dotenv/config'

const app = express();
const soundcloud = new Soundcloud()
const pathToTracks = process.env.NODE_ENV === 'Development' ? './tracks/' : '/tmp/tracks/';
// app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({extended: true}));
app.get("/download", async (req, res) => {
    console.log('REQUEST IN');
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
        console.log('start download');
        const filePath = await soundcloud.util.downloadTrack(track, pathToTracks+hash);
        console.log(filePath);
        console.log('end download');
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
        const success = NodeID3.update(tags, filePath);
        console.log('response with download');
        res.download(filePath, async () => {
            console.log('delete file');
            await fs.promises.unlink(filePath);
            console.log('delete folder');
            await fs.promises.rmdir(pathToTracks + hash);
        });
        console.log('response with status 200');
        res.status(200);
    } catch (error) {
        console.error('catched error ', error);
		res.status(500).send(error);
    }

});

app.get("/", (req, res) => {
    res.json('Server is running. Use /download in a form action to download a track from soundcloud')
});
  
app.listen(8080,  () => console.log('Server is runnung on http://localhost:8080'));

export default app;