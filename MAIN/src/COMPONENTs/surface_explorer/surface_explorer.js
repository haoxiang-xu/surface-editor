import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
/* Context ------------------------------------------------------------------------------------------------------------------------ */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { SurfaceExplorerContexts } from "./surface_explorer_contexts.js";
/* Sub Components ----------------------------------------------------------------------------------------------------------------- */
import Tag from "../../BUILTIN_COMPONENTs/tag/tag";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import { ICON_MANAGER } from "../../ICONs/icon_manager";
/* { Import Styling } ------------------------------------------------------------------------------------------ */
import { surface_explorer_fixed_styling } from "./surface_explorer_fixed_styling_config.js";

/* { ICONs } ------------------------------------------------------------------------------------------------- */
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
/* { ICONs } ------------------------------------------------------------------------------------------------- */

const padding = { top: 42, right: 5, bottom: 5, left: 5 };
const default_explorer_item_height = 22;
const default_x_axis_offset = 10;
const default_font_size = 12;
const default_indicator_padding = 4;

const default_indicator_layer = 12;

const ExplorerLevelIndicator = ({ position_y, position_x, height }) => {
  return (
    <div
      style={{
        transition: "height 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y,
        left: position_x,
        /* Size ======================== */
        width: "1px",
        height: height - default_explorer_item_height,

        /* Style ======================= */
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
      }}
    ></div>
  );
};
const ExplorerOnSelectedIndicator = ({ file_path, position_y, position_x }) => {
  const { onHoverExplorerItems } = useContext(SurfaceExplorerContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: position_y,
        left: position_x,
        zIndex: default_indicator_layer,
        /* Size ======================== */
        width:
          "calc(100% - " + (position_x + 2 + default_indicator_padding) + "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
        borderRadius: 4,
        border:
          onHoverExplorerItems === file_path
            ? "none"
            : `1px solid rgba( ${
                surface_explorer_fixed_styling.backgroundColorR + 64
              }, ${surface_explorer_fixed_styling.backgroundColorG + 64}, ${
                surface_explorer_fixed_styling.backgroundColorB + 64
              }, 1)`,
        boxSizing: "border-box",

        userSelect: "none",
        pointerEvents: "none",
      }}
    ></div>
  );
};
const ExplorerParentIndicator = ({ position_y, position_x, height }) => {
  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: Math.max(position_y - default_indicator_padding, 0),
        left: Math.max(position_x - default_indicator_padding, 0),
        zIndex: default_indicator_layer,

        /* Size ======================== */
        width:
          "calc(100% - " + (position_x + 2 - default_indicator_padding) + "px)",
        height: height + default_indicator_padding * 2,

        /* Style ======================= */
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 64
        }, ${surface_explorer_fixed_styling.backgroundColorG + 64}, ${
          surface_explorer_fixed_styling.backgroundColorB + 64
        }, 0.16)`,
        borderRadius: 6,

        userSelect: "none",
        pointerEvents: "none",
      }}
    ></div>
  );
};
const ExplorerItemFolder = ({ file_path, position_y, position_x }) => {
  const {
    access_dir_name_by_path,
    access_dir_expand_status_by_path,
    update_dir_expand_status_by_path,
  } = useContext(RootDataContexts);
  const {
    explorerListWidth,
    setOnSelectedExplorerItems,
    setOnHoverExplorerItems,
  } = useContext(SurfaceExplorerContexts);
  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [isExpanded, setIsExpanded] = useState(
    access_dir_expand_status_by_path(file_path)
  );

  const [onHover, setOnHover] = useState(false);

  useEffect(() => {
    if (tagRef.current) {
      setContainerWidth(tagRef.current.offsetWidth);
      setContainerHeight(tagRef.current.offsetHeight);
    }
  }, [tagRef.current]);
  useEffect(() => {
    if (onHover) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
      });
      setOnHoverExplorerItems(file_path);
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
      });
    }
  }, [onHover]);

  return (
    <div
      style={{
        transition:
          "top 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08), left 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y + 1,
        left: position_x,
        /* Size ======================== */
        width:
          "calc(100% - " + (position_x + 2 + default_indicator_padding) + "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
        borderRadius: 4,
        backgroundColor: style.backgroundColor,
        boxShadow: onHover ? "0px 4px 16px rgba(0, 0, 0, 0.32)" : "none",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
      onMouseDown={() => {}}
      onMouseUp={(e) => {
        e.stopPropagation();
        update_dir_expand_status_by_path(
          file_path,
          !access_dir_expand_status_by_path(file_path)
        );
        setOnSelectedExplorerItems([file_path]);
        setIsExpanded(!isExpanded);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Tag
        config={{
          reference: tagRef,
          type: "folder",
          label: access_dir_name_by_path(file_path),
          style: {
            borderRadius: 4,
            padding_x: 3,
            padding_y: 3,
            fontSize: default_font_size,
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
            isExpanded: isExpanded,
            maxWidth:
              explorerListWidth - position_x - 8 * default_indicator_padding,
            fullSizeMode: onHover,
          },
        }}
      />
    </div>
  );
};
const ExplorerItemFile = ({ file_path, position_y, position_x }) => {
  const { access_dir_name_by_path } = useContext(RootDataContexts);
  const {
    explorerListWidth,
    setOnSelectedExplorerItems,
    setOnHoverExplorerItems,
  } = useContext(SurfaceExplorerContexts);
  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [onHover, setOnHover] = useState(false);

  useEffect(() => {
    if (onHover) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
      });
      setOnHoverExplorerItems(file_path);
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
      });
    }
  }, [onHover]);

  return (
    <div
      style={{
        transition:
          "top 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08), left 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y + 1,
        left: position_x,
        /* Size ======================== */
        width:
          "calc(100% - " + (position_x + 2 + default_indicator_padding) + "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
        borderRadius: 4,
        backgroundColor: style.backgroundColor,
        boxShadow: onHover ? "0px 4px 16px rgba(0, 0, 0, 0.32)" : "none",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
      onMouseDown={() => {}}
      onMouseUp={(e) => {
        e.stopPropagation();
        setOnSelectedExplorerItems([file_path]);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Tag
        config={{
          reference: tagRef,
          type: "file",
          label: access_dir_name_by_path(file_path),
          style: {
            borderRadius: 4,
            padding_x: 3,
            padding_y: 3,
            fontSize: default_font_size,
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
            maxWidth:
              explorerListWidth - position_x - 8 * default_indicator_padding,
            fullSizeMode: onHover,
          },
        }}
      />
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
    update_folder_expand_status_by_path,
    access_subfiles_by_path,
  } = useContext(RootDataContexts);
  const {
    id,
    command,
    setCommand,
    load_contextMenu,
    setOnSelectedExplorerItems,
  } = useContext(SurfaceExplorerContexts);
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
              setOnSelectedExplorerItems([pasteFile]);

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

const ExplorerList = () => {
  const {
    dir2,
    access_dir_type_by_path,
    access_dir_sub_items_by_path,
    access_dir_expand_status_by_path,
  } = useContext(RootDataContexts);
  const {
    explorerListRef,
    onSelectedExplorerItems,
    setOnSelectedExplorerItems,
    onHoverExplorerItems,
    setOnHoverExplorerItems,
  } = useContext(SurfaceExplorerContexts);
  const [explorerList, setExplorerList] = useState([]);
  const [explorerItemPositions, setExplorerItemPositions] = useState([]);

  const [levelIndicators, setLevelIndicators] = useState([]);
  const [onSelectedIndicators, setOnSelectedIndicators] = useState([]);
  const [ParentIndicator, setParentIndicator] = useState(null);

  useEffect(() => {
    const update_explorer_list = async () => {
      const update_explorer_structure = await render_explorer_structure(
        "root",
        default_indicator_padding,
        default_indicator_padding
      );
      const new_explorer_list = update_explorer_structure.explorer_structure;
      const new_explorer_structure_positions =
        update_explorer_structure.explorer_structure_positions;

      setExplorerList(new_explorer_list);
      setExplorerItemPositions(new_explorer_structure_positions);
    };
    const render_explorer_structure = async (path, position_y, position_x) => {
      const sub_items = access_dir_sub_items_by_path(path);
      let explorer_structure = [];
      let explorer_structure_positions = [];
      let next_position_y = position_y;
      let next_position_x = position_x;
      explorer_structure.push(
        <ExplorerItemFolder
          key={path}
          file_path={path}
          position_y={next_position_y}
          position_x={position_x}
        />
      );
      next_position_y += default_explorer_item_height;
      next_position_x += default_x_axis_offset;

      if (sub_items && access_dir_expand_status_by_path(path)) {
        for (let index = 0; index < sub_items.length; index++) {
          const type = access_dir_type_by_path(sub_items[index]);
          if (type === "folder") {
            const updated_structure = await render_explorer_structure(
              sub_items[index],
              next_position_y,
              next_position_x
            );
            const sub_explorer_structure = updated_structure.explorer_structure;
            const sub_explorer_structure_positions =
              updated_structure.explorer_structure_positions;
            explorer_structure = explorer_structure.concat(
              sub_explorer_structure
            );
            explorer_structure_positions = explorer_structure_positions.concat(
              sub_explorer_structure_positions
            );
            next_position_y +=
              default_explorer_item_height * sub_explorer_structure.length;
          } else {
            explorer_structure.push(
              <ExplorerItemFile
                key={sub_items[index]}
                file_path={sub_items[index]}
                position_y={next_position_y}
                position_x={next_position_x}
              />
            );
            explorer_structure_positions.push({
              file_path: sub_items[index],
              position_y: next_position_y,
              position_x: next_position_x,
              height: default_explorer_item_height,
            });
            next_position_y += default_explorer_item_height;
          }
        }
      }
      explorer_structure_positions.push({
        file_path: path,
        position_y: position_y,
        position_x: position_x,
        height: next_position_y - position_y,
      });
      return {
        explorer_structure: explorer_structure,
        explorer_structure_positions: explorer_structure_positions,
      };
    };
    update_explorer_list();
  }, [dir2]);
  useEffect(() => {
    const update_on_selected_indicator = () => {
      const new_on_selected_indicator = [];
      if (!onSelectedExplorerItems || !explorerItemPositions) return;
      onSelectedExplorerItems.forEach((item) => {
        const position = explorerItemPositions.find(
          (element) => element.file_path === item
        );
        if (!position) return;
        new_on_selected_indicator.push(
          <ExplorerOnSelectedIndicator
            key={item}
            file_path={item}
            position_y={position.position_y}
            position_x={position.position_x}
            height={position.height}
          />
        );
      });
      setOnSelectedIndicators(new_on_selected_indicator);
    };
    const update_level_indicators = () => {
      const new_level_indicators = [];
      if (!onSelectedExplorerItems) return;
      explorerItemPositions.forEach((item) => {
        if (!item) return;
        if (access_dir_type_by_path(item.file_path) === "folder") {
          const position = item;
          new_level_indicators.push(
            <ExplorerLevelIndicator
              key={position.file_path}
              position_y={position.position_y + default_explorer_item_height}
              position_x={position.position_x + default_x_axis_offset}
              height={position.height}
            />
          );
        }
      });
      setLevelIndicators(new_level_indicators);
    };
    update_on_selected_indicator();
    update_level_indicators();
  }, [explorerItemPositions, onSelectedExplorerItems]);
  useEffect(() => {
    const update_parent_indicator = () => {
      if (!onHoverExplorerItems || !explorerItemPositions) {
        setParentIndicator(null);
        return;
      }
      let path = onHoverExplorerItems.split("/");
      if (access_dir_type_by_path(onHoverExplorerItems) === "file") {
        path.pop();
        if (path.length === 1) {
          path = ["root"];
        }
        const position = explorerItemPositions.find(
          (element) => element.file_path === path.join("/")
        );
        setParentIndicator(
          <ExplorerParentIndicator
            position_y={position.position_y}
            position_x={position.position_x}
            height={position.height}
          />
        );
      } else {
        const position = explorerItemPositions.find(
          (element) => element.file_path === onHoverExplorerItems
        );
        setParentIndicator(
          <ExplorerParentIndicator
            position_y={position.position_y}
            position_x={position.position_x}
            height={position.height}
          />
        );
      }
    };
    update_parent_indicator();
  }, [explorerItemPositions, onHoverExplorerItems]);

  return (
    <div
      ref={explorerListRef}
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseUp={() => {
        setOnSelectedExplorerItems([]);
      }}
      onMouseLeave={() => {
        setOnHoverExplorerItems(null);
      }}
      style={{
        /* Position ===================== */
        position: "absolute",
        top: padding.top,
        right: padding.right,
        bottom: padding.bottom,
        left: padding.left,

        /* Size ======================== */
        width: "calc(100% - " + (padding.left + padding.right) + "px)",
        height: "calc(100% - " + (padding.top + padding.bottom) + "px",

        /* Style ======================= */
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {explorerList
        .slice()
        .reverse()
        .map((item) => {
          return item;
        })}
      {ParentIndicator}
      {levelIndicators.map((item) => {
        return item;
      })}
      {onSelectedIndicators.map((item) => {
        return item;
      })}
    </div>
  );
};

const SurfaceExplorer = ({
  id,
  width,
  mode,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
  item_on_drag,
  item_on_drop,
}) => {
  const explorerListRef = useRef(null);
  const [explorerListWidth, setExplorerListWidth] = useState(0);
  const [onSelectedExplorerItems, setOnSelectedExplorerItems] = useState([]);
  const [onHoverExplorerItems, setOnHoverExplorerItems] = useState(null);
  const check_is_explorer_item_selected = useCallback(
    (file_path) => {
      if (onSelectedExplorerItems.includes(file_path)) {
        return true;
      } else {
        return false;
      }
    },
    [onSelectedExplorerItems]
  );
  useEffect(() => {
    if (explorerListRef.current) {
      setExplorerListWidth(explorerListRef.current.offsetWidth);
    }
  }, [width]);

  return (
    <SurfaceExplorerContexts.Provider
      value={{
        id,
        command,
        setCommand,
        load_contextMenu,
        explorerListRef,
        explorerListWidth,
        setExplorerListWidth,
        onSelectedExplorerItems,
        setOnSelectedExplorerItems,
        onHoverExplorerItems,
        setOnHoverExplorerItems,
        check_is_explorer_item_selected,
      }}
    >
      <ExplorerList />
    </SurfaceExplorerContexts.Provider>
  );
};

export default SurfaceExplorer;
