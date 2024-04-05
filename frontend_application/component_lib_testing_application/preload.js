const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    const validChannels = ["window-control"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["directory-data"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
contextBridge.exposeInMainWorld("electronAPI", {
  toggleWindowButtons: (shouldHide) =>
    ipcRenderer.send("toggle-window-buttons", shouldHide),
  triggerReadDir: () => ipcRenderer.send("trigger-read-dir"),
  subscribeToReadDirStateChange: (callback) => {
    ipcRenderer.on("read-dir-state-changed", (event, data) => {
      callback(data);
    });
  },
  subscribeToWindowStateChange: (callback) => {
    ipcRenderer.on("window-state-changed", (_, data) => callback(data));
  },
});
contextBridge.exposeInMainWorld("osInfo", {
  platform: process.platform,
});
