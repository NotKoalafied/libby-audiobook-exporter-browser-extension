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

const rosterFilter = { urls: ["*://*.soraapp.com/_d/roster.json?m=eyJ*"] }
async function iframeCallback(details) {
    const url = new URL(details.url)
    const baseUrl = url.origin
    const encodedM = url?.searchParams?.get('m')
    const m = base64UrlDecode(encodedM)
    const mObj = JSON.parse(m)
    const titleId = mObj?.tdata['title-id']
    const openbookUrl = `${baseUrl}/_d/openbook.json`
    const openbookResponse = await fetch(openbookUrl)
    const openbook = await openbookResponse.json()
    const rosterUrl = `${baseUrl}/_d/roster.json`
    const rosterResponse = await fetch(rosterUrl)
    const roster = await rosterResponse.json()

    const info = {}
    books[titleId] = info
    info.titleId = titleId
    info.title = openbook?.title?.main
    info.subtitle = openbook?.title?.subtitle
    info.downloadDir = makePathNameSafe(info.title)
    info.authors = openbook?.creator
    info.openbookUrl = openbookUrl
    info.coverUrl = roster.filter(x => x?.group === 'title-content')
        ?.[0]?.entries.filter(x => /^.*\/cover\/.*big\.jpg$/.test(x?.url))
        ?.[0]?.url
    const mp3Urls = openbook?.spine.map(
        x => `${baseUrl}/${x.path}`
    )
    info.audios = {}
    mp3Urls.forEach(
        (mp3Url, i) => {
            const match = mp3Url.match(/-[P|p]art\d*\..*?\?/)
            const suffix = match?.[0]?.slice(0, -1) ?? ("-Part" + (i > 9 ? i : "0" + i) + ".mp3")
            const filename = `${info.downloadDir}${suffix}`
            info.audios[filename] = mp3Url
        }
    )
}

// https://stackoverflow.com/a/51838635/404271
function base64UrlDecode(s) {
    // Replace non-url compatible chars with base64 standard chars
    s = s.replace(/-/g, '+').replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = s.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        s += new Array(5 - pad).join('=');
    }

    return atob(s);
}

chrome.webRequest.onCompleted.addListener(iframeCallback, rosterFilter);

// https://stackoverflow.com/a/31976060/404271
function makePathNameSafe(name) {
    // eslint warning: no-control-regex
    // return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    return name.replace(/[<>:"/\\|?*,.]/g, '_');
}

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
        switch (message?.command) {
            case 'GetMap':
                sendResponse(books[message?.titleId]);
                break;
            case 'Download': {
                const downloadId = await chrome.downloads.download({
                    url: message?.url,
                    filename: message?.filename,
                })
                sendResponse({
                    downloadId: downloadId,
                })
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
