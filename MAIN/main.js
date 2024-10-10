const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const localShortcut = require("electron-localshortcut");
const { exec } = require("child_process");
const path = require("path");
const axios = require("axios");
const fs = require("fs").promises;
const {
  EXTENSIONS_TO_LANGUAGES_MATCHING_LIST,
} = require("./src/CONSTs/extensionsToLanguagesMatchingList.js");

let mainWindow;
const menuTemplate = [
  {
    label: "Surface Editor",
    submenu: [{ role: "about" }, { role: "quit" }, { type: "separator" }],
  },
  {
    label: "File",
    submenu: [
      { label: "Open Folder...", click: () => openFolderStructureDialog() },

      { type: "separator" },
    ],
  },
];

const createWindow = () => {
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
  // Initialize the browser window.
  if (process.platform === "darwin") {
    mainWindow = new BrowserWindow({
      title: "",
      icon: path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/win32_logo.png"
      ),
      width: 1200,
      height: 800,
      webSecurity: true,
      transparent: false,
      resizable: true,
      maximizable: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
      //vibrancy: "fullscreen-ui",
      frame: true,
      hasShadow: true,
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 14, y: 13 },
      backgroundColor: "#181818",
    });
    app.dock.setIcon(
      path.join(__dirname, "src/ICONs/SYSTEM_ICONs/512X512/win32_logo.png")
    );
  } else if (process.platform === "win32") {
    mainWindow = new BrowserWindow({
      title: "",
      icon: path.join(
        __dirname,
        "src/ICONs/SYSTEM_ICONs/512X512/win32_logo.png"
      ),
      width: 1200,
      height: 800,
      webSecurity: true,
      hasShadow: true,
      transparent: false,
      resizable: true,
      maximizable: true,
      backgroundMaterial: "acrylic",
      titleBarStyle: "hidden",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
      backgroundColor: "#181818",
      frame: true,
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

  localShortcut.register(mainWindow, "CommandOrControl+=", () => {
    let zoomLevel = mainWindow.webContents.getZoomLevel();
    mainWindow.webContents.setZoomLevel(zoomLevel + 1);
  });

  localShortcut.register(mainWindow, "CommandOrControl+-", () => {
    let zoomLevel = mainWindow.webContents.getZoomLevel();
    mainWindow.webContents.setZoomLevel(zoomLevel - 1);
  });

  localShortcut.register(mainWindow, "CommandOrControl+0", () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  // Load the index.html of the app.
  checkServerAndLoadURL("http://127.0.0.1:3000");

  // Set up the application menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Optionally open the DevTools.
  mainWindow.webContents.openDevTools();
};

const openFolderStructureDialog = () => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        read_dir(result.filePaths[0], result.filePaths[0])
          .then((dirs) => {
            mainWindow.webContents.send("directory-data", {
              is_dir_successfully_loaded: true,
              dirs: dirs,
            });
          })
          .catch((error) => console.error("Error reading directory:", error));
      } else {
        mainWindow.webContents.send("directory-data", {
          is_dir_successfully_loaded: false,
          dirs: null,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("directory-data", {
        is_dir_successfully_loaded: false,
        dirs: null,
      });
    });
};
const read_dir = async (dirPath, rootPath = dirPath) => {
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    const files = {};

    const rootFile = rootPath.replace(/\\/g, "/").split("/").pop();

    const basename = path.basename(dirPath);
    let file_path = "";
    if (dirPath === rootPath) {
      file_path = `${rootFile}`;
    } else {
      const relativePath = path.relative(rootPath, dirPath).replace(/\\/g, "/");
      file_path = `${rootFile}/${relativePath}`;
    }

    let dir = {
      file_name: basename,
      file_type: "folder",
      file_path: file_path,
      absolute_path: path.resolve(dirPath),
      file_expand: false,
      sub_items: [],
    };
    for (const dirent of dirents) {
      const res = path.resolve(dirPath, dirent.name);
      const relativePath = path.relative(rootPath, res).replace(/\\/g, "/");
      const filePath = `${rootFile}/${relativePath}`;

      if (dirent.isDirectory()) {
        dir.sub_items.push(filePath);
        const sub_dir = await read_dir(res, rootPath);
        Object.assign(files, sub_dir);
      } else {
        files[filePath] = {
          file_name: dirent.name,
          file_type: "file",
          file_path: filePath,
          absolute_path: path.resolve(dirPath, dirent.name),
          file_expand: false,
          sub_items: [],
        };
        dir.sub_items.push(filePath);
      }
    }

    dir.sub_items = dir.sub_items.sort((a, b) => {
      if (files[a].file_type === "folder" && files[b].file_type === "file") {
        return -1;
      } else if (
        files[a].file_type === "file" &&
        files[b].file_type === "folder"
      ) {
        return 1;
      } else {
        return files[a].file_name.localeCompare(files[b].file_name);
      }
    });

    if (dirPath === rootPath) {
      files["root"] = dir;
    } else {
      files[file_path] = dir;
    }
    return files;
  } catch (error) {
    throw error;
  }
};

app.whenReady().then(() => {
  createWindow();
});

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
  mainWindow.webContents.send("read-dir-state-changed", {
    isDirLoaded: false,
  });
  openFolderStructureDialog();
});
ipcMain.on("read-file", async (event, absolutePath, relativePath) => {
  try {
    const stats = await fs.stat(absolutePath);
    if (stats.isFile()) {
      const content = await fs.readFile(absolutePath, "utf8");
      const openedFile = {
        fileName: path.basename(absolutePath),
        filePath: relativePath,
        fileAbsolutePath: absolutePath,
        fileType: "file",
        fileLanguage:
          EXTENSIONS_TO_LANGUAGES_MATCHING_LIST[path.extname(absolutePath)],
        fileContent: content,
      };
      event.reply("file-content", openedFile, relativePath);
    } else {
      event.reply("file-error", "The provided path is a directory, not a file");
    }
  } catch (error) {
    console.error("Failed to read file:", error);
    if (error.code === "ENOENT") {
      event.reply("file-error", "File does not exist");
    } else {
      event.reply("file-error", error.message || "Failed to read file");
    }
  }
});
