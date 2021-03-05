chrome.contextMenus.create({
  type: "normal",
  title: "添加到98Emoji面板",
  documentUrlPatterns: ["https://*.cc98.org/*"],
  contexts: ["image"],
  onclick: (info, tab) => {
    console.log(info, tab);
    chrome.tabs.sendMessage(tab.id, `addEmoji:(${info.srcUrl})`);
  },
});
