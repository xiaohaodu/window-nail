const { app, Tray, Menu } = require("electron");
const path = require("path");
class WindowNailTray {
  tray = null;
  window = null;
  contextMenu = null;
  windowUpdateTimeout = null;
  exit = true;
  constructor(window) {
    app.whenReady().then(() => {
      // 设置托盘图标
      this.tray = new Tray(path.join(__dirname, "../../public/nail-white.png"));
      this.window = window;

      // 设置托盘图标的工具提示
      this.tray.setToolTip("windows-nail");
      this.tray.on("click", () => {
        if (this.window.win.isVisible()) {
          this.window.win.close();
          this.window.win.hide();
        } else {
          this.window.win.show();
        }
      });
    });

    // 为托盘设置右键菜单
    this.updateContextMenu();

    // 当所有窗口都被关闭时，退出应用
    app.on("window-all-closed", () => {
      // 在 macOS 上，用户通常会在应用菜单栏之外的地方关闭应用
      // 所以除非用户明确地按下Quit，否则应用会保持活动状态
      if (process.platform !== "darwin") {
        this.destroy();
        this.window.close();
        app.quit();
      }
    });

    app.on("activate", () => {
      // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
      // 通常会重新创建一个窗口。
    });
  }
  updateContextMenu() {
    this.windowUpdateTimeout = setInterval(() => {
      this.contextMenu = Menu.buildFromTemplate(
        (() => {
          const res = this.window
            .getAllWindowsInfo()
            .map((win) => ({
              label: win.title,
              type: "radio",
              checked: win.top,
              click: () => {
                this.exit = false;
                this.window.switchWindowTopmostByHWND(win.address);
              },
            }))
            .concat({
              label: "退出",
              type: "radio",
              checked: this.exit,
              click: () => {
                this.destroy();
                this.window.close();
                app.quit();
              },
            });

          return res;
        })()
      );
      this.tray.setContextMenu(this.contextMenu);
    }, 1000);
  }
  destroy() {
    clearInterval(this.windowUpdateTimeout);
  }
}

module.exports = WindowNailTray;
