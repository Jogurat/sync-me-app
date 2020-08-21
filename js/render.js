const { dialog } = require("electron").remote;
// const axios = require("axios").default;

//TODO: Skloni hardkodovan URL
//const socket = io("http://localhost:3000");

// const videoPlayer = document.querySelector("#vid");
// const openDialogBtn = document.querySelector("#open-vid");
const newRoomBtn = document.querySelector("#new-room");
const spinIcon = document.querySelector("#spin-icon");
const newRoomBtnText = document.querySelector("#create-new-room");
const plusIcon = document.querySelector("#plus-icon");
const newRoomContainer = document.querySelector(".room-id");
const joinRoomBtn = document.querySelector("#join-room-btn");
//TODO bolje ime
const joinRoomId = document.querySelector("#join-room-id");

// videoPlayer.addEventListener("play", () => {
//   socket.emit(
//     "play",
//     newRoomContainer.innerHTML ? newRoomContainer.innerHTML : joinRoomId.value
//   );
// });

// videoPlayer.addEventListener("pause", () => {
//   socket.emit(
//     "pause",
//     newRoomContainer.innerHTML ? newRoomContainer.innerHTML : joinRoomId.value
//   );
// });

// socket.on("play", () => {
//   videoPlayer.play();
// });

// socket.on("pause", () => {
//   videoPlayer.pause();
// });

function joinRoom(roomId) {
  // socket.emit("joinRoom", roomId);
  window.localStorage.setItem("roomId", roomId);
  window.location = "room.html";
}

newRoomBtn.addEventListener("click", async () => {
  //TODO: Skloni hardkodovan URL
  try {
    let icon = document.createElement("i");
    newRoomBtnText.innerHTML = "";
    icon.classList = "fa fa-spinner fa-pulse fa-2x fa-fw";
    spinIcon.appendChild(icon);
    spinIcon.removeChild(plusIcon);
    let res = await axios.get(
      "https://sync-me-app-server.herokuapp.com/newroom"
    );
    spinIcon.removeChild(icon);
    let roomId = res.data.uid;
    newRoomContainer.innerHTML = roomId;
    joinRoom(roomId);
  } catch (e) {
    console.log(e);
  }
});

joinRoomBtn.addEventListener("click", () => {
  //socket.emit("joinRoom", joinRoomId.value);
  if (joinRoomId.value !== "") joinRoom(joinRoomId.value);
});

// openDialogBtn.addEventListener("click", async () => {
//   const path = await dialog.showOpenDialog({
//     properties: ["openFile"],
//     filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
//   });
//   videoPlayer.setAttribute("src", path.filePaths[0]);
// });
