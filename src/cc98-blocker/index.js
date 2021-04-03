const script = document.createElement("script");
script.src = chrome.extension.getURL("api.js");
script.onload = function () {
  script.remove();
};
(document.head || document.documentElement).appendChild(script);

let blockInfoStr = localStorage.getItem("blockInfo");
let blockInfo = {};
if (!blockInfoStr) {
  blockInfo = {
    block_username_list: [],
    block_aonymous: true,
  };
  localStorage.setItem("blockInfo", JSON.stringify(blockInfo));
} else {
  blockInfo = JSON.parse(blockInfoStr);
}
let currentName = "";

const div = document.createElement("div");
div.className = "wtf-cc98-block-button-group";
const divButton = document.createElement("button");
divButton.innerHTML = "拉黑";
divButton.className = "wtf-cc98-block-button";
div.appendChild(divButton);

const add_block_name = () => {
  blockInfo.block_username_list.push(currentName);
  localStorage.setItem("blockInfo", JSON.stringify(blockInfo));
};

const hideMenu = () => {
  div.setAttribute("style", "display: none;");
};

divButton.addEventListener("click", () => {
  add_block_name();
  hideMenu();
  window.location.reload();
});

const showMenu = (x, y, name) => {
  div.setAttribute("style", `display:flex;top:${y}px;left:${x}px`);
  currentName = name;
  if (blockInfo.block_username_list.includes(currentName)) {
    divButton.innerHTML = "我也不知道为啥会出现";
  } else {
    divButton.innerHTML = "拉黑";
  }
};

document.body.appendChild(div);
document.addEventListener("contextmenu", (e) => {
  if (window.location.pathname !== "/newTopics") {
    return;
  }
  if (e.target.className && e.target.className === "focus-topic-userName") {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    const name = e.target.innerHTML;
    showMenu(x, y, name);
  } else {
    hideMenu();
  }
});

document.addEventListener("click", (e) => {
  hideMenu();
});
