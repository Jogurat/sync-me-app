const { dialog } = require("electron").remote;
// const axios = require("axios").default;

//TODO: Skloni hardkodovan URL
const socket = io("http://localhost:3000");

const videoPlayer = document.querySelector("#vid");
const openDialogBtn = document.querySelector("#open-vid");
const newRoomBtn = document.querySelector("#new-room");
const newRoomContainer = document.querySelector(".room-id");
const joinRoomBtn = document.querySelector("#join-room-btn");
//TODO bolje ime
const joinRoomId = document.querySelector("#join-room-id");

videoPlayer.addEventListener("play", () => {
  socket.emit(
    "play",
    newRoomContainer.innerHTML ? newRoomContainer.innerHTML : joinRoomId.value
  );
});

videoPlayer.addEventListener("pause", () => {
  socket.emit(
    "pause",
    newRoomContainer.innerHTML ? newRoomContainer.innerHTML : joinRoomId.value
  );
});

socket.on("play", () => {
  videoPlayer.play();
});

socket.on("pause", () => {
  videoPlayer.pause();
});

newRoomBtn.addEventListener("click", async () => {
  //TODO: Skloni hardkodovan URL
  window.location = "room.html";

  let res = await axios.get("http://localhost:3000/newRoom");
  let roomId = res.data.uid;
  newRoomContainer.innerHTML = roomId;
  socket.emit("joinRoom", roomId);
});

joinRoomBtn.addEventListener("click", () => {
  socket.emit("joinRoom", joinRoomId.value);
});

openDialogBtn.addEventListener("click", async () => {
  const path = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
  });
  videoPlayer.setAttribute("src", path.filePaths[0]);
});
