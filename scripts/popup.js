import { getTailAfter, popupPage } from "./common.js"

const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
const titleId = getTailAfter(activeTab?.url, '/')
popupPage.main(titleId)