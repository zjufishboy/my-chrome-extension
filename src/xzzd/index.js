/**
 * 文件描述：给学在浙大的课件下载流程做个优化
 */

const button = document.createElement("button");
button.className = "wtf-xzzd-button";
button.innerHTML = "下载课件";

const xzzd_log_db = [];
const env = "prodution";

const logInfo = (type, info) => {
  xzzd_log_db.push(`${type}:${JSON.stringify(info)}`);
  env === "dev" && console.log("[学在浙大]", type, info);
};

// 处理下载
const downloadBlob = (blob, name = "") => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};
const handleClickRightButton = () => {
  const db_data = xzzd_log_db.join("\n");
  navigator.clipboard.writeText(db_data);
  const blob = new Blob([db_data], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, "学在浙大下载日志.log");
  console.info("[日志]", xzzd_log_db);
};

// 处理点击
const handleClickLeftButton = () => {
  const url = window.location.pathname;
  const data = url.match("/course/([0-9]+)/*");
  logInfo("[课程号正则]", data);
  if (data.length >= 1) {
    const courseId = data[1];
    logInfo("[课程号]", data[1]);
    handleDownload(courseId);
  } else {
    alert("当前页面错误，请联系开发者");
  }
};

const handleClick = (e) => {
  e.preventDefault();
  if (e.button === 0) {
    // 左键
    handleClickLeftButton();
  } else {
    // 右键
  }
};

// 文件请求
const downloadFile = (url = "", name = "") => {
  logInfo("[下载信息]", url, name);
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      downloadBlob(blob, name);
    });
};

// 获取链接
const getURL = (id = 0, name = "") => {
  const apiStr = `https://courses.zju.edu.cn/api/uploads/reference/document/${id}/url?preview=true`;
  return new Promise((res, rej) => {
    fetch(apiStr)
      .then((res) => res.json())
      .then((res) => {
        logInfo("[课件接口]", res);
        logInfo("[课件地址]", res.url);
        const url = res.url.split("?")[0];
        const actualName = decodeURI(res.url).split("name=")[1];
        logInfo("[文件名]", actualName);
        downloadFile(res.url, actualName);
      })
      .catch(rej)
      .then(res);
  });
};

// 处理数据收集
const handleDataCollect = async (dataArray = []) => {
  let count = 0;
  for (const item of dataArray) {
    count++;
    button.innerHTML = `第${count}个`;
    await getURL(item.reference_id, item.name);
  }
  button.innerHTML = "下载完成";
  button.innerHTML = "下载课件";
};

// 处理下载
const handleDownload = (courseId = 0) => {
  const apiStr = `https://courses.zju.edu.cn/api/course/${courseId}/coursewares?page=1&page_size=100`;
  fetch(apiStr)
    .then((res) => res.json())
    .then((res) => {
      if (res.activities && res.activities.length > 0) {
        const idArray = [];
        const data = res.activities.map((item) => item.uploads || []);
        data.forEach((item) => {
          idArray.push(...item);
        });
        logInfo("[课件信息列表]", idArray);
        handleDataCollect(idArray);
      } else {
        alert("当前课程无课件");
      }
    });
};

const handleContextMenu = (e) => {
  e.preventDefault();
  handleClickRightButton();
};

button.addEventListener("contextmenu", handleContextMenu);
button.addEventListener("click", handleClick);
document.body.append(button);
