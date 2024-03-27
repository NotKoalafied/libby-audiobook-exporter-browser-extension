Libby Audiobook Exporter Browser Extension
==========================================

A browser plugin to download audio (mp3) files from libby.com audiobooks
------------------------------------------------------------------------

---
**NOTE**

*As this extension has been taken down, the only way possible to use it now in Chrome is to load via the "Developer mode":*

1. Clone or download this repository to a directory of your choice.
2. Go to [chrome://extensions/](chrome://extensions/) in Chrome, and enable that "Developer mode" toggle.
3. Now click on the "Load unpacked" button and select the directory from step 1.
4. Done.

If you need the crx file for other Chromium based browser, it's now under the [release](release) directory.

---

- Chrome web store link: https://chrome.google.com/webstore/detail/libby-audiobook-exporter/ophjgobioamjpkoahcmlofkdbpfjodig
- Homepage: https://github.com/houtianze/libby-audiobook-exporter-browser-extension

Code branches
-------------
- `master` - The release branch used for chrome web store release, this is the default branch.
- `popup` - The current wip branch that uses popup (`action` in manifest, just click on the extension icon) to download. It will be synced back to the `master` branch once the feature is considered stable.
- `content-script` (LEGACY) - The legacy branch that uses `content_scripts` to download.
- `sora` - The extension for soraapp.com