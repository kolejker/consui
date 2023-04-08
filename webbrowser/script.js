const backBtn = document.getElementById("back-button");
const nextBtn = document.getElementById("next-button");
const refreshBtn = document.getElementById("refresh-button");
const homeBtn = document.getElementById("home-button");
const urlInput = document.getElementById("url-input");
const browserFrame = document.getElementById("browser-frame");

let history = [];

backBtn.addEventListener("click", () => {
  if (history.length > 1) {
    history.pop();
    browserFrame.src = history[history.length - 1];
  }
});

nextBtn.addEventListener("click", () => {
  // TODO: implement forward navigation
});

refreshBtn.addEventListener("click", () => {
  browserFrame.contentWindow.location.reload();
});

homeBtn.addEventListener("click", () => {
  history.push("https://google.com");
  browserFrame.src = "https://google.com";
});

urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let url = urlInput.value;
    if (url.includes("?url=")) {
      url = url.split("?url=")[1];
    }
    history.push(url);
    browserFrame.src = url;
  }
});
