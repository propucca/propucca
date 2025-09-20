import { defineConfig } from "cypress";

export default defineConfig({
  screenshotOnRunFailure: true,
  video: true,
  videoCompression: 32,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  e2e: {
    baseUrl: "http://localhost:3001",
    env: {
      apiBaseUrl: "http://localhost:8001",
      categoryName: "com location2 Category",
      categoryDescription: "com location2 Category",
      userEmail: "ashwini.1si18mca51@gmail.com",
      userPassword: "Ashu@123",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("after:screenshot", (details) => {
        console.log(details);
      });
    },
  },
});
