/*global chrome*/
var currentTab;
chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension successfully installed!');
  return;
});

chrome.action.onClicked.addListener(createPanel);
function createPanel(tab) {
  currentTab = tab;
  if (!tab) return;
  const contentWindowId = tab.windowId;
  try {
    const panelWindowInfo = chrome.windows.create({
      url: chrome.runtime.getURL('index.html'),
      type: 'panel',
      height: 627,
      width: 642,
    });
  } catch (error) {
    console.log(error);
  }
}

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === 'knockknock');
  port.onMessage.addListener(function (msg) {
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
        // setCapturedText(results[0].result);
        port.postMessage({ result: results[0].result });
      }
    );
  });
});
