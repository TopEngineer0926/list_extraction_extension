chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  if (message.type == 'getPageText') {
    // console.log('====', document.documentElement.innerText);
    sendResponse({ done: document.documentElement.innerText });
  }
});
