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
    arch: "darwin",
    name: "window-nail",
    executableName: "window-nail",
    icon: "public/nail-white",
    extraResource: ["build/Release/window_nail.node"],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}),
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
