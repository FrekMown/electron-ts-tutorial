import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from "electron";

let mainWindow: BrowserWindow;
let addWindow: BrowserWindow | null = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    height: 800,
    width: 1200,
  });

  mainWindow.loadURL(`file://${__dirname}/../templates/index.html`);

  // Whenever mainWindow is closed, quit app
  mainWindow.on("close", () => app.quit());

  // replaces default electron menus
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add new Todo",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  addWindow.loadURL(`file://${__dirname}/../templates/add-todo.html`);

  // Claim memory when closed by setting it to null
  addWindow.on("closed", () => {
    addWindow = null;
  });
}

// Send signal to frontend to clear all todos
function clearTodos() {
  mainWindow.webContents.send("todos:clear");
}

// We receive todo:add from add-todo.html and then send it back
// to be received in main window
ipcMain.on("todo:add", (_, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  // We close addWindow when todo is submitted
  addWindow.close();
});

// On macOS it merges first option to app menu
const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click: () => createAddWindow(),
      },
      {
        label: "Clear Todos",
        accelerator: process.platform === "darwin" ? "Command+Shift+N" : "Ctrl+Shift+N",
        click: () => clearTodos(),
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click: () => app.quit(),
      },
    ],
  },
];

// Support for macOS, avoids merging File menu with app menu
if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

// Restore developer tools (we lost the ability to use it when redifining menu)
// Only when not in production
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle Developer Tools",
        accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click: (_, focusedWindow) => {
          focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  });
}
