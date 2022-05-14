chrome.contextMenus.create({
  id: "98-emoji",
  type: "normal",
  title: "添加到98Emoji面板",
  documentUrlPatterns: ["https://*.cc98.org/*"],
  contexts: ["image"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info, tab);
  chrome.tabs.sendMessage(tab.id, `addEmoji:(${info.srcUrl})`);
});
