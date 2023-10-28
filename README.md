# Soundcloud Downloader Chrome Extension

Download soundcloud songs with cover and artist information.

## Gettings started

First clone this repo

### Server
```
cd server
npm i
npm run dev
```

### Extension
```
cd extension
npm i
npm run build
```
Then add the build folder on `chrome://extensions/`.

## TODO:

- Vercel serverless function max 5mb, so if song is bigger error is thrown

- ux downloading state

- automatically add downloaded song to given playlist