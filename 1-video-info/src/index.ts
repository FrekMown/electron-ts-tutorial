import { app, BrowserWindow, ipcMain } from "electron";
import * as ffmpeg from "fluent-ffmpeg";

let mainWindow: BrowserWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    height: 800,
    width: 1200,
  });
  mainWindow.loadURL(`file://${__dirname}/../templates/index.html`);
});

ipcMain.on("video:submit", (_, path) => {
  ffmpeg.ffprobe(path, (_, metadata) => {
    mainWindow.webContents.send("video:metadata", metadata.format.duration);
  });
});
