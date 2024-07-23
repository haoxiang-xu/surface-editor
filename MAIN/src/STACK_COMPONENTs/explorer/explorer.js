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
        <DirItem filePath={dir.filePath} root={true} />
      </explorerContexts.Provider>
    </div>
  );
};
const ContextMenuWrapper = ({ children }) => {
  const { command, setCommand, load_contextMenu } = useContext(
    SurfaceExplorerContexts
  );
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
      unique_tag: "openFolder",
      clickable: true,
      label: "Open Folder...",
      icon: SYSTEM_ICON_MANAGER.uploadFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.uploadFolder.ICON16,
    },
    openFile: {
      type: "button",
      unique_tag: "openFile",
      clickable: true,
      label: "Open File...",
      icon: SYSTEM_ICON_MANAGER.uploadFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.uploadFile.ICON16,
    },
    br: {
      type: "br",
      unique_tag: "br",
    },
    newFile: {
      type: "button",
      unique_tag: "newFile",
      clickable: true,
      label: "New File...",
      icon: SYSTEM_ICON_MANAGER.newFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
    },
    newFolder: {
      type: "button",
      unique_tag: "newFolder",
      clickable: true,
      label: "New Folder...",
      icon: SYSTEM_ICON_MANAGER.newFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
    },
    paste: {
      type: "button",
      unique_tag: "paste",
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
      unique_tag: "copy",
      clickable: true,
      label: "Copy",
      short_cut_label: "Ctrl+C",
      icon: SYSTEM_ICON_MANAGER.copy.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
    },
    rename: {
      type: "button",
      unique_tag: "rename",
      clickable: true,
      label: "Rename",
      icon: SYSTEM_ICON_MANAGER.rename.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
    },
    delete: {
      type: "button",
      unique_tag: "delete",
      clickable: true,
      label: "Delete",
      icon: SYSTEM_ICON_MANAGER.trash.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.trash.ICON16,
    },
    br: {
      type: "br",
      unique_tag: "br",
    },
    newFile: {
      type: "button",
      unique_tag: "newFile",
      clickable: true,
      label: "New File...",
      icon: SYSTEM_ICON_MANAGER.newFile.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
    },
    newFolder: {
      type: "button",
      unique_tag: "newFolder",
      clickable: true,
      label: "New Folder...",
      icon: SYSTEM_ICON_MANAGER.newFolder.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
    },
    paste: {
      type: "button",
      unique_tag: "paste",
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
      unique_tag: "copy",
      clickable: true,
      label: "Copy",
      short_cut_label: "Ctrl+C",
      icon: SYSTEM_ICON_MANAGER.copy.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
    },
    rename: {
      type: "button",
      unique_tag: "rename",
      clickable: true,
      label: "Rename",
      icon: SYSTEM_ICON_MANAGER.rename.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
    },
    delete: {
      type: "button",
      unique_tag: "delete",
      clickable: true,
      label: "Delete",
      icon: SYSTEM_ICON_MANAGER.trash.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.trash.ICON16,
    },
    br: {
      type: "br",
      unique_tag: "br",
    },
  };

  /* { context menu command handler } ----------------------------------------------------------------------------------- */
  const handle_context_menu_command = async () => {
    if (command && command.source === "context_menu") {
      const command_title = command.content.command_title;
      switch (command_title) {
        case "copy":
          break;
        case "paste":
          break;
      }
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
        return contextStructure;
      }
      case "root": {
        contextStructure = { ...default_root_context_menu };
        return contextStructure;
      }
      default:
        return null;
    }
  };
  const load_explorer_context_menu = async (e, source_editor_component) => {
    const contextStructure = await render_context_menu(source_editor_component);
    if (!contextStructure) return;
    load_contextMenu(e, contextStructure);
  };
  /* { context menu render } ============================================================================================ */

  useEffect(() => {
    handle_context_menu_command();
  }, [command]);

  return (
    <SurfaceExplorerContextMenuContexts.Provider
      value={{
        load_explorer_context_menu,
      }}
    >
      {children}
    </SurfaceExplorerContextMenuContexts.Provider>
  );
};
const Explorer = ({
  mode,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
}) => {
  useEffect(() => {
    console.log(data);
  }, [data]);
  const { isDirLoaded } = useContext(RootDataContexts);
  return (
    <SurfaceExplorerContexts.Provider
      value={{
        mode,
        command,
        setCommand,
        load_contextMenu,
      }}
    >
      <ContextMenuWrapper>
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
      </ContextMenuWrapper>
    </SurfaceExplorerContexts.Provider>
  );
};

export default Explorer;
