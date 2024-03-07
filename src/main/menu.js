const { app, Menu } = require("electron");

class WindowNailMenu {
  menu = null;
  constructor() {
    this.menu = Menu.buildFromTemplate([
      {
        label: "文件",
        submenu: [
          {
            label: "新建文件",
            accelerator: process.platform === "darwin" ? "Cmd+N" : "Ctrl+N",
            click: () => {
              // 新建文件的操作
            },
          },
          {
            label: "打开文件",
            accelerator: process.platform === "darwin" ? "Cmd+O" : "Ctrl+O",
            click: () => {
              // 打开文件的操作
            },
          },
        ],
      },
    ]);

    if (process.platform === "darwin") {
      app.dock.setMenu(menu);
    } else {
      Menu.setApplicationMenu(menu);
    }
  }
}
module.exports = WindowNailMenu;
