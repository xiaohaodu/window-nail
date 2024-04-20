const { updateElectronApp } = require("update-electron-app");
const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const top_windows = require("bindings")("window_nail");
class Window {
  win = null;
  top_window = null;
  windows = null;
  moveTimeout = null;
  constructor() {
    app.whenReady().then(() => {
      this.createWindow();
    });

    this.getAllWindowsInfo();
  }
  createWindow() {
    this.win = new BrowserWindow({
      height: 25,
      width: 25,
      transparent: true, // 设置窗口为透明
      alwaysOnTop: true, // 确保窗口总在最前面
      skipTaskbar: false,
      focusable: false,
      titleBarStyle: "hidden", // 在 macOS 上隐藏标题栏
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "../preload/preload.js"),
        devTools: true,
        backgroundThrottling: false,
      },
      title: "",
      // backgroundColor: "#438A49",
      resizable: false,
      useContentSize: false,
      hasShadow: false,
      visualEffectState: "active",
      backgroundMaterial: "none",
      titleBarOverlay: false,
    });
    // // 可选地，对于 Windows 平台，可以设置特殊的层级 'screen-saver'
    if (process.platform === "win32") {
      this.win.setAlwaysOnTop(true, "screen-saver"); //可以置于画中画之上，但是一点击画中画就不在了，仍旧不可置于画中画之上
    }

    this.win.loadFile("public/index.html");

    // 当窗口关闭时，清除可能存在的延时任务以避免内存泄漏
    this.win.on("closed", () => {
      this.close();
      this.moveTimeout && clearTimeout(this.moveTimeout);
    });
  }
  getAllWindowsInfo() {
    const windows = top_windows.getAllWindowsInfo();
    const windowsTemp = this.windows;
    this.windows = [];
    if (windowsTemp) {
      for (const i in windows) {
        //窗口是否原本存在
        let flag = false;
        for (const j in windowsTemp) {
          if (windowsTemp[j].address === windows[i].address) {
            //窗口原本存在，停止查找
            flag = true;
            this.windows.push({ ...windowsTemp[j] });
            break;
          }
        }
        //如果不存在，则将新窗口添加进入列表中
        if (!flag) this.windows.push({ ...windows[i], top: false });
      }
    } else {
      this.windows = top_windows
        .getAllWindowsInfo()
        .map((window) => ({ ...window, top: false }));
    }
    return this.windows;
  }
  switchWindowTopmostByHWND(hwnd) {
    for (let i in this.windows) {
      if (this.windows[i].address == hwnd) {
        if (this.windows[i].top == false) {
          this.windows[i].top = true;
          top_windows.switchWindowTopmostByHWND(this.windows[i].address, true);
        }
      } else {
        if (this.windows[i].top == true) {
          this.windows[i].top = false;
          top_windows.switchWindowTopmostByHWND(this.windows[i].address, false);
        }
      }
    }
  }
  setWindowsNail(x, y) {
    const res = top_windows.getForegroundWindowAtPosition(x, y);
    if (this.top_window) {
      if (res) {
        if (res.address !== this.top_window.address) {
          top_windows.switchWindowTopmostByHWND(this.top_window.address, false);
          this.top_window = res;
          top_windows.switchWindowTopmostByHWND(this.top_window.address, true);
        }
      } else {
        top_windows.switchWindowTopmostByHWND(this.top_window.address, false);
        this.top_window = null;
      }
    } else {
      if (res) {
        this.top_window = res;
        top_windows.switchWindowTopmostByHWND(this.top_window.address, true);
      }
    }
  }
  close() {
    if (this.top_window) {
      top_windows.switchWindowTopmostByHWND(this.top_window.address, false);
      this.top_window = null;
    } else {
      for (const i in this.windows) {
        if (this.windows[i].top) {
          top_windows.switchWindowTopmostByHWND(this.windows[i].address, false);
        }
      }
    }
  }
  openDevTool() {
    app.whenReady().then(() => {
      this.win.webContents.openDevTools();
    });
  }
  autoUpdateApp() {
    updateElectronApp();
  }
  importDeveloperTool() {}
}
module.exports = Window;
