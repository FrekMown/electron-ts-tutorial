import { ipcRenderer } from "electron";

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  const { path } = document.querySelector("input").files[0];
  ipcRenderer.send("video:submit", path);
});

ipcRenderer.on("video:metadata", (event, duration) => {
  document.querySelector("#result").innerHTML = `Video is ${duration} seconds`;
});
