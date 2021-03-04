/**
 * 文件描述：给智云课堂的播放页面做的修复和优化
 * 为啥做了一次跳转：因为H5跨域资源不能主动下载
 */

const button = document.createElement("button");
button.className = "wtf-zykt-button";
const host = window.location.host;
const isVideoHost = host === "vod.cmc.zju.edu.cn";
button.innerHTML = isVideoHost ? "下载" : "前往下载";

const downloadVideo = () => {
  if (isVideoHost) {
    const file_url = window.location.href.split("?")[0];
    const link = document.createElement("a");
    link.href = file_url;
    link.download = "video.mp4";
    link.click();
  } else {
    const video = document.getElementById("cmc_player_video");
    if (video.src) {
      window.location.assign(video.src);
    }
  }
};

button.addEventListener("click", downloadVideo);

document.body.append(button);
