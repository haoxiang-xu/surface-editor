const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const axios = require("axios");
const fs = require("fs/promises");

let mainWindow;
const menuTemplate = [
  {
    label: "Vecoder",
    submenu: [{ role: "about" }, { role: "quit" }, { type: "separator" }],
  },
  {
    label: "File",
    submenu: [
      { label: "Open Folder...", click: () => openFolderDialog() },

      { type: "separator" },
    ],
  },
  // {
  //   label: "Edit",
  //   submenu: [
  //     { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
  //     { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
  //     { type: "separator" },
  //     { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
  //     { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
  //     { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
  //   ],
  // },
  // Other menu items...
];
const createWindow = () => {
  // Initialize the browser window.
  if (process.platform === "darwin") {
    mainWindow = new BrowserWindow({
      title: "",
      icon: path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/surface_editor_logo.png"
      ),
      width: 1200,
      height: 800,
      webSecurity: true,
      transparent: true,
      resizable: true,
      maximizable: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
      frame: false,
      hasShadow: false,
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 17, y: 15 },
    });
    app.dock.setIcon(
      path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/surface_editor_logo.png"
      )
    );
  } else if (process.platform === "win32") {
    mainWindow = new BrowserWindow({
      title: "",
      icon: path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/surface_editor_logo.png"
      ),
      width: 1200,
      height: 800,
      webSecurity: true,
      transparent: true,
      resizable: true,
      maximizable: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
      frame: false,
    });
  } else {
    mainWindow = new BrowserWindow({
      title: "",
      icon: path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/surface_editor_logo.png"
      ),
      width: 1200,
      height: 800,
      webSecurity: true,
      transparent: true,
      resizable: true,
      maximizable: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
      frame: false,
    });
  }
  mainWindow.setTitle("");
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-state-changed", { isMaximized: true });
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-state-changed", { isMaximized: false });
  });
  mainWindow.on("enter-full-screen", () => {
    mainWindow.webContents.send("window-state-changed", {
      isMaximized: true,
    });
  });
  mainWindow.on("leave-full-screen", () => {
    mainWindow.webContents.send("window-state-changed", {
      isMaximized: false,
    });
  });

  // Load the index.html of the app.
  checkServerAndLoadURL("http://127.0.0.1:3000");

  // Set up the application menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Optionally open the DevTools.
  mainWindow.webContents.openDevTools();
};
const checkServerAndLoadURL = (url) => {
  axios
    .get(url)
    .then(() => {
      // Server is up and running, load the URL
      mainWindow.loadURL(url);
    })
    .catch((error) => {
      console.error("Server not ready, retrying...", error);
      // Wait for a bit before trying again
      setTimeout(() => checkServerAndLoadURL(url), 2000); // Adjust the delay as needed
    });
};
const openFolderDialog = () => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      mainWindow.webContents.send("read-dir-state-changed", {
        isDirLoading: true,
      });
      if (!result.canceled) {
        readDir(result.filePaths[0], result.filePaths[0])
          .then((dirs) => {
            const rootFolder = result.filePaths[0]
              .replace(/\\/g, "/")
              .split("/")
              .pop();
            const opendFolder = {
              fileName: rootFolder,
              filePath: rootFolder,
              fileSize: "0 bytes",
              fileType: "folder",
              fileExtname: path.extname(rootFolder),
              files: dirs,
              fileExpanded: true,
            };
            mainWindow.webContents.send("directory-data", opendFolder);
          })
          .catch((err) => {
            console.error("Error reading directory:", err);
          })
          .finally(() => {
            mainWindow.webContents.send("read-dir-state-changed", {
              isDirLoading: false,
            });
          });
      } else {
        mainWindow.webContents.send("read-dir-state-changed", {
          isDirLoading: false,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      mainWindow.webContents.send("read-dir-state-changed", {
        isDirLoading: false,
      });
    });
};
const readDir = async (dirPath, rootPath = dirPath) => {
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const res = path.resolve(dirPath, dirent.name);
        const normalizedResPath = res.replace(/\\/g, "/");
        const normalizedRootPath = rootPath.replace(/\\/g, "/");
        const rootFolder = normalizedRootPath.split("/").pop();
        const relPath =
          rootFolder +
          "/" +
          normalizedResPath
            .substring(normalizedRootPath.length)
            .replace(/^\/|\\/, ""); // Ensure the leading slash is removed

        const stats = await fs.stat(res); // Use asynchronous stat

        if (dirent.isDirectory()) {
          return {
            fileName: dirent.name,
            filePath: relPath,
            fileSize: stats.size + " bytes",
            fileType: "folder",
            fileExtname: path.extname(dirent.name),
            files: await readDir(res, rootPath), // Pass the original rootPath for correct relative paths
            fileExpanded: false,
          };
        } else {
          return {
            fileName: dirent.name,
            filePath: relPath,
            fileSize: stats.size + " bytes",
            fileType: "file",
            fileExtname: path.extname(dirent.name),
            files: [],
            fileExpanded: false,
          };
        }
      })
    );

    // First, sort by type (folders first)
    files.sort((a, b) => {
      if (a.fileType === b.fileType) return 0; // If both are files or both are folders, don't change order
      return a.fileType === "folder" ? -1 : 1; // If a is a folder and b is a file, a comes first, and vice versa
    });

    // Then, sort alphabetically within each type
    files.sort((a, b) => {
      if (a.fileType !== b.fileType) return 0; // Don't sort across types
      return a.fileName.localeCompare(b.fileName); // Sort alphabetically by fileName
    });

    return files.flat();
  } catch (e) {
    throw e; // Rethrow the error to be caught by the caller
  }
};

app.whenReady().then(createWindow);
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("window-control", (event, action) => {
  switch (action) {
    case "close":
      mainWindow.close();
      break;
    case "minimize":
      mainWindow.minimize();
      break;
    case "maximize":
      if (process.platform === "win32") {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
      } else if (process.platform === "darwin") {
        if (mainWindow.isFullScreen()) {
          mainWindow.setFullScreen(false);
        } else {
          mainWindow.setFullScreen(true);
        }
      }
      break;
    default:
      break;
  }
});
ipcMain.on("toggle-window-buttons", (event, shouldHide) => {
  if (process.platform === "darwin") {
    setTimeout(() => {
      mainWindow.setWindowButtonVisibility(!shouldHide);
      mainWindow.setWindowButtonPosition({ x: 17, y: 15 });
    }, 110);
  }
});
ipcMain.on("trigger-read-dir", () => {
  openFolderDialog();
});
