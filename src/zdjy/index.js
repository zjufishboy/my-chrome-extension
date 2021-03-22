const button = document.getElementsByClassName("xlogin")[0];
const useless_button = document.getElementsByClassName("xlogin-tog")[0];

useless_button?.remove();
button?.addEventListener("click", () => {
  window.location.assign("/jyxt/xtht/login/ssoswitch.zf");
});

const button_new = document.createElement("button");
button_new.className = "wtf-zdjy-button";
button_new.innerHTML = "选调信息";

const handleClick = () => {
  const lmjdid = document.getElementById("lmjdidforfy").value;
  console.log(lmjdid);
  const lx = document.getElementById("lx").value;
  console.log(lx);

  const url = `http://www.career.zju.edu.cn/jyxt/jygz/new/getContent.zf?minCount=0&maxCount=100&lmjdid=${lmjdid}&lx=${lx}`;

  window.location.assign(url);
};

button_new.addEventListener("click", handleClick);
document.body.appendChild(button_new);

function getUrlOfTarget(element) {
  const _path = "http://www.career.zju.edu.cn/jyxt";
  button;
  const lmdz = element.getAttribute("data-src");
  const xwid = element.getAttribute("data-xwid");
  const spid = element.getAttribute("data-spid");
  const lmtype = element.getAttribute("data-lmtype");
  let url = "";
  if (lmtype == 2) {
    url = _path + lmdz + "xwid=" + xwid + "&lmtype=" + lmtype;
  } else if (lmtype == 5) {
    url = _path + lmdz + "spid=" + spid + "&lmtype=" + lmtype;
  }
  return url;
}

if (window.location.pathname === "/jyxt/jygz/new/getContent.zf") {
  linkList = document.getElementsByTagName("a");
  for (let i = 0; i < linkList.length; i++) {
    const oldUrl = linkList[i].getAttribute("href");
    if (oldUrl === "javascript:void(0)") {
      const url = getUrlOfTarget(linkList[i]);
      linkList[i].setAttribute("href", url);
    }
    linkList[i].setAttribute("target", "_blank");
  }
}
