/**
 * 文件描述：给美剧天堂的播放页面做的修复和优化
 */
const button = document.createElement("button");
button.className = "wtf-mjtt-button-next";
button.innerHTML = "下一集";

const handleGoToNext = () => {
  const url = window.location.pathname;
  console.debug("[URL]", url);
  const data = url.match("(.+/)([0-9]+)-([0-9]+)-([0-9]+)(.html)?");
  console.debug(data[1], data[2], data[3], data[4]);
  const currentIdx = parseInt(data[4], 10);
  const newURL = data[1] + data[2] + "-" + data[3] + "-" + (currentIdx + 1);
  console.debug(newURL);
  window.location.assign(newURL);
};

button.addEventListener("click", handleGoToNext);

document.body.append(button);
