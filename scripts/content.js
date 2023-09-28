const ENDING_DATE = new Date(2023, 9, 10) // 2030-Oct-10
const LAE_NOTICE_ID = 'lae-update-notice'
const LAE_NOTICE_CLOSE_ID = 'lae-update-notice'

async function main() {
    const notified = await chrome.storage.local.get('lae_update_notified')
    if (Date.now() < ENDING_DATE.getTime() && !notified?.lae_update_notified) {
        const noticeHtml = `Libby Audio Extporter now uses popup (just click the extension icon) instead of inserting elements to the page.`
        const noticeDiv = document.createElement('div')
        noticeDiv.id = LAE_NOTICE_ID
        noticeDiv.innerHTML = noticeHtml
        noticeDiv.style.textAlign = 'center'
        noticeDiv.style.fontStyle = 'italic'
        noticeDiv.style.border = '1px solid'
        const noticeCloseButton = document.createElement('span')
        noticeCloseButton.id = LAE_NOTICE_CLOSE_ID
        noticeCloseButton.style.fontStyle = 'normal'
        noticeCloseButton.style.paddingLeft = '0.2em'
        noticeCloseButton.style.paddingRight = '0.2em'
        noticeCloseButton.style.marginLeft = '2em'
        noticeCloseButton.style.border = '1px solid'
        noticeCloseButton.textContent = '\u2716'
        noticeDiv.appendChild(noticeCloseButton)
        noticeCloseButton.onclick = async () => {
            document.getElementById(LAE_NOTICE_ID).remove()
            await chrome.storage.local.set({ lae_update_notified: true })
        }
        document.body.insertBefore(noticeDiv, document.body.firstChild);
    }

    if (Date.now() >= ENDING_DATE.getTime()) {
        await chrome.storage.local.remove('lae_update_notified')
    }
}

main()