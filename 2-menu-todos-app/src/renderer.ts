import { ipcRenderer } from "electron";
const list = document.querySelector("ul");

ipcRenderer.on("todo:add", (event, todo) => {
  const li = document.createElement("li");
  const text = document.createTextNode(todo);

  li.appendChild(text);
  list.appendChild(li);
});

// Clear all todos
ipcRenderer.on("todos:clear", () => {
  list.innerHTML = "";
});
