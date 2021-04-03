const button = document.createElement("div");
button.className = "play-list";
button.innerHTML = "<<";
let currentMode = false;

const handleClick = () => {
  const div = document.getElementsByClassName("bofangList")[0];
  if (currentMode) {
    div.setAttribute("style", "right:-366px");
    button.innerHTML = "<<";
  } else {
    div.setAttribute("style", "right:0px");
    button.innerHTML = ">>";
  }
  currentMode = !currentMode;
};

button.addEventListener("click", handleClick);
document.body.appendChild(button);
