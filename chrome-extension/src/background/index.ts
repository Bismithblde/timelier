chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.query({ active: true }, tabs => {
    const currentTabUrl: string | undefined = tabs[0].url;
    if (currentTabUrl && currentTabUrl.includes(message.urlPattern)) {
      sendResponse(true);
    } else {
      sendResponse(false);
    }
  });

  return true;
});
