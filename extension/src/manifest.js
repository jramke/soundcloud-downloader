import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: 'Soundcloud Downloader',
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/icon16.png',
    32: 'img/icon32.png',
    48: 'img/icon48.png',
    128: 'img/icon128.png',
  },
  // action: {
  //   default_popup: 'popup.html',
  //   default_icon: 'img/logo-48.png',
  // },
  // options_page: 'options.html',
  // devtools_page: 'devtools.html',
  // background: {
  //   service_worker: 'src/background/index.js',
  //   type: 'module',
  // },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.js'],
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  web_accessible_resources: [
    {
      resources: ['img/icon16.png', 'img/icon32.png', 'img/icon48.png', 'img/icon128.png'],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage'],
  // chrome_url_overrides: {
  //   newtab: 'newtab.html',
  // },
})
