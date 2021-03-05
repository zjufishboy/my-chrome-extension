/**
 * 文件描述：给cc98页面做的表情包收集器+快速回复按钮
 */
// 快速去回复的按钮
const button = document.createElement("button");
button.className = "wtf-cc98-button";
button.innerHTML = "去回复";
const handleGoToBottom = () => {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};
button.addEventListener("click", handleGoToBottom);
document.body.append(button);

// 表情包工具
const div = document.createElement("div");
div.className = "wtf-cc98-emoji-list";
const data = localStorage.getItem("CC98_Emoji_list");
// 没取到的话就设置一下
if (!data) {
  localStorage.setItem("CC98_Emoji_list", "[]");
}
const actual_data = JSON.parse(data) || [];
const emoji_list = actual_data.slice(0, 10);
if (actual_data.length > 10) {
  localStorage.setItem("CC98_Emoji_list", JSON.stringify(emoji_list));
}

// 移除特定下标的emoji
const removeEmojiByIndex = (index) => {
  if (emoji_list.length < index + 1) {
    return;
  }
  emoji_list.splice(index, 1);
  localStorage.setItem("CC98_Emoji_list", JSON.stringify(emoji_list));
  const needDeleteEle = emoji_list.length === 0;
  if (needDeleteEle) {
    div.remove();
  }
};

// 添加新emoji
const handleAddEmoji = (emoji, index = emoji_list.length) => {
  const emoji_img = document.createElement("img");
  emoji_img.className = "wtf-cc98-emoji";
  emoji_img.src = emoji;
  emoji_img.alt = "表情包加载中";
  // 给打一个标记，防止点击到
  emoji_img.setAttribute("wtf-tag", "CC98-emoji");
  const emoji_ubb = `[img]${emoji}[/img]`;
  emoji_img.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    emoji_img.remove();
    removeEmojiByIndex(index);
  });
  emoji_img.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.button);
    if (e.button === 0) {
      // 快速复制ubb代码
      navigator.clipboard.writeText(emoji_ubb);
    } else {
      emoji_img.remove();
    }
  });
  div.appendChild(emoji_img);
};

// 移除第一个emoji
const handleShiftEmoji = () => {
  if (!div.firstChild) return;
  div.removeChild(div.firstChild);
};

for (let i = 0; i < emoji_list.length; i++) {
  handleAddEmoji(emoji_list[i], i);
}

if (emoji_list.length > 0) {
  document.body.append(div);
}

// 处理添加
const handleAddEmojiToView = (img_url) => {
  if (/cc98/.test(img_url)) {
    const needAddEle = emoji_list.length === 0;
    emoji_list.push(img_url);
    handleAddEmoji(img_url);
    if (needAddEle) {
      document.body.append(div);
    }
    if (emoji_list.length >= 10) {
      emoji_list.shift();
      handleShiftEmoji();
    }
    localStorage.setItem("CC98_Emoji_list", JSON.stringify(emoji_list));
  }
};

chrome.runtime.onMessage.addListener((message) => {
  const data = message.match(/addEmoji:\((.*)\)$/);
  if (data.length > 0) {
    const newEmoji = data[1];
    handleAddEmojiToView(newEmoji);
  }
});
