const { app } = require("electron");
const Window = require("./window.js");
const WindowNailTray = require("./tray.js");
require("./ipc.js");
const window = new Window();
app.whenReady().then(() => {
  const tray = new WindowNailTray(window);
});
