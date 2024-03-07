// 渲染进程 (renderer.js)
let nailBlack = document.getElementById("nail-black");
let nailWhite = document.getElementById("nail-white");

// 初始加载时获取系统主题
window.electron.ipcRenderer.invoke("get-system-theme").then((isDarkMode) => {
  updateNailImages(isDarkMode);
});
// 监听系统主题更改事件
window.electron.ipcRenderer.on("system-theme-changed", (_, isDarkMode) => {
  updateNailImages(isDarkMode);
});

function updateNailImages(isDarkMode) {
  if (isDarkMode) {
    nailBlack.style.display = "block"; // 显示黑色指甲图
    nailWhite.style.display = "none"; // 隐藏白色指甲图
  } else {
    nailBlack.style.display = "none"; // 隐藏黑色指甲图
    nailWhite.style.display = "block"; // 显示白色指甲图
  }
}
