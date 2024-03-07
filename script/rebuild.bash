# 先获取 Electron 的版本号（假设你已在 package.json 中指定了 electron 版本）
ELECTRON_VERSION=$(./node_modules/.bin/electron --version)

# 使用 electron-rebuild 来编译 C++ 扩展
./node_modules/.bin/electron-rebuild -v $ELECTRON_VERSION -f