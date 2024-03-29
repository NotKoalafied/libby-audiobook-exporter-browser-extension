Libby Audiobook Exporter Browser Extension
==========================================

A browser plugin to download audio (mp3) files from libby.com audiobooks
------------------------------------------------------------------------

---
**NOTE**

*As this extension has been taken down from the Chrome Web Store (but be rest assured that this extension is safe and contains no malicious code, you can always examine the source code as it is not that complex. The reason for the takedown was due to someone filed a claim that certain company "has an officially registered trademark to 'Libby' in this context." etc and Google complied), in order to use it now, you need to load it via the "Developer mode" in Chrome (or other Chromium based browsers) with steps below:*

1. Download this repository as a zip file via [this link](https://github.com/houtianze/libby-audiobook-exporter-browser-extension/blob/master/archive/refs/heads/master.zip) and unzip it to a directory of your choice. (Or if you use git, just clone this repository.)
2. Go to [chrome://extensions/](chrome://extensions/) in Chrome, and enable that "Developer mode" toggle.
3. Now click on the "Load unpacked" button and select the directory from step 1 where you extracted the files to.
4. Done.

If you need the crx file for other Chromium based browser, it's now under the [release](release/lae.crx) directory.

---

- Chrome web store link: https://chrome.google.com/webstore/detail/libby-audiobook-exporter/ophjgobioamjpkoahcmlofkdbpfjodig
- Homepage: https://github.com/houtianze/libby-audiobook-exporter-browser-extension

Code branches
-------------
- `master` - The release branch used for chrome web store release, this is the default branch.
- `popup` - The current wip branch that uses popup (`action` in manifest, just click on the extension icon) to download. It will be synced back to the `master` branch once the feature is considered stable.
- `content-script` (LEGACY) - The legacy branch that uses `content_scripts` to download.
- `sora` - The extension for soraapp.com