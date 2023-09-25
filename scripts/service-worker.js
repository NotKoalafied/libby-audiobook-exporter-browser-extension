import { Commands, getTailAfter, base64UrlDecode, makePathNameSafe, delayRoughlyMs } from './common.js'

// globals
// { titleId: {
//    "titleId": titleId,
//    "tile": title,
//    "downloadDir": downloadDir,
//    "openbookUrl": openbook_json_url,
//    "coverUrl": cover_url,
//    ...
//    "audios": {
//       mp3SaveFileName: mp3Url
//     }
//   }
// }
const books = {}

async function iframeCallback(details) {
    const url = new URL(details.url)
    const baseUrl = url.origin
    const encodedM = url?.searchParams?.get('m')
    const m = base64UrlDecode(encodedM)
    const mObj = JSON.parse(m)
    const titleId = mObj?.tdata?.codex?.title?.titleId
    const openbookUrl = `${baseUrl}/_d/openbook.json`
    const openbookResponse = await fetch(openbookUrl)
    const openbook = await openbookResponse.json()

    const book = {}
    books[titleId] = book
    book.openbook = openbook
    book.titleId = titleId
    book.title = openbook?.title?.main
    book.subtitle = openbook?.title?.subtitle
    book.downloadDir = makePathNameSafe(book.title)
    book.authors = openbook?.creator
    book.openbookUrl = openbookUrl
    book.coverUrl = mObj?.tdata?.codex?.title?.cover?.imageURL
    book.metaFiles = {}
    book.metaFiles['openbook.json'] = { url: openbookUrl, downloaded: false }
    const coverFilename = `cover.${getTailAfter(book.coverUrl, '.')?.toLowerCase() ?? 'jpg'}`
    book.metaFiles[coverFilename] = { url: book.coverUrl, downloaded: false }
    const mp3Urls = openbook?.spine.map(
        x => `${baseUrl}/${x.path}`
    )
    book.audios = {}
    mp3Urls.forEach(
        (mp3Url, i) => {
            const match = mp3Url.match(/-[P|p]art\d*\..*?\?/)
            const suffix = match?.[0]?.slice(0, -1) ?? ("-Part" + (i > 9 ? i : "0" + i) + ".mp3")
            const filename = `${book.downloadDir}${suffix}`
            book.audios[filename] = { url: mp3Url, downloaded: false }
        }
    )
    book.downloading = false
}

async function download(titleId) {
    if (!books || !books[titleId]) {
        return null
    }

    const book = books[titleId]
    if (book.downloading) {
        return book
    }

    book.downloading = true
    console.log(`[lae] start downloading "${book?.title}".`)
    await downloadFiles(book.metaFiles, book)
    await downloadFiles(book.audios, book)
    console.log(`[lae] finish downloading "${book?.title}".`)
    book.downloading = false
    Object.keys(book.metaFiles).forEach(filename => book.metaFiles[filename].downloaded = false)
    Object.keys(book.audios).forEach(filename => book.audios[filename].downloaded = false)
    return book
}

async function downloadFiles(files, book) {
    for await (const filename of Object.keys(files)) {
        const fileInfo = files[filename];
        console.log(`[lae] downloading ${fileInfo.url} as ${filename}`)
        await chrome.downloads.download({
            url: fileInfo.url,
            filename: `${book.downloadDir}/${filename}`,
        })
        await delayRoughlyMs(5000)
        fileInfo.downloaded = true
        chrome.runtime.sendMessage({ command: Commands.UpdateBook, book: book })
    }
}

async function main() {
    const iframeFilter = { urls: ["*://*.libbyapp.com/?m=eyJ*"] }
    chrome.webRequest.onCompleted.addListener(iframeCallback, iframeFilter);

    chrome.runtime.onMessage.addListener(
        async (message, sender, sendResponse) => {
            switch (message?.command) {
                case Commands.GetBook:
                    sendResponse(books[message.titleId]);
                    break;
                case Commands.Download: {
                    const book = download(message.titleId)
                    sendResponse(book)
                    break;
                }
                default: {
                    const error = `Message not understood: ${message}`;
                    sendResponse({
                        error: error,
                    })
                }
            }
        }
    );

    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason == "install") {
            console.log("This is a first install!");
        } else if (details.reason == "update") {
            var thisVersion = chrome.runtime.getManifest().version;
            console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        }
    });
}

main()