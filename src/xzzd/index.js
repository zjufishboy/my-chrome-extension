/**
 * 文件描述：给学在浙大的课件下载流程做个优化
 */

const button = document.createElement("button");
button.className = "wtf-xzzd-button";
button.innerHTML = "下载课件";

// 处理点击
const handleClick = () => {
  const url = window.location.pathname;
  const data = url.match("/course/([0-9]+)/*");
  if (data.length >= 1) {
    const courseId = data[1];
    handleDownload(courseId);
  } else {
    alert("当前页面错误，请联系开发者");
  }
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

// 文件请求
const downloadFile = (url = "", name = "") => {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      downloadBlob(blob, name);
    });
};

// 获取链接
const getURL = (id = 0, name = "") => {
  const apiStr = `https://courses.zju.edu.cn/api/uploads/reference/document/${id}/url`;
  return new Promise((res, rej) => {
    fetch(apiStr)
      .then((res) => res.json())
      .then((res) => {
        const url = res.url.split("?")[0];
        const format = url.match(/.*[.](.*)$/)[1];
        downloadFile(res.url, name + "." + format);
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
        const data = res.activities.map((item) => item.uploads);
        data.forEach((item) => {
          idArray.push(...item);
        });
        handleDataCollect(idArray);
      } else {
        alert("当前课程无课件");
      }
    });
};

button.addEventListener("click", handleClick);
document.body.append(button);
