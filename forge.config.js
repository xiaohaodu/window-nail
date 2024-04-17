const { MakerSquirrel } = require("@electron-forge/maker-squirrel");
const { MakerZIP } = require("@electron-forge/maker-zip");
const { MakerDeb } = require("@electron-forge/maker-deb");
const { MakerRpm } = require("@electron-forge/maker-rpm");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { PublisherGithub } = require("@electron-forge/publisher-github");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "window-nail",
      shortCutName: "window-nail",
      executableName: "window-nail",
      shortcuts: [
        {
          name: "window-nail",
          target: "window-nail.exe",
          iconPath: "public/nail-black.png", // 替换为实际图标的路径
          workingDirectory: "$INSTDIR",
        },
      ],
      extraFiles: ["build/Release/window_nail.node"],
    }),
    new MakerZIP({ platforms: ["darwin"] }),
    new MakerDeb({}),
    new MakerRpm({}),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: "xiaohaodu",
        name: "window-nail",
      },
      prerelease: process.env.NODE_ENV === "development",
      releaseType: process.env.RELEASE_TYPE,
      token: process.env.GITHUB_TOKEN,
      draft: process.env.NODE_ENV === "development",
    }),
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
