self.addEventListener("install", () => {
  console.log("Service worker installed"); // eslint-disable-line no-console
});

self.addEventListener("activate", () => {
  console.log("Service worker activated"); // eslint-disable-line no-console
});
