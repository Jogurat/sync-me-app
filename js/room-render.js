const { remote, clipboard } = require("electron");
const { dialog } = require("electron").remote;
const fs = remote.require("fs");
//TODO: Skloni hardkodovan URL

const socket = io("https://sync-me-app-server.herokuapp.com");

const copyInput = document.querySelector(".room-id-input");
const copyBtn = document.querySelector("#copy-id");
const backBtn = document.querySelector("#back-btn");
const videoPlayer = document.querySelector("#vid");
const openDialogBtn = document.querySelector("#open-vid");
const openSubsBtn = document.querySelector("#open-subs");
const subtitles = document.querySelector("#subs");
const copiedToast = document.querySelector(".toast");
let roomId = window.localStorage.getItem("roomId");

function init() {
  socket.emit("joinRoom", roomId);
  copyInput.value = roomId;
  document.title = `SyncMeApp - Room ${roomId}`;
}

function copyIdToClipboard() {
  clipboard.writeText(copyInput.value);
  copiedToast.classList.toggle("show");

  setTimeout(() => {
    copiedToast.classList.toggle("show");
  }, 1000);
}

function goHome() {
  window.location = "index.html";
}

let wasEmittedPlay = false;

function emitPlay() {
  if (!wasEmittedPlay) {
    socket.emit("play", roomId);
    //wasEmittedPlay = false;
    console.log("emmiting play", roomId);
  }
}

let wasEmittedPause = false;

function emitPause() {
  if (!wasEmittedPause) {
    socket.emit("pause", roomId);
    //wasEmittedPause = false;
    console.log("emmiting pause", roomId);
  }
}

let seekTime = -1;

function emitSeek() {
  if (!gotSeek) {
    wasEmittedSeek = true;
    seekTime = videoPlayer.currentTime;
    console.log("emmiting seek");
    socket.emit("seek", { roomId, currentTime: videoPlayer.currentTime });
    setTimeout(() => {
      wasEmittedSeek = false;
    }, 500);
  }
}

async function pingServer() {
  try {
    let res = await axios.get("https://sync-me-app-server.herokuapp.com/ping");
    console.log(res.data.msg);
  } catch (err) {
    console.log("Error reaching server");
  }
}

socket.on("play", () => {
  console.log("hello from socket play");
  wasEmittedPlay = true;
  if (videoPlayer.paused) videoPlayer.play();
  //wasEmittedPlay = false;
  setTimeout(() => {
    wasEmittedPlay = false;
  }, 10);
});

socket.on("pause", () => {
  wasEmittedPause = true;
  if (!videoPlayer.paused) videoPlayer.pause();
  // wasEmittedPause = false;
  setTimeout(() => {
    wasEmittedPause = false;
  }, 10);
});

let wasEmittedSeek = false;
let gotSeek = false;

// TODO: FIX THIS
socket.on("seek", (currentTime) => {
  gotSeek = true;
  if (videoPlayer.currentTime !== currentTime && !wasEmittedSeek) {
    videoPlayer.currentTime = currentTime;
    console.log("got seek from socket");
  }
  setTimeout(() => {
    gotSeek = false;
  }, 500);
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
  if (!path.canceled) videoPlayer.setAttribute("src", path.filePaths[0]);
});

openSubsBtn.addEventListener("click", async () => {
  const path = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Subtitles", extensions: ["srt", "vtt"] }],
  });

  if (path.canceled) return;
  const originalPath = path.filePaths[0];

  // Get subtitle file extension
  let extension = path.filePaths[0].substring(
    originalPath.length - 3,
    originalPath.length
  );

  // If subtitle is .srt, convert it to .vtt, and use that instead
  let subtitlePath;
  if (extension === "srt") {
    fs.readFile(originalPath, "utf8", (err, data) => {
      console.log("hi??");
      if (err) {
        console.log(err);
      } else {
        //console.log(data);
        let regex = /(\d),(\d)/g;
        const vtt = data.replace(regex, "$1.$2");
        let newSubtitles = "WEBVTT\n\n" + vtt;
        //console.log(newSubtitles);
        console.log(originalPath);
        const newPath =
          originalPath.substring(0, originalPath.length - 4) +
          " - by SyncMeApp.vtt";
        console.log(newPath);
        fs.writeFile(newPath, newSubtitles, (err) => {
          if (err) console.log(err);
          subtitlePath = newPath;
          subtitles.setAttribute("src", subtitlePath);
        });
      }
    });
  } else {
    subtitlePath = originalPath;
    subtitles.setAttribute("src", subtitlePath);
  }
  console.log(extension);
});

init();
//Keeps heroku server alive, pings the server every 10 minutes (600000ms)
setInterval(pingServer, 600000);
