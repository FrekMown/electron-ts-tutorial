import { ipcRenderer } from "electron";

console.log("hey");

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault();
  const { value } = document.querySelector("input");
  ipcRenderer.send("todo:add", value);
});
