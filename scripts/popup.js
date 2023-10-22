import { Commands, getTailAfter, dashify, delayMs } from "./common.js"

// globals
let book
let titleId

// const
const LAE_EXPLANATION_BANNER_ID = "lae-explanation-banner"
const LAE_MAIN_ID = "lae-main"
const EXPORT_BUTTON_ID = "lae-export-button"
const DOWNLOAD_LIST_ID = "lae-download-list"
const STATUS_ID = "lae-status"

const laeExplanationBanner = document.getElementById(LAE_EXPLANATION_BANNER_ID);
const laeMain = document.getElementById(LAE_MAIN_ID);
const laeDownloadList = document.getElementById(DOWNLOAD_LIST_ID);
const laeExportButton = document.getElementById(EXPORT_BUTTON_ID);
const laeStatusDiv = document.getElementById(STATUS_ID)

function renderDownloadList(book) {
    if (!book) {
        laeExplanationBanner.style.display = 'block'
        laeMain.style.display = 'none';
        return
    }

    laeExportButton.disabled = book.downloading
    const allFiles = { ...book.metaFiles, ...book.audios }
    Object.keys(allFiles).forEach(
        filename => upsertDownloadListItem(filename, allFiles[filename])
    )
    laeExplanationBanner.style.display = 'none'
    laeMain.style.display = 'block';
    const total = Object.keys(allFiles).length
    const downloadedCount = Object.keys(allFiles).filter(filename => allFiles[filename].downloaded).length
    updateStatus(downloadedCount === 0 ? '' : `Downloading: ${downloadedCount}/${total}`)

    function upsertDownloadListItem(filename, urlInfo) {
        const liId = getLiId(filename)
        let li = laeDownloadList.querySelector(`li[id="${liId}"`)
        if (!li) {
            li = document.createElement('li')
            li.id = liId
            const a = document.createElement('a')
            li.appendChild(a)
            laeDownloadList.appendChild(li)
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
        laeStatusDiv.innerText = text
    }
}

function exportAudio() {
    chrome.runtime.sendMessage({
        command: Commands.Download,
        titleId: titleId
    })
}

async function main() {
    laeExportButton.addEventListener('click', exportAudio);

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
    titleId = getTailAfter(activeTab?.url, '/')
    if (!titleId) {
        return
    }

    while (true) {
        // const book = await chrome.runtime.sendMessage({
        //     command: Commands.GetBook,
        //     titleId: titleId
        // });
        const booksWrapper = await chrome.storage.session.get('books') ?? {}
        const books = booksWrapper.books ?? {}
        const book = books[titleId]
        renderDownloadList(book)
        await delayMs(2000)
    }
}

main()
