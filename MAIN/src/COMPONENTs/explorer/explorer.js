import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../ICONs/icon_manager.js";
import { SurfaceExplorerContextMenuContexts } from "./surface_explorer_context_menu_contexts.js";
import { SurfaceExplorerContexts } from "./surface_explorer_contexts.js";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts.js";
import { explorerContexts } from "../../CONTEXTs/explorerContexts.js";
import DirItem from "./dirItem/dirItem.js";
import PulseLoader from "react-spinners/PulseLoader";
import BarLoader from "react-spinners/BarLoader";
import "./explorer.css";

/* Load ICON manager --------------------------------------------------------------------------------- */
let FILE_TYPE_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  FILE_TYPE_ICON_MANAGER = ICON_MANAGER().FILE_TYPE_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
let SYSTEM_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  SYSTEM_ICON_MANAGER = ICON_MANAGER().SYSTEM_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
/* Load ICON manager --------------------------------------------------------------------------------- */

const SearchBar = ({}) => {
  /* Load ICON manager -------------------------------- */
  let SYSTEM_ICON_MANAGER = {
    default: {
      ICON: null,
      LABEL_COLOR: "#C8C8C8",
    },
  };
  try {
    SYSTEM_ICON_MANAGER = ICON_MANAGER().SYSTEM_ICON_MANAGER;
  } catch (e) {
    console.log(e);
  }
  /* Load ICON manager -------------------------------- */
  return (
    <div
      className={"dir_list_component_search_bar_container0125"}
      draggable={false}
    >
      <input className={"dir_list_component_search_bar_input0125"} />
      <img
        src={SYSTEM_ICON_MANAGER.search.ICON512}
        className={"dir_list_component_search_bar_icon0125"}
        draggable={false}
        alt="search"
      />
    </div>
  );
};
const DirList = ({}) => {
  const { dir, isDirLoaded, setIsDirLoaded } = useContext(RootDataContexts);
  const [ExplorerOnMouseOver, setExplorerOnMouseOver] = useState(false);
  const [dirPathOnHover, setDirPathOnHover] = useState(null);
  const [onSingleClickFile, setOnSingleClickFile] = useState(null);
  const [onCopyFile, setOnCopyFile] = useState(null);
  const [onDragFiles, setOnDragFiles] = useState(null);

  useEffect(() => {
    if (!ExplorerOnMouseOver) {
      setDirPathOnHover(null);
    }
  }, [ExplorerOnMouseOver]);
  useEffect(() => {
    const updateLoadingStatus = ({ isDirLoading }) => {
      setIsDirLoaded(!isDirLoading);
    };
    window.electronAPI.subscribeToReadDirStateChange(updateLoadingStatus);
  }, []);

  return (
    <div
      id={"dir_list_component_container0725"}
      style={{
        overflowY: "scroll",
        display: isDirLoaded ? "block" : "none",
      }}
      onMouseEnter={() => {
        setExplorerOnMouseOver(true);
      }}
      onMouseLeave={() => {
        setExplorerOnMouseOver(false);
      }}
    >
      <explorerContexts.Provider
        value={{
          dirPathOnHover,
          setDirPathOnHover,
          onSingleClickFile,
          setOnSingleClickFile,
          onCopyFile,
          setOnCopyFile,
          onDragFiles,
          setOnDragFiles,
        }}
      >
        <ContextMenuWrapper>
          <DirItem filePath={dir.filePath} root={true} />
        </ContextMenuWrapper>
      </explorerContexts.Provider>
    </div>
  );
};
const ContextMenuWrapper = ({ children }) => {
  const {
    dir,
    update_path_under_dir,
    remove_path_under_dir,
    check_is_file_name_exist_under_path,
    access_file_subfiles_by_path,
    access_file_name_by_path_in_dir,
    access_file_type_by_path,
    access_folder_expand_status_by_path,
    update_folder_expand_status_by_path,
    access_subfiles_by_path,
  } = useContext(RootDataContexts);
  const { setOnSingleClickFile } = useContext(explorerContexts);
  const { id, command, setCommand, load_contextMenu } = useContext(
    SurfaceExplorerContexts
  );
  const [onConextMenuPath, setOnConextMenuPath] = useState(null);
  const [onCopyFile, setOnCopyFile] = useState(null);

  const default_root_context_menu = {
    root: {
      type: "root",
      sub_items: [
        "newFile",
        "newFolder",
        "br",
        "paste",
        "br",
        "openFolder",
        "openFile",
      ],
    },
    openFolder: {
      type: "button",
      id: "openFolder",
      clickable: true,
      label: "Open Folder...",
      icon: SYSTEM_ICON_MANAGER.uploadFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.uploadFolder.ICON16,
    },
    openFile: {
      type: "button",
      id: "openFile",
      clickable: true,
      label: "Open File...",
      icon: SYSTEM_ICON_MANAGER.uploadFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.uploadFile.ICON16,
    },
    br: {
      type: "br",
      id: "br",
    },
    newFile: {
      type: "button",
      id: "newFile",
      clickable: true,
      label: "New File...",
      icon: SYSTEM_ICON_MANAGER.newFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
    },
    newFolder: {
      type: "button",
      id: "newFolder",
      clickable: true,
      label: "New Folder...",
      icon: SYSTEM_ICON_MANAGER.newFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
    },
    paste: {
      type: "button",
      id: "paste",
      clickable: false,
      label: "Paste",
      short_cut_label: "Ctrl+V",
      icon: SYSTEM_ICON_MANAGER.paste.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
    },
  };
  const default_folder_context_menu = {
    root: {
      type: "root",
      sub_items: [
        "newFile",
        "newFolder",
        "br",
        "copy",
        "paste",
        "br",
        "rename",
        "delete",
      ],
    },
    copy: {
      type: "button",
      id: "copy",
      clickable: true,
      label: "Copy",
      short_cut_label: "Ctrl+C",
      icon: SYSTEM_ICON_MANAGER.copy.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
    },
    rename: {
      type: "button",
      id: "rename",
      clickable: true,
      label: "Rename",
      icon: SYSTEM_ICON_MANAGER.rename.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
    },
    delete: {
      type: "button",
      id: "delete",
      clickable: true,
      label: "Delete",
      icon: SYSTEM_ICON_MANAGER.trash.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.trash.ICON16,
    },
    br: {
      type: "br",
      id: "br",
    },
    newFile: {
      type: "button",
      id: "newFile",
      clickable: true,
      label: "New File...",
      icon: SYSTEM_ICON_MANAGER.newFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
    },
    newFolder: {
      type: "button",
      id: "newFolder",
      clickable: true,
      label: "New Folder...",
      icon: SYSTEM_ICON_MANAGER.newFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
    },
    paste: {
      type: "button",
      id: "paste",
      clickable: false,
      label: "Paste",
      short_cut_label: "Ctrl+V",
      icon: SYSTEM_ICON_MANAGER.paste.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
    },
  };
  const default_file_context_menu = {
    root: {
      type: "root",
      sub_items: ["copy", "br", "rename", "delete"],
    },
    copy: {
      type: "button",
      id: "copy",
      clickable: true,
      label: "Copy",
      short_cut_label: "Ctrl+C",
      icon: SYSTEM_ICON_MANAGER.copy.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
    },
    rename: {
      type: "button",
      id: "rename",
      clickable: true,
      label: "Rename",
      icon: SYSTEM_ICON_MANAGER.rename.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
    },
    delete: {
      type: "button",
      id: "delete",
      clickable: true,
      label: "Delete",
      icon: SYSTEM_ICON_MANAGER.trash.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.trash.ICON16,
    },
    br: {
      type: "br",
      id: "br",
    },
  };
  const clickable_paste = {
    type: "button",
    id: "paste",
    clickable: true,
    label: "Paste",
    short_cut_label: "Ctrl+V",
    icon: SYSTEM_ICON_MANAGER.paste.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
  };

  /* { context menu command handler } ----------------------------------------------------------------------------------- */
  const handle_context_menu_command = async () => {
    if (command && command.source === "context_menu") {
      const command_title = command.content.command_title;
      switch (command_title) {
        case "copy":
          {
            setOnCopyFile(
              JSON.parse(
                JSON.stringify(access_file_subfiles_by_path(onConextMenuPath))
              )
            );
          }
          break;
        case "paste":
          {
            const addPathNameAllChildren = (file, addPath, copyFileIndex) => {
              const add_path = addPath.split("/");

              for (let i = 0; i < file.files.length; i++) {
                const path = file.files[i].filePath.split("/");
                let combinedPath = add_path.concat(path.slice(copyFileIndex));
                file.files[i].filePath = combinedPath.join("/");

                addPathNameAllChildren(file.files[i], addPath, copyFileIndex);
              }
            };
            let pasteFile = JSON.parse(JSON.stringify(onCopyFile));
            if (
              !check_is_file_name_exist_under_path(
                onConextMenuPath,
                pasteFile.fileName
              )
            ) {
              pasteFile.expanded = false;
              setOnSingleClickFile(pasteFile);

              const pasteFileIndex = pasteFile.filePath.split("/").length - 1;
              addPathNameAllChildren(
                pasteFile,
                onConextMenuPath,
                pasteFileIndex
              );

              const path = pasteFile.filePath.split("/");
              const add_path = onConextMenuPath.split("/");
              const combinedPath = add_path.concat(path.slice(pasteFileIndex));
              pasteFile.filePath = combinedPath.join("/");

              let editedFile = access_file_subfiles_by_path(onConextMenuPath);
              editedFile.files.push(pasteFile);
              update_path_under_dir(onConextMenuPath, editedFile);

              //EXPAND FOLDER
              update_folder_expand_status_by_path(onConextMenuPath, true);
            } else {
              alert("File name already exist");
            }
          }
          break;
        case "newFile": {
          const getNewFileDefaultName = (filePath) => {
            let newFileDefaultName = "untitled_file";
            let newFileDefaultNameIndex = 1;
            let newFileDefaultNameExist = true;
            while (newFileDefaultNameExist) {
              newFileDefaultNameExist = false;
              const file_list = access_subfiles_by_path(filePath);
              for (let i = 0; i < file_list.length; i++) {
                if (file_list[i].fileName === newFileDefaultName) {
                  newFileDefaultNameExist = true;
                  break;
                }
              }
              if (newFileDefaultNameExist) {
                newFileDefaultName = "untitled_file" + newFileDefaultNameIndex;
                newFileDefaultNameIndex++;
              }
            }
            return newFileDefaultName;
          };
          const newFileDefaultName = getNewFileDefaultName(onConextMenuPath);

          const newFile = {
            fileName: newFileDefaultName,
            fileType: "file",
            filePath: onConextMenuPath + "/" + newFileDefaultName,
            files: [],
          };

          let editedFile = access_file_subfiles_by_path(onConextMenuPath);
          editedFile.files.push(newFile);
          update_path_under_dir(onConextMenuPath, editedFile);

          update_folder_expand_status_by_path(onConextMenuPath, true);

          setCommand({
            source: "context_menu",
            target: id,
            content: {
              command_title: "rename",
              command_content: {},
            },
          });
          setOnConextMenuPath(newFile.filePath);
          return;
        }
        case "newFolder": {
          const getNewFolderDefaultName = (filePath) => {
            let newFolderDefaultName = "untitled_folder";
            let newFolderDefaultNameIndex = 1;
            let newFolderDefaultNameExist = true;
            while (newFolderDefaultNameExist) {
              newFolderDefaultNameExist = false;
              const file_list = access_subfiles_by_path(filePath);
              for (let i = 0; i < file_list.length; i++) {
                if (file_list[i].fileName === newFolderDefaultName) {
                  newFolderDefaultNameExist = true;
                  break;
                }
              }
              if (newFolderDefaultNameExist) {
                newFolderDefaultName =
                  "untitled_folder" + newFolderDefaultNameIndex;
                newFolderDefaultNameIndex++;
              }
            }
            return newFolderDefaultName;
          };
          const newFolderDefaultName =
            getNewFolderDefaultName(onConextMenuPath);
          const newFolder = {
            fileName: newFolderDefaultName,
            fileType: "folder",
            filePath: onConextMenuPath + "/" + newFolderDefaultName,
            files: [],
          };

          let editedFile = access_file_subfiles_by_path(onConextMenuPath);
          editedFile.files.push(newFolder);
          update_path_under_dir(onConextMenuPath, editedFile);

          update_folder_expand_status_by_path(onConextMenuPath, true);

          setCommand({
            source: "context_menu",
            target: id,
            content: {
              command_title: "rename",
              command_content: {},
            },
          });
          setOnConextMenuPath(newFolder.filePath);
          return;
        }
        case "rename": {
          return;
        }
        case "delete": {
          remove_path_under_dir(onConextMenuPath);
          return;
        }
        case "openFolder": {
          window.electronAPI.triggerReadDir();
        }
      }
      setOnConextMenuPath(null);
      setCommand([]);
    }
  };
  /* { context menu command handler } ----------------------------------------------------------------------------------- */

  /* { context menu render } ============================================================================================ */
  const render_context_menu = async (source_editor_component) => {
    let contextStructure = { ...default_file_context_menu };
    switch (source_editor_component) {
      case "file": {
        contextStructure = { ...default_file_context_menu };
        return contextStructure;
      }
      case "folder": {
        contextStructure = { ...default_folder_context_menu };
        if (onCopyFile) {
          contextStructure.paste = clickable_paste;
        }
        return contextStructure;
      }
      case "root": {
        contextStructure = { ...default_root_context_menu };
        if (onCopyFile) {
          contextStructure.paste = clickable_paste;
        }
        return contextStructure;
      }
      default:
        return null;
    }
  };
  const load_explorer_context_menu = async (
    e,
    source_editor_component,
    file_path
  ) => {
    const contextStructure = await render_context_menu(source_editor_component);
    if (!contextStructure) return;
    setOnConextMenuPath(file_path);
    load_contextMenu(e, contextStructure);
  };
  /* { context menu render } ============================================================================================ */

  useEffect(() => {
    handle_context_menu_command();
  }, [command]);

  return (
    <SurfaceExplorerContextMenuContexts.Provider
      value={{
        onConextMenuPath,
        load_explorer_context_menu,
      }}
    >
      {children}
    </SurfaceExplorerContextMenuContexts.Provider>
  );
};
const Explorer = ({
  id,
  mode,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
}) => {
  console.log("RDM/RCM/stack_frame/explorer", new Date().getTime());
  const { isDirLoaded } = useContext(RootDataContexts);
  return (
    <SurfaceExplorerContexts.Provider
      value={{
        id,
        mode,
        command,
        setCommand,
        load_contextMenu,
      }}
    >
      {mode === "horizontal_stack_vertical_mode" ? null : (
        <div>
          <DirList />
          <SearchBar />
        </div>
      )}
      {isDirLoaded ? null : (
        <div className="dir_list_component_loading_container0404">
          <BarLoader
            size={8}
            color={"#C8C8C864"}
            height={5}
            width={32}
            speed={1}
          />
        </div>
      )}
    </SurfaceExplorerContexts.Provider>
  );
};

export default Explorer;
