const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
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
  readFile: (absolutePath, relativePath) =>
    ipcRenderer.send("read-file", absolutePath, relativePath),
  onFileContent: (callback) =>
    ipcRenderer.on("file-content", (event, content, relativePath) =>
      callback(content, relativePath)
    ),
  onFileError: (callback) =>
    ipcRenderer.on("file-error", (event, error) => callback(error)),
});
contextBridge.exposeInMainWorld("osInfo", {
  platform: process.platform,
});
contextBridge.exposeInMainWorld("rootEventListenerAPI", {
  windowStateEventHandler: (action) => {
    ipcRenderer.send("window-state-event-handler", action);
  },
  windowTitleBarEventHandler: (isOnTitleBar) =>
    ipcRenderer.send("window-title-bar-event-handler", isOnTitleBar),
  windowStateEventListener: (callback) => {
    ipcRenderer.on("window-state-event-listener", (_, data) => callback(data));
  },
});
