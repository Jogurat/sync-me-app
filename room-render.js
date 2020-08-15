const { clipboard } = require("electron");
const { dialog } = require("electron").remote;

//TODO: Skloni hardkodovan URL

const socket = io("https://sync-me-app-server.herokuapp.com");

const copyInput = document.querySelector(".room-id-input");
const copyBtn = document.querySelector("#copy-id");
const backBtn = document.querySelector("#back-btn");
const videoPlayer = document.querySelector("#vid");
const openDialogBtn = document.querySelector("#open-vid");
const openSubsBtn = document.querySelector("#open-subs");
const subtitles = document.querySelector("#subs");
let roomId = window.localStorage.getItem("roomId");

function init() {
  socket.emit("joinRoom", roomId);
  copyInput.value = roomId;
  document.title = `SyncMeApp - Room ${roomId}`;
}

function copyIdToClipboard() {
  clipboard.writeText(copyInput.value);
}

function goHome() {
  window.location = "index.html";
}

let wasEmittedPlay = false;

function emitPlay() {
  // if (!wasEmittedPlay) {
  socket.emit("play", roomId);
  wasEmittedPlay = false;
  console.log("emmiting play", roomId);
  // }
}

let wasEmittedPause = false;

function emitPause() {
  // if (!wasEmittedPause) {
  socket.emit("pause", roomId);
  wasEmittedPause = false;
  console.log("emmiting pause", roomId);
  // }
}

let seekTime = -1;

function emitSeek() {
  if (seekTime !== videoPlayer.currentTime) {
    seekTime = videoPlayer.currentTime;
    console.log("emmiting seek");

    wasEmittedSeek = true;
    socket.emit("seek", { roomId, currentTime: videoPlayer.currentTime });
  }
}

socket.on("play", () => {
  console.log("hello from socket play");
  wasEmittedPlay = true;
  videoPlayer.play();
});

socket.on("pause", () => {
  wasEmittedPause = true;
  videoPlayer.pause();
});

let wasEmittedSeek = false;

socket.on("seek", (currentTime) => {
  if (videoPlayer.currentTime !== currentTime) {
    videoPlayer.currentTime = currentTime;
    wasEmittedSeek = true;
  }
});

copyBtn.addEventListener("click", copyIdToClipboard);
backBtn.addEventListener("click", goHome);
videoPlayer.addEventListener("play", emitPlay);
videoPlayer.addEventListener("pause", emitPause);
videoPlayer.addEventListener("seeked", emitSeek);
openDialogBtn.addEventListener("click", async () => {
  const path = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
  });
  videoPlayer.setAttribute("src", path.filePaths[0]);
});

openSubsBtn.addEventListener("click", async () => {
  const path = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Subtitles", extensions: ["srt", "vtt"] }],
  });
  subtitles.setAttribute("src", path.filePaths[0]);
});

init();
