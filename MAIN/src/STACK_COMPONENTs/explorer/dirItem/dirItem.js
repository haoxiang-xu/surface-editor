import React, { useState, useEffect, useRef, useContext } from "react";
import { SurfaceExplorerContexts } from "../surface_explorer_contexts.js";
import { SurfaceExplorerContextMenuContexts } from "../surface_explorer_context_menu_contexts.js";
import DirItemGhostDragImage from "../../../COMPONENTs/dirItemGhostDragImage/dirItemGhostDragImage";
import { ICON_MANAGER, ICON_LOADER } from "../../../ICONs/icon_manager";
import { RootDataContexts } from "../../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { rightClickContextMenuCommandContexts } from "../../../CONTEXTs/rightClickContextMenuContexts";
import { explorerContexts } from "../../../CONTEXTs/explorerContexts";
import { globalDragAndDropContexts } from "../../../CONTEXTs/globalDragAndDropContexts";
import { RootCommandContexts } from "../../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import "./dirItem.css";

/* Load ICON manager -------------------------------- */
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
const GHOST_IMAGE = ICON_MANAGER().GHOST_IMAGE;
/* Load ICON manager -------------------------------- */

const FileTypeIconLoader = ({ fileIcon, fileIconBackground }) => {
  /* ICON Loader ----------------------------------------------------------------- */
  const [isFileTypeIconLoad, setIsFileTypeIconLoad] = useState(false);
  const handleFileTypeIconLoad = () => {
    setIsFileTypeIconLoad(true);
  };
  /* ICON Loader ----------------------------------------------------------------- */
  return (
    <div>
      {fileIcon !== undefined ? (
        <div
          className="dir_item_component_script_icon0725"
          style={
            isFileTypeIconLoad
              ? {}
              : {
                  backgroundImage: `url(${fileIconBackground})`,
                }
          }
        >
          <img
            src={fileIcon}
            className="dir_item_component_script_icon0725"
            loading="lazy"
            onLoad={handleFileTypeIconLoad}
          ></img>
        </div>
      ) : null}
    </div>
  );
};
const RenameInputBox = ({ filePath }) => {
  const {
    rename_file_under_dir,
    check_is_file_name_exist_under_path,
    access_file_name_by_path_in_dir,
    access_file_type_by_path,
  } = useContext(RootDataContexts);
  const { command, setCommand } = useContext(SurfaceExplorerContexts);
  const { onConextMenuPath } = useContext(SurfaceExplorerContextMenuContexts);
  const inputRef = useRef();
  useEffect(() => {
    if (
      command?.content?.command_title === "rename" &&
      onConextMenuPath === filePath &&
      inputRef.current
    ) {
      inputRef.current.select();
    }
  }, [command]);
  const [renameInput, setRenameInput] = useState(
    access_file_name_by_path_in_dir(filePath)
  );
  const [inputBoxClassName, setInputBoxClassName] = useState(
    "dir_item_component_input_box0803"
  );
  const handleRenameInputOnChange = (event) => {
    setRenameInput(event.target.value);
  };
  const handleRenameInputOnKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (renameInput === access_file_name_by_path_in_dir(filePath)) {
        setCommand([]);
        return;
      }
      let parentDirPath = filePath.split("/");
      parentDirPath.pop();
      parentDirPath = parentDirPath.join("/");
      if (!check_is_file_name_exist_under_path(parentDirPath, renameInput)) {
        if (renameInput !== "") {
          rename_file_under_dir(filePath, renameInput);
        }
        setCommand([]);
      } else {
        setInputBoxClassName("dir_item_component_input_box_shake0826");
        setTimeout(() => {
          setInputBoxClassName("dir_item_component_input_box0803");
        }, 160);
      }
    }
    if (event.key === "Escape") {
      setCommand([]);
    }
  };

  return (
    <input
      type="text"
      value={renameInput}
      className={inputBoxClassName}
      onChange={handleRenameInputOnChange}
      onKeyDown={handleRenameInputOnKeyDown}
      ref={inputRef}
      style={{
        width: `calc(100% - ${22}px)`,
        borderRadius: "2px",
        padding:
          access_file_type_by_path(filePath) === "folder"
            ? "1px 0px 1px 22px"
            : "1px 0px 1px 21px",
        margin: "0px 0px 0px 0px",
      }}
    />
  );
};
const SubDirList = ({
  filePath,
  dirItemOnHover,
  dirPathOnHover,
  expendAnimation,
  unexpendAnimation,
}) => {
  const { access_folder_expand_status_by_path, access_subfiles_by_path } =
    useContext(RootDataContexts);
  const [onHover, setOnHover] = useState(false);
  useEffect(() => {
    if (dirItemOnHover || dirPathOnHover === filePath) {
      setOnHover(true);
    } else {
      setOnHover(false);
    }
  }, [dirItemOnHover, dirPathOnHover]);
  return access_subfiles_by_path(filePath).length !== 0 &&
    access_folder_expand_status_by_path(filePath) ? (
    /*If file has children -> Including the children file list*/
    <div>
      <ul
        className={
          onHover
            ? "dir_item_component_dir_list_on_hover0304"
            : "dir_item_component_dir_list0725"
        }
      >
        {access_subfiles_by_path(filePath).map((item, index) => (
          <li key={item.filePath} style={expendAnimation}>
            <DirItem
              index={index}
              filePath={item.filePath}
              root={false}
              //DirItem Styling Related
              parentDirItemOnHover={dirItemOnHover}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    /*If file doesn't have children -> Leave empty*/
    <div style={unexpendAnimation}></div>
  );
};

const DirItem = ({
  index,
  filePath,
  root,
  //DirItem Styling Related
  parentDirItemOnHover,
}) => {
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
  const { stack_component_unique_tag, command, setCommand, load_contextMenu } =
    useContext(SurfaceExplorerContexts);
  const { onRightClickItem, setRightClickCommand } = useContext(
    rightClickContextMenuCommandContexts
  );
  const {
    dirPathOnHover,
    setDirPathOnHover,
    onSingleClickFile,
    setOnSingleClickFile,
    onCopyFile,
    setOnCopyFile,
    onDragFiles,
    setOnDragFiles,
  } = useContext(explorerContexts);
  const { onConextMenuPath, load_explorer_context_menu } = useContext(
    SurfaceExplorerContextMenuContexts
  );
  const {
    draggedItem,
    setDraggedItem,
    draggedOverItem,
    setDraggedOverItem,
    dragCommand,
    setDragCommand,
  } = useContext(globalDragAndDropContexts);

  const [onCommand, setOnCommand] = useState("false");
  const [fileNameClassName, setFileNameClassName] = useState(
    "dir_item_component_file_name0725"
  );

  /* EXPAND RELATED ===================================================================== */
  const [isExpanded, setIsExpanded] = useState(
    access_folder_expand_status_by_path(filePath)
  );
  const expandingTime = 0.12;
  const unexpandingTime = 0.12;
  const [dirListUnexpendKeyframes, setDirListUnexpendKeyframes] = useState({
    "0%": {
      height: "18.5px",
    },
    "100%": {
      height: "0px",
    },
  });
  const [dirListExpendKeyframes, setDirListExpendKeyframes] = useState({
    "0%": {
      top: "-18.5px",
      opacity: 0,
    },
    "30%": {
      opacity: 0,
    },
    "100%": {
      top: "0px",
      opacity: 1,
    },
  });
  const dirListUnexpendAnimation = {
    animation:
      "dir_item_component_dir_list_unexpend_animation " + unexpandingTime + "s",
  };
  const dirListExpendAnimation = {
    animation:
      "dir_item_component_dir_list_expend_animation " + expandingTime + "s",
  };
  const [expendAnimation, setExpendAnimation] = useState({});
  const [unexpendAnimation, setUnexpendAnimation] = useState({});

  const handleExpandIconOnClick = (event) => {
    handleOnLeftClick(event);
    if (!access_folder_expand_status_by_path(filePath)) {
      setExpendAnimation({
        ...dirListExpendAnimation,
        ...dirListExpendKeyframes,
      });
      setUnexpendAnimation({});
      update_folder_expand_status_by_path(filePath, true);
      setIsExpanded(true);
      //REMOVE ANIMATION
      setTimeout(() => {
        setExpendAnimation({});
      }, expandingTime * 1000);
    } else {
      setExpendAnimation({});
      setUnexpendAnimation({
        ...dirListUnexpendAnimation,
        ...dirListUnexpendKeyframes,
      });
      update_folder_expand_status_by_path(filePath, false);
      setIsExpanded(false);
      //REMOVE ANIMATION
      setTimeout(() => {
        setUnexpendAnimation({});
      }, unexpandingTime * 1000);
    }
  };
  /* EXPAND RELATED ===================================================================== */

  /*Styling Related ----------------------------------------------------------------------------- */
  const labelRef = useRef();
  const [dirItemOnHover, setDirItemOnHover] = useState(false);
  const [folderItemBorderRadius, setFolderItemBorderRadius] = useState("3px");
  const [folderItemBackgroundColor, setFolderItemBackgroundColor] =
    useState(null);
  const [fileItemBorderRadius, setFileItemBorderRadius] = useState("3px");

  useEffect(() => {
    if (
      (dirItemOnHover && access_file_type_by_path(filePath) === "file") ||
      (access_file_type_by_path(filePath) === "folder" &&
        !access_folder_expand_status_by_path(filePath))
    ) {
      setDirPathOnHover(filePath.split("/").slice(0, -1).join("/"));
    } else if (
      access_file_type_by_path(filePath) === "folder" &&
      access_folder_expand_status_by_path(filePath)
    ) {
      setDirPathOnHover(null);
    }
  }, [dirItemOnHover, isExpanded]);
  useEffect(() => {
    /* Folder Item Border Radius ============================================== */
    if (
      (access_folder_expand_status_by_path(filePath) && dirItemOnHover) ||
      dirPathOnHover === filePath
    ) {
      setFolderItemBorderRadius("7px 7px 2px 2px");
    } else if (
      index <
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/"))
          .length -
          1 ||
      access_folder_expand_status_by_path(filePath)
    ) {
      setFolderItemBorderRadius("2px");
    } else if (
      index ===
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/"))
          .length -
          1 &&
      dirItemOnHover
    ) {
      setFolderItemBorderRadius("2px 2px 7px 2px");
    } else {
      setFolderItemBorderRadius("2px");
    }
    /* Folder Item Border Radius ============================================== */

    /* File Item Border Radius ============================================== */
    if (
      index ===
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/"))
          .length -
          1 &&
      (dirItemOnHover ||
        dirPathOnHover === filePath.split("/").slice(0, -1).join("/"))
    ) {
      setFileItemBorderRadius("2px 2px 7px 2px");
    } else if (
      !root &&
      parentDirItemOnHover &&
      index ===
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/"))
          .length -
          1
    ) {
      setFileItemBorderRadius("2px 2px 7px 2px");
    } else {
      setFileItemBorderRadius("2px");
    }
    /* File Item Border Radius ============================================== */

    if (onSingleClickFile === undefined && dirPathOnHover === filePath) {
      setFolderItemBackgroundColor("#2b2b2b");
    } else if (
      onSingleClickFile &&
      onSingleClickFile.filePath !== filePath &&
      dirPathOnHover === filePath
    ) {
      setFolderItemBackgroundColor("#2b2b2b");
    } else {
      setFolderItemBackgroundColor(null);
    }
  }, [
    dirPathOnHover,
    dirItemOnHover,
    dir,
    onSingleClickFile,
    parentDirItemOnHover,
  ]);
  const handleMouseEnter = () => {
    setDirItemOnHover(true);
  };
  const handleMouseMove = () => {
    setDirItemOnHover(true);
  };
  const handleMouseLeave = () => {
    setDirItemOnHover(false);
  };
  /*Styling Related ----------------------------------------------------------------------------- */

  //SINGLE CLICK
  const handleOnLeftClick = (event) => {
    setOnSingleClickFile(access_file_subfiles_by_path(filePath));
  };
  useEffect(() => {
    if (onSingleClickFile !== null) {
      if (onSingleClickFile.filePath === filePath) {
        setFileNameClassName("dir_item_component_file_name_on_selected0827");
      } else {
        setFileNameClassName("dir_item_component_file_name0725");
      }
    }
  }, [onSingleClickFile]);
  useEffect(() => {
    if (onRightClickItem === null) {
    } else if (onRightClickItem.source === "vecoder_explorer/" + filePath) {
      setFileNameClassName("dir_item_component_file_name_on_selected0827");
    } else {
      if (onSingleClickFile !== null) {
        if (onSingleClickFile.filePath === filePath) {
          setFileNameClassName("dir_item_component_file_name_on_selected0827");
        } else {
          setFileNameClassName("dir_item_component_file_name0725");
        }
      } else {
        setFileNameClassName("dir_item_component_file_name0725");
      }
    }
  }, [onRightClickItem]);
  const onDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
    setDraggedItem({
      source: "vecoder_explorer",
      content: filePath,
    });
  };
  const onDragEnd = (e) => {
    e.stopPropagation();
    if (draggedOverItem && access_file_type_by_path(filePath) === "file") {
      setDragCommand("APPEND TO TARGET");
    } else {
      setDraggedItem(null);
      setDraggedOverItem(null);
    }
  };

  return (
    <div draggable={true}>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto"
        rel="stylesheet"
      ></link>
      {/* Dir Item ----------------------------------------------------------------------------------------- */}
      {access_file_type_by_path(filePath) === "folder" ? (
        /*If file type is folder -> style as folder*/
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onContextMenu={(e) => {
            load_explorer_context_menu(e, root ? "root" : "folder", filePath);
          }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggable={true}
        >
          {access_subfiles_by_path(filePath).length !== 0 ? (
            /*If file has children -> style as expendable folder*/
            <div>
              {command?.content?.command_title === "rename" &&
              onConextMenuPath === filePath ? (
                /*If file on command is rename -> display rename input box*/
                <RenameInputBox filePath={filePath} />
              ) : (
                /* SPAN If file not on command -> diplay folder name and expand arrow button>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
                <span
                  ref={labelRef}
                  className={fileNameClassName}
                  onClick={handleExpandIconOnClick}
                  style={{
                    borderRadius: folderItemBorderRadius,
                    backgroundColor: folderItemBackgroundColor,
                  }}
                >
                  <img
                    src={SYSTEM_ICON_MANAGER.arrow.ICON512}
                    className={
                      access_folder_expand_status_by_path(filePath)
                        ? "dir_item_component_arrow_icon_down0725"
                        : "dir_item_component_arrow_icon_right0725"
                    }
                    onClick={handleExpandIconOnClick}
                    loading="lazy"
                  />
                  {access_file_name_by_path_in_dir(filePath)}
                </span>
              )}
            </div>
          ) : (
            /*If file doesn't has children -> style as unexpendable folder*/
            <div>
              {command?.content?.command_title === "rename" &&
              onConextMenuPath === filePath ? (
                /*If file on command is rename -> display rename input box*/
                <RenameInputBox filePath={filePath} />
              ) : (
                /* SPAN If file not on command -> diplay folder name and expand arrow button>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
                <span
                  ref={labelRef}
                  className={fileNameClassName}
                  style={{
                    borderRadius: folderItemBorderRadius,
                    backgroundColor: folderItemBackgroundColor,
                  }}
                  onClick={(e) => handleOnLeftClick(e)}
                >
                  <img
                    src={SYSTEM_ICON_MANAGER.arrow.ICON512}
                    className="dir_item_component_unexpendable_arrow_icon_right0826"
                    loading="lazy"
                  />
                  {access_file_name_by_path_in_dir(filePath)}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /*If file type is not folder -> style as file*/
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onContextMenu={(e) => {
            load_explorer_context_menu(e, "file", filePath);
          }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggable={true}
        >
          {command?.content?.command_title === "rename" &&
          onConextMenuPath === filePath ? (
            <RenameInputBox filePath={filePath} />
          ) : (
            /* SPAN file>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
            <span
              ref={labelRef}
              className={fileNameClassName}
              onClick={(e) => handleOnLeftClick(e)}
              style={{
                color:
                  onSingleClickFile && onSingleClickFile.filePath === filePath
                    ? "#CCCCCC"
                    : FILE_TYPE_ICON_MANAGER[
                        (access_file_name_by_path_in_dir,
                        filePath.split(".").pop())
                      ]?.LABEL_COLOR,
                borderRadius: fileItemBorderRadius,
                animation:
                  "dir_item_component_container_expand_animation " +
                  expandingTime +
                  "s",
                padding:
                  FILE_TYPE_ICON_MANAGER[
                    (access_file_name_by_path_in_dir, filePath.split(".").pop())
                  ]?.ICON512 !== undefined
                    ? "1px 0px 1px 6px"
                    : "1px 0px 1px 21px",
              }}
            >
              <FileTypeIconLoader
                fileIcon={
                  FILE_TYPE_ICON_MANAGER[
                    (access_file_name_by_path_in_dir, filePath.split(".").pop())
                  ]?.ICON512
                }
                fileIconBackground={
                  FILE_TYPE_ICON_MANAGER[
                    (access_file_name_by_path_in_dir, filePath.split(".").pop())
                  ]?.ICON16
                }
              />
              {access_file_name_by_path_in_dir(filePath)}
            </span>
          )}
        </div>
      )}
      {/* Dir Item ----------------------------------------------------------------------------------------- */}

      {/* SubFiles List -------------------------------------------------------------------------------------------- */}
      <SubDirList
        filePath={filePath}
        dirItemOnHover={dirItemOnHover}
        dirPathOnHover={dirPathOnHover}
        expendAnimation={expendAnimation}
        unexpendAnimation={unexpendAnimation}
      />
      {/* SubFiles List -------------------------------------------------------------------------------------------- */}

      {onDragFiles !== null &&
      draggedItem !== null &&
      filePath === draggedItem ? (
        <DirItemGhostDragImage draggedDirItemPath={draggedItem.content} />
      ) : null}

      <style>
        {`
          @keyframes dir_item_component_dir_list_unexpend_animation {
            ${Object.entries(dirListUnexpendKeyframes)
              .map(
                ([key, value]) =>
                  `${key} { ${Object.entries(value)
                    .map(([k, v]) => `${k}: ${v};`)
                    .join(" ")} }`
              )
              .join(" ")}
          }
          @keyframes dir_item_component_dir_list_expend_animation {
            ${Object.entries(dirListExpendKeyframes)
              .map(
                ([key, value]) =>
                  `${key} { ${Object.entries(value)
                    .map(([k, v]) => `${k}: ${v};`)
                    .join(" ")} }`
              )
              .join(" ")}
          }
        `}
      </style>
    </div>
  );
};

export default DirItem;
