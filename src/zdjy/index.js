const button = document.getElementsByClassName("xlogin")[0];
const useless_button = document.getElementsByClassName("xlogin-tog")[0];

useless_button.remove();
button.addEventListener("click", () => {
  window.location.assign("/jyxt/xtht/login/ssoswitch.zf");
});
