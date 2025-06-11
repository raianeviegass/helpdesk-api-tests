const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: './reports/screenshots',
  },

  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: './reports',
    reportFilename: "relatorio-final-testes",
    overwrite: true,
    html: true,
    json: true,
  }
});
