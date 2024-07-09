import React, { useState, useEffect, useRef, useContext } from "react";
import DirItemGhostDragImage from "../../../dirItemGhostDragImage/dirItemGhostDragImage";
import { ICON_MANAGER, ICON_LOADER } from "../../../../ICONs/icon_manager";
import { RootDataContexts } from "../../../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { rightClickContextMenuCommandContexts } from "../../../../CONTEXTs/rightClickContextMenuContexts";
import { explorerContexts } from "../../../../CONTEXTs/explorerContexts";
import { globalDragAndDropContexts } from "../../../../CONTEXTs/globalDragAndDropContexts";
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
const RenameInputBox = ({ filePath, onCommand, setOnCommand }) => {
  const {
    rename_file_under_dir,
    check_is_file_name_exist_under_path,
    access_file_name_by_path,
    access_file_type_by_path,
  } = useContext(RootDataContexts);
  const inputRef = useRef();
  useEffect(() => {
    if (onCommand === "rename" && inputRef.current) {
      inputRef.current.select();
    }
  }, [onCommand]);
  const [renameInput, setRenameInput] = useState(
    access_file_name_by_path(filePath)
  );
  const [inputBoxClassName, setInputBoxClassName] = useState(
    "dir_item_component_input_box0803"
  );
  const handleRenameInputOnChange = (event) => {
    setRenameInput(event.target.value);
  };
  const handleRenameInputOnKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (renameInput === access_file_name_by_path(filePath)) {
        setOnCommand("false");
        return;
      }
      let parentDirPath = filePath.split("/");
      parentDirPath.pop();
      parentDirPath = parentDirPath.join("/");
      if (!check_is_file_name_exist_under_path(parentDirPath, renameInput)) {
        if (renameInput !== "") {
          rename_file_under_dir(filePath, renameInput);
        }
        setOnCommand("false");
      } else {
        setInputBoxClassName("dir_item_component_input_box_shake0826");
        setTimeout(() => {
          setInputBoxClassName("dir_item_component_input_box0803");
        }, 160);
      }
    }
    if (event.key === "Escape") {
      setOnCommand("false");
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
    access_file_name_by_path,
    access_file_type_by_path,
    access_folder_expand_status_by_path,
    update_folder_expand_status_by_path,
    access_subfiles_by_path,
  } = useContext(RootDataContexts);
  const {
    onRightClickItem,
    setOnRightClickItem,
    rightClickCommand,
    setRightClickCommand,
  } = useContext(rightClickContextMenuCommandContexts);
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
  const handleFolderOnRightClick = () => {
    if (onCopyFile !== null) {
      setOnRightClickItem({
        source: "vecoder_explorer/" + filePath,
        condition: { paste: onCopyFile.fileName },
        content: JSON.parse(JSON.stringify(access_file_subfiles_by_path(filePath))),
        target: "vecoder_explorer/" + filePath,
      });
    } else {
      setOnRightClickItem({
        source: "vecoder_explorer/" + filePath,
        condition: { paste: false },
        content: JSON.parse(JSON.stringify(access_file_subfiles_by_path(filePath))),
        target: "vecoder_explorer/" + filePath,
      });
    }
  };
  const handleFileOnRightClick = () => {
    if (onCopyFile !== null) {
      setOnRightClickItem({
        source: "vecoder_explorer/" + filePath,
        condition: { paste: onCopyFile.fileName },
        content: JSON.parse(JSON.stringify(access_file_subfiles_by_path(filePath))),
        target: "vecoder_explorer/" + filePath,
      });
    } else {
      setOnRightClickItem({
        source: "vecoder_explorer/" + filePath,
        condition: { paste: false },
        content: JSON.parse(JSON.stringify(access_file_subfiles_by_path(filePath))),
        target: "vecoder_explorer/" + filePath,
      });
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
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/")).length -
          1 ||
      access_folder_expand_status_by_path(filePath)
    ) {
      setFolderItemBorderRadius("2px");
    } else if (
      index ===
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/")).length -
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
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/")).length -
          1 &&
      (dirItemOnHover ||
        dirPathOnHover === filePath.split("/").slice(0, -1).join("/"))
    ) {
      setFileItemBorderRadius("2px 2px 7px 2px");
    } else if (
      !root &&
      parentDirItemOnHover &&
      index ===
        access_subfiles_by_path(filePath.split("/").slice(0, -1).join("/")).length - 1
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
    if (event.shiftKey) {
      console.log("shift from file: " + access_file_name_by_path,(filePath));
    } else {
      setOnSingleClickFile(access_file_subfiles_by_path(filePath));
    }
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
    if (onCommand === "false") {
      e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
      setDraggedItem({
        source: "vecoder_explorer",
        content: filePath,
      });
    } else if (onCommand === "rename") {
      e.preventDefault();
    }
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

  /* ON COMMAND -------------------------------------------------------------------------------------------------- */
  //NEW FILE
  useEffect(() => {
    if (onCommand === "newFile") {
      const newFileDefaultName = getNewFileDefaultName();

      const newFile = {
        fileName: newFileDefaultName,
        fileType: "file",
        filePath: filePath + "/" + newFileDefaultName,
        files: [],
      };

      let editedFile = access_file_subfiles_by_path(filePath);
      editedFile.files.push(newFile);
      update_path_under_dir(filePath, editedFile);

      setOnCommand("false");
      setRightClickCommand({
        command: "rename",
        content: null,
        target: "vecoder_explorer/" + newFile.filePath,
      });

      //EXPAND FOLDER
      update_folder_expand_status_by_path(filePath, true);
    }
  }, [onCommand]);
  const getNewFileDefaultName = () => {
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
  //NEW FOLDER
  useEffect(() => {
    if (onCommand === "newFolder") {
      const newFolderDefaultName = getNewFolderDefaultName();
      const newFolder = {
        fileName: newFolderDefaultName,
        fileType: "folder",
        filePath: filePath + "/" + newFolderDefaultName,
        files: [],
      };

      let editedFile = access_file_subfiles_by_path(filePath);
      editedFile.files.push(newFolder);
      update_path_under_dir(filePath, editedFile);

      setOnCommand("false");
      setRightClickCommand({
        command: "rename",
        content: null,
        target: "vecoder_explorer/" + newFolder.filePath,
      });
      update_folder_expand_status_by_path(filePath, true);
    }
  }, [onCommand]);
  const getNewFolderDefaultName = () => {
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
        newFolderDefaultName = "untitled_folder" + newFolderDefaultNameIndex;
        newFolderDefaultNameIndex++;
      }
    }
    return newFolderDefaultName;
  };
  //DELETE
  useEffect(() => {
    if (onCommand === "delete") {
      if (!root) {
        remove_path_under_dir(filePath);
      }
      setOnSingleClickFile(null);
      setOnCommand("false");
    }
  }, [onCommand]);
  //PASTE
  useEffect(() => {
    if (onCommand === "paste") {
      let pasteFile = JSON.parse(JSON.stringify(onCopyFile));

      if (!check_is_file_name_exist_under_path(filePath, pasteFile)) {
        pasteFile.expanded = false;
        setOnSingleClickFile(pasteFile);

        const pasteFileIndex = pasteFile.filePath.split("/").length - 1;
        addPathNameAllChildren(pasteFile, filePath, pasteFileIndex);

        const path = pasteFile.filePath.split("/");
        const add_path = filePath.split("/");
        const combinedPath = add_path.concat(path.slice(pasteFileIndex));
        pasteFile.filePath = combinedPath.join("/");

        let editedFile = access_file_subfiles_by_path(filePath);
        editedFile.files.push(pasteFile);
        update_path_under_dir(filePath, editedFile);

        //EXPAND FOLDER
        update_folder_expand_status_by_path(filePath, true);
      } else {
        alert("File name already exist");
      }
      setOnCommand("false");
    }
  }, [onCommand]);
  const addPathNameAllChildren = (file, addPath, copyFileIndex) => {
    const add_path = addPath.split("/");

    for (let i = 0; i < file.files.length; i++) {
      const path = file.files[i].filePath.split("/");
      let combinedPath = add_path.concat(path.slice(copyFileIndex));
      file.files[i].filePath = combinedPath.join("/");

      addPathNameAllChildren(file.files[i], addPath, copyFileIndex);
    }
  };
  //COPY
  useEffect(() => {
    if (onCommand === "copy") {
      setOnCopyFile(JSON.parse(JSON.stringify(access_file_subfiles_by_path(filePath))));
      setOnCommand("false");
    }
  }, [onCommand]);

  //RIGHT CLICK COMMAND MAIN
  useEffect(() => {
    if (
      rightClickCommand &&
      rightClickCommand.target === "vecoder_explorer/" + filePath
    ) {
      switch (rightClickCommand.command) {
        case "rename":
          setOnCommand("rename");
          break;
        case "newFile":
          setOnCommand("newFile");
          break;
        case "newFolder":
          setOnCommand("newFolder");
          break;
        case "delete":
          setOnCommand("delete");
          break;
        case "paste":
          setOnCommand("paste");
          break;
        case "copy":
          setOnCommand("copy");
          break;
        case "openFolder":
          if (root) {
            window.electronAPI.triggerReadDir();
          }
          break;
        default:
          break;
      }
      setRightClickCommand(null);
    }
  }, [rightClickCommand]);
  /* ON COMMAND -------------------------------------------------------------------------------------------------- */

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
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggable={true}
        >
          {access_subfiles_by_path(filePath).length !== 0 ? (
            /*If file has children -> style as expendable folder*/
            <div>
              {onCommand === "rename" ? (
                /*If file on command is rename -> display rename input box*/
                <RenameInputBox
                  filePath={filePath}
                  dirItemOnHover={dirItemOnHover}
                  onCommand={onCommand}
                  setOnCommand={setOnCommand}
                />
              ) : (
                /* SPAN If file not on command -> diplay folder name and expand arrow button>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
                <span
                  ref={labelRef}
                  className={fileNameClassName}
                  onClick={handleExpandIconOnClick}
                  onContextMenu={handleFolderOnRightClick}
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
                  {access_file_name_by_path(filePath)}
                </span>
              )}
            </div>
          ) : (
            /*If file doesn't has children -> style as unexpendable folder*/
            <div>
              {onCommand === "rename" ? (
                /*If file on command is rename -> display rename input box*/
                <RenameInputBox
                  filePath={filePath}
                  dirItemOnHover={dirItemOnHover}
                  onCommand={onCommand}
                  setOnCommand={setOnCommand}
                />
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
                  onContextMenu={handleFolderOnRightClick}
                >
                  <img
                    src={SYSTEM_ICON_MANAGER.arrow.ICON512}
                    className="dir_item_component_unexpendable_arrow_icon_right0826"
                    loading="lazy"
                  />
                  {access_file_name_by_path(filePath)}
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
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggable={true}
        >
          {onCommand === "rename" ? (
            <RenameInputBox
              filePath={filePath}
              dirItemOnHover={dirItemOnHover}
              onCommand={onCommand}
              setOnCommand={setOnCommand}
            />
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
                        access_file_name_by_path,(filePath).split(".").pop()
                      ]?.LABEL_COLOR,
                borderRadius: fileItemBorderRadius,
                animation:
                  "dir_item_component_container_expand_animation " +
                  expandingTime +
                  "s",
                padding:
                  FILE_TYPE_ICON_MANAGER[
                    access_file_name_by_path,(filePath).split(".").pop()
                  ]?.ICON512 !== undefined
                    ? "1px 0px 1px 6px"
                    : "1px 0px 1px 21px",
              }}
              onContextMenu={handleFileOnRightClick}
            >
              <FileTypeIconLoader
                fileIcon={
                  FILE_TYPE_ICON_MANAGER[
                    access_file_name_by_path,(filePath).split(".").pop()
                  ]?.ICON512
                }
                fileIconBackground={
                  FILE_TYPE_ICON_MANAGER[
                    access_file_name_by_path,(filePath).split(".").pop()
                  ]?.ICON16
                }
              />
              {access_file_name_by_path(filePath)}
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
