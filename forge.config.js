module.exports = {
  packagerConfig: {
    asar: true,
  },
  alias: {},
  rebuildConfig: {},
  // 添加 electronLaunchConfig 来自定义 Electron 启动参数
  electronLaunchConfig: {
    args: ["--inspect-brk=9800"],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        certificateFile: "./cert.pfx",
        certificatePassword: process.env.CERTIFICATE_PASSWORD,
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "xiaohaodu",
          name: "window-nail",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};
