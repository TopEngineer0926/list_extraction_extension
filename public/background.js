/*global chrome*/
var currentTab;
chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome extension successfully installed!");
  return;
});

const DEFAULT_WIDTH = 660;
const DEFAULT_HEIGHT = 630;

chrome.action.onClicked.addListener(createPanel);
function createPanel(tab) {
  currentTab = tab;
  if (!tab) return;
  try {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      top: 200,
      left: 400,
      height: DEFAULT_HEIGHT,
      width: DEFAULT_WIDTH,
    });
  } catch (error) {
    console.log(error);
  }
}

chrome.windows.onBoundsChanged.addListener(function (windowId) {
  // Do something when the window is resized
  chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
  });
});

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "init_list_extraction");
  port.onMessage.addListener(function (msg) {
    if (msg.type === "get-user-data") {
      function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        return document.documentElement.innerText;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: modifyDOM,
        },
        (results) => {
          port.postMessage({ result: results[0].result, url: currentTab.url });
        }
      );
    }
  });
});
