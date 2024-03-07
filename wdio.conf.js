export default {
  runner: "local",
  specs: ["./test/**/*.js"],
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 10,
  capabilities: [
    {
      browserName: "electron",
      // see https://webdriver.io/docs/wdio-electron-service/#configuration
      "wdio:electronServiceOptions": {
        // custom application args
        appArgs: [],
      },
    },
  ],
  logLevel: "info",
  bail: 0,
  baseUrl: "",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["electron"],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
