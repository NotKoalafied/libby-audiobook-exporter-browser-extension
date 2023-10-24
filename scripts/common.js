const Constants = {
    LAE_EXPLANATION_BANNER_ID: 'lae-explanation-banner',
    LAE_MAIN_ID: 'lae-main',
    EXPORT_BUTTON_ID: 'lae-export-button',
    DOWNLOAD_LIST_ID: 'lae-download-list',
    STATUS_ID: 'lae-status',
}

const Commands = {
    ReportBooks: 'ReportBooks',
    GetBook: 'GetBook',
    Download: 'Download',
    UpdateBook: 'UpdateBook'
}

function getTailAfter(str, sep) {
    return str?.substring(str?.lastIndexOf(sep) + 1)
}

// https://github.com/brianloveswords/base64url/blob/master/src/base64url.ts
function base64UrlDecode(s) {
    // Replace non-url compatible chars with base64 standard chars
    s = s.replace(/-/g, '+').replace(/_/g, '/')
    // const paddingLen = (4 - s.length % 4) % 4
    // s = s + '='.repeat(paddingLen)
    return atob(s);
}

// https://stackoverflow.com/a/31976060/404271
function makePathNameSafe(name) {
    return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
}

function dashify(s) {
    return s.replace(/[^a-zA-Z0-9]/g, '-');
}

function delayMs(ms) {
    return new Promise(res => setTimeout(res, ms))
}

async function delayMsWithRatio(ms, ratio) {
    await delayMs(ms * (1 - ratio + 2 * ratio * Math.random()))
}

async function delayRoughlyMs(ms) {
    await delayMsWithRatio(ms, 0.4)
}

const popupPage = {
    getLaeExportButton: () => document.getElementById(Constants.EXPORT_BUTTON_ID),
    getLaeExplanationBanner: () => document.getElementById(Constants.LAE_EXPLANATION_BANNER_ID),
    getLaeMain: () => document.getElementById(Constants.LAE_MAIN_ID),
    getLaeDownloadList: () => document.getElementById(Constants.DOWNLOAD_LIST_ID),
    getLaeStatusDiv: () => document.getElementById(Constants.STATUS_ID),

    renderDownloadList: function (book) {
        if (!book) {
            popupPage.getLaeExplanationBanner().style.display = 'block'
            popupPage.getLaeMain().style.display = 'none';
            return
        }

        popupPage.getLaeExportButton().disabled = book.downloading
        const allFiles = { ...book.metaFiles, ...book.audios }
        Object.keys(allFiles).forEach(
            filename => upsertDownloadListItem(filename, allFiles[filename])
        )
        popupPage.getLaeExplanationBanner().style.display = 'none'
        popupPage.getLaeMain().style.display = 'block';
        const total = Object.keys(allFiles).length
        const downloadedCount = Object.keys(allFiles).filter(filename => allFiles[filename].downloaded).length
        updateStatus(downloadedCount === 0 ? '' : `Downloading: ${downloadedCount}/${total}`)

        function upsertDownloadListItem(filename, urlInfo) {
            const liId = getLiId(filename)
            let li = popupPage.getLaeDownloadList().querySelector(`li[id="${liId}"`)
            if (!li) {
                li = document.createElement('li')
                li.id = liId
                const a = document.createElement('a')
                li.appendChild(a)
                popupPage.getLaeDownloadList().appendChild(li)
            }
            li.style.backgroundColor = urlInfo.downloaded ? 'lightgreen' : ''
            const a = li.querySelector('a')
            a.textContent = filename
            a.href = urlInfo.url
        }

        function getLiId(text) {
            // return `li-${dashify(text)}`
            return `li-${text}`
        }

        function updateStatus(text) {
            popupPage.getLaeStatusDiv().innerText = text
        }
    },

    exportAudioHf: function (titleId) {
        return function () {
            chrome.runtime.sendMessage({
                command: Commands.Download,
                titleId: titleId,
            })
        }
    },

    main: async function (titleId) {
        if (!titleId) {
            return
        }

        popupPage.getLaeExportButton().addEventListener('click', popupPage.exportAudioHf(titleId));

        while (true) {
            // const book = await chrome.runtime.sendMessage({
            //     command: Commands.GetBook,
            //     titleId: titleId
            // });
            const booksWrapper = await chrome.storage.session.get('books') ?? {}
            const books = booksWrapper.books ?? {}
            const book = books[titleId]
            popupPage.renderDownloadList(book)
            await delayMs(2000)
        }
    }
}

export {
    Commands,
    getTailAfter, base64UrlDecode, makePathNameSafe, dashify,
    delayMs, delayMsWithRatio, delayRoughlyMs,
    popupPage
}