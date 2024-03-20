const { app } = require("electron");
const Window = require("./window.js");
const WindowNailTray = require("./tray.js");
require("./ipc.js");
app.whenReady().then(() => {
  const window = new Window();
  new WindowNailTray(window);
  window.createWindow();
});
