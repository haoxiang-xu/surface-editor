const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleWindowButtons: (shouldHide) =>
    ipcRenderer.send("toggle-window-buttons", shouldHide),
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
contextBridge.exposeInMainWorld("rootDataManagerAPI", {
  dirDataListener: (channel, func) => {
    let validChannels = ["dir-data-listener"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  loadDirEventHandler: () => ipcRenderer.send("load-dir-event-handler"),
  loadDirEventListener: (callback) => {
    ipcRenderer.on("load-dir-event-listener", (_, data) => callback(data));
  },
  loadFileEventHandler: (absolutePath, relativePath) =>
    ipcRenderer.send("load-file-event-handler", absolutePath, relativePath),
  loadFileEventListener: (callback) =>
    ipcRenderer.on("load-file-event-listener", (event, message, content, relativePath) =>
      callback(message, content, relativePath)
    ),
});
