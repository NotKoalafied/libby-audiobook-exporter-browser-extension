Libby Audiobook Exporter Browser Extension
==========================================

A browser plugin to download audio (mp3) files from libby.com audiobooks
------------------------------------------------------------------------

---
**NOTE**

*As this extension has been taken down from the Chrome Web Store (but be rest assured that this extension is safe and contains no malicious code, you can always examine the source code as it is not that complex. The reason for the takedown was due to someone filed a claim that certain company "has an officially registered trademark to 'Libby' in this context." etc and Google complied), in order to use it now, you need to load it via the "Developer mode" in Chrome (or other Chromium based browsers) with steps below:*

1. Download this repository as a zip file (Click on the green `Code` button and choose "Download Zip" from the dropdown) and unzip it to a directory of your choice. (Or if you use git, just clone this repository.)
(If you need the legacy version, switch to the `content-script` [branch](https://github.com/houtianze/libby-audiobook-exporter-browser-extension/tree/content-script) first before downloading/cloning)
2. Go to [chrome://extensions/](chrome://extensions/) in Chrome, and enable that "Developer mode" toggle.
3. Now click on the "Load unpacked" button and select the directory from step 1 where you extracted/cloned the files to.
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

Troubleshooting
--------------- 
---

It's possible that using the Libby 'Copy To Another Device' feature can cause the new device to be unable to download using this extension due to a variance in how Libby communicates the mp3 filenames to the browser. If this happens, the extension will throw a [TypeError: Cannot read properties of undefined](https://github.com/houtianze/libby-audiobook-exporter-browser-extension/issues/12). The following steps have been demonstrated to resolve this issue.

1. Clear all cookies and site data from Libby.
2. When adding your card(s) back into Libby, do it manually. Copying them from another device seems to be part of what was causing the issue. It may be possible to copy from a different device instead, but that has not yet been tested.
3. Attempt to use the extension again as normal.

---
