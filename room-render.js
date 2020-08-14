const { clipboard } = require("electron");

const copyInput = document.querySelector(".room-id-input");
const copyBtn = document.querySelector("#copy-id");
const backBtn = document.querySelector("#back-btn");

function init() {
  let roomId = window.localStorage.getItem("roomId");
  copyInput.value = roomId;
  document.title = `SyncMeApp - Room ${roomId}`;
}

function copyIdToClipboard() {
  clipboard.writeText(copyInput.value);
}

function goHome() {
  window.location = "index.html";
}

copyBtn.addEventListener("click", copyIdToClipboard);
backBtn.addEventListener("click", goHome);

init();
