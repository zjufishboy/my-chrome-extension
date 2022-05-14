console.log("测试b站脚本");

const videoContainer = document.createElement("div");
videoContainer.style.position = "fixed";
videoContainer.style.right = "10px";
videoContainer.style.bottom = "10px";
videoContainer.style.width = "400px";
videoContainer.style.height = "400px";
videoContainer.style.borderRadius = "12px";
videoContainer.style.backgroundColor = "white";
videoContainer.style.zIndex = "1001";
videoContainer.style.boxShadow = "2px 2px 2px 1px #00000011";
videoContainer.style.display = "flex";
videoContainer.style.flexDirection = "column";
videoContainer.style.justifyContent = "flex-end";

const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "space-between";

const buttonStart = document.createElement("button");
buttonStart.innerText = "开始录制";
const buttonStop = document.createElement("button");
buttonStop.innerText = "结束录制";
const buttonShow = document.createElement("button");
buttonShow.innerText = "播放录制";
const buttonSave = document.createElement("button");
buttonSave.innerText = "保存录制";

[buttonStart, buttonStop, buttonShow, buttonSave].forEach((button) => {
  button.classList = ["wtf-button"];
  button.style.width = "25%";
  button.style.height = "40px";
  button.style.outline = "none";
  button.style.border = "none";
  buttonContainer.appendChild(button);
});

const recordVideo = document.createElement("video");
recordVideo.style.height = "340px";
recordVideo.style.width = "100%";
recordVideo.style.objectFit = "contain";
recordVideo.style.backgroundColor = "black";

const commentContainer = document.createElement("div");
commentContainer.innerText = "还没初始化，请勿操作";
commentContainer.style.height = "20px";
commentContainer.style.width = "100%";
commentContainer.style.backgroundColor = "white";
commentContainer.style.display = "flex";
commentContainer.style.justifyContent = "center";
commentContainer.style.alignItems = "center";
document.body.appendChild(videoContainer);

videoContainer.appendChild(commentContainer);
videoContainer.appendChild(recordVideo);
videoContainer.appendChild(buttonContainer);

const globalData = {
  blobData: null,
  logs: [],
  recordTime: 0,
  hasInit: false,
};

const trackLog = (prefix) => (text) => {
  globalData.logs.push(prefix + text);
  if (prefix === "[ERROR]") {
    commentContainer.style.color = "red";
  } else {
    commentContainer.style.color = "black";
  }
  commentContainer.innerHTML = text;
};

const logHelper = {
  log: trackLog("[LOG]"),
  error: trackLog("[ERROR]"),
};

recordVideo.addEventListener("play", () => {
  logHelper.log("时长：" + recordVideo.duration);
});

const downloadBlob = (fileName, blob) => {
  const fakeLink = document.createElement("a");
  fakeLink.href = URL.createObjectURL(blob);
  fakeLink.download = fileName;
  fakeLink.style.display = "none";
  document.body.appendChild(fakeLink);
  fakeLink.click();
  fakeLink.remove();
  URL.revokeObjectURL(fakeLink.href);
};

const handleTest = () => {
  const targetVideo = document.getElementsByTagName("video")[0];
  if (!targetVideo) {
    logHelper.error("没找到video");
    return;
  }
  logHelper.log("开始处理");
  const mediaRecorder = new MediaRecorder(targetVideo.captureStream());
  const videoData = [];
  mediaRecorder.ondataavailable = (e) => {
    videoData.push(e.data);
  };

  globalData.hasInit = true;

  setInterval(() => {
    console.log("录制器情况：", mediaRecorder.state);
    if (mediaRecorder.state === "recording") {
      globalData.recordTime++;
      logHelper.log("正在录制：时长=" + globalData.recordTime);
    } else if (mediaRecorder.state === "paused") {
      logHelper.error("录制器已暂停");
    } else {
      if (globalData.hasInit) {
        logHelper.error("录制器处于闲置态，请检查逻辑");
      } else {
        logHelper.error("录制器处于闲置态");
      }
    }
  }, 1000);

  buttonStart.addEventListener("click", () => {
    if (!globalData.hasInit) {
      logHelper.error("还没初始化，点击无效");
      return;
    }
    logHelper.log("开始录制");
    globalData.blobData = null;
    targetVideo.play();
    mediaRecorder.start();
  });

  buttonStop.addEventListener("click", () => {
    if (!globalData.hasInit) {
      logHelper.error("还没初始化，点击无效");
      return;
    }
    logHelper.log("结束录制");
    targetVideo.pause();
    mediaRecorder.stop();
  });

  buttonShow.addEventListener("click", () => {
    if (!globalData.hasInit) {
      logHelper.error("还没初始化，点击无效");
      return;
    }
    logHelper.log("展示录制");
    const blob = new Blob(videoData, {
      type: "video/mp4",
    });
    globalData.blobData = blob;
    const videoUrl = URL.createObjectURL(blob);
    recordVideo.src = videoUrl;
    recordVideo.play();
  });

  buttonSave.addEventListener("click", () => {
    if (!globalData.hasInit) {
      logHelper.error("还没初始化，点击无效");
      return;
    }
    logHelper.log("保存录制");
    if (!globalData.blobData) {
      logHelper.error("暂时还没有录制好");
      return;
    }
    downloadBlob("录制内容", globalData.blobData);
  });
};

setTimeout(handleTest, 5000);
