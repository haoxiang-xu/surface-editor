import React, { useState, useRef, useEffect, useContext, memo } from "react";
import axios from "axios";
/* { Import Components } ------------------------------------------------------------------------------------- */
import MonacoCore from "./monaco_core/monaco_core";
import Tag from "../../BUILTIN_COMPONENTs/tag/tag";
/* { Import Contexts } --------------------------------------------------------------------------------------- */
import { globalDragAndDropContexts } from "../../CONTEXTs/globalDragAndDropContexts";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { MonacoEditorContexts } from "./monaco_editor_contexts";
import { MonacoEditorContextMenuContexts } from "./monaco_editor_context_menu_contexts";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import { ICON_MANAGER } from "../../ICONs/icon_manager";
/* { Import Styling } ---------------------------------------------------------------------------------------- */
import "./monaco_editor.css";

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
const GHOST_IMAGE = ICON_MANAGER().GHOST_IMAGE;
/* { ICONs } ------------------------------------------------------------------------------------------------- */

const default_selecion_list_item_padding = 6;

const FileSelectionBar = ({
  code_editor_container_ref_index,
  //HORIZONTAL OR VERTICAL MODE
  mode,

  onDeleteMonacoEditorPath,
  setOnDeleteMonacoEditorPath,
}) => {
  const {
    draggedItem,
    setDraggedItem,
    draggedOverItem,
    setDraggedOverItem,
    dragCommand,
    setDragCommand,
  } = useContext(globalDragAndDropContexts);
  const { access_file_name_by_path_in_file } = useContext(RootDataContexts);
  const {
    id,
    onSelectedMonacoIndex,
    setOnSelectedMonacoIndex,
    monacoPaths,
    setMonacoPaths,
    monacoCores,
    setMonacoCores,
    item_on_drag,
    item_on_drop,
  } = useContext(MonacoEditorContexts);

  const [forceRefresh, setForceRefresh] = useState(false);
  const refresh = () => {
    setForceRefresh(!forceRefresh);
  };

  /* File Selection Bar parameters & Functions ==================================================== */
  const fileSelectionBarContainerRef = useRef(null);
  const fileItemRefs = useRef([]);
  const [onDragIndex, setOnDragIndex] = useState(-1);
  const [onDropIndex, setOnDropIndex] = useState(-1);
  const [onSwapIndex, setOnSwapIndex] = useState(-1);
  const [onDeleteIndex, setOnDeleteIndex] = useState(-1);

  const onFileDelete = (e) => (index) => {
    e.stopPropagation();
    setOnDeleteMonacoEditorPath(monacoPaths[index]);
    setOnDeleteIndex(index);
  };
  useEffect(() => {
    if (onDeleteMonacoEditorPath === null && onDeleteIndex !== -1) {
      const editedFiles = [...monacoPaths];
      editedFiles.splice(onDeleteIndex, 1);
      setMonacoPaths(editedFiles);
      if (onSelectedMonacoIndex === onDeleteIndex) {
        setOnSelectedMonacoIndex(-1);
      } else {
        if (onSelectedMonacoIndex > onDeleteIndex) {
          setOnSelectedMonacoIndex(onSelectedMonacoIndex - 1);
        }
      }
      setOnDeleteIndex(-1);
    }
  }, [onDeleteMonacoEditorPath]);
  const onFileDragStart = (e, index) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
    setOnSelectedMonacoIndex(index);
    setOnDragIndex(index);
    setDraggedItem({
      source:
        "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
      content: monacoPaths[index],
      monaco_cores: monacoCores[monacoPaths[index]],
    });
    item_on_drag(e, {
      source: id,
      ghost_image: "tag",
      content: {
        type: "file",
        path: monacoPaths[index],
      },
    });
  };
  const onFileDragEnd = (e, index) => {
    e.stopPropagation();

    document.body.style.cursor = "";

    if (onDropIndex !== -1) {
      const editedFiles = [...monacoPaths];

      if (onDragIndex < onDropIndex) {
        const dragedFile = editedFiles.splice(onDragIndex, 1)[0];
        editedFiles.splice(onDropIndex - 1, 0, dragedFile);
        setOnSelectedMonacoIndex(
          Math.min(onDropIndex - 1, monacoPaths.length - 1)
        );
      } else {
        const dragedFile = editedFiles.splice(onDragIndex, 1)[0];
        editedFiles.splice(onDropIndex, 0, dragedFile);
        setOnSelectedMonacoIndex(Math.min(onDropIndex, monacoPaths.length - 1));
      }
      setMonacoPaths(editedFiles);
    }
    if (onDropIndex === -1 && draggedOverItem !== null) {
      setDragCommand("APPEND TO TARGET");
    } else {
      setOnDragIndex(-1);
      setOnDropIndex(-1);
      setOnSwapIndex(-1);
      setDraggedItem(null);
    }
    item_on_drop(e);
  };
  const fileSelectionBarOnDragOver = (e) => {
    e.preventDefault();
    const targetElement = e.target.closest(
      ".file_selection_bar_item1114, " +
        ".file_selection_bar_item_selected1114, " +
        ".file_selection_bar_item_vertical0123, " +
        ".file_selection_bar_item_selected_vertical0123"
    );
    if (targetElement && fileSelectionBarContainerRef.current) {
      const childrenArray = Array.from(
        fileSelectionBarContainerRef.current.children
      );
      const dropIndex = childrenArray.indexOf(targetElement);
      if (dropIndex !== onDropIndex && dropIndex !== -1) {
        if (onDragIndex === -1) {
          setDraggedOverItem(monacoPaths[dropIndex]);
        }
        setOnDropIndex(dropIndex);
      }
    }
  };
  const fileSelectionBarOnDragLeave = (e) => {
    e.stopPropagation();
    setOnDropIndex(-1);
    setOnSwapIndex(-1);
    setDraggedOverItem(null);
  };
  useEffect(() => {
    setOnSwapIndex(onDropIndex);
  }, [onDropIndex]);
  useEffect(() => {
    if (onSelectedMonacoIndex !== -1) {
      const itemScrollLeft =
        fileItemRefs.current[onSelectedMonacoIndex]?.offsetLeft;
      const itemWidth =
        fileItemRefs.current[onSelectedMonacoIndex]?.offsetWidth;
      const containerScrollLeft =
        fileSelectionBarContainerRef.current.scrollLeft;
      const containerWidth = fileSelectionBarContainerRef.current?.offsetWidth;

      if (itemScrollLeft < containerScrollLeft) {
        fileSelectionBarContainerRef.current.scrollLeft = itemScrollLeft;
      } else if (
        itemScrollLeft + itemWidth >
        containerScrollLeft + containerWidth
      ) {
        fileSelectionBarContainerRef.current.scrollLeft = itemScrollLeft;
      }
    }
  }, [onSelectedMonacoIndex]);
  useEffect(() => {
    if (onDropIndex !== -1 && dragCommand === "APPEND TO TARGET") {
      const editedFiles = [...monacoPaths];
      if (monacoPaths.indexOf(draggedItem.content) !== -1) {
        const LocalOnDragIndex = monacoPaths.indexOf(draggedItem.content);

        if (LocalOnDragIndex < onDropIndex) {
          const dragedFile = editedFiles.splice(LocalOnDragIndex, 1)[0];
          editedFiles.splice(onDropIndex, 0, dragedFile);
          setOnSelectedMonacoIndex(
            Math.min(onDropIndex - 1, monacoPaths.length - 1)
          );
        } else {
          const dragedFile = editedFiles.splice(LocalOnDragIndex, 1)[0];
          editedFiles.splice(onDropIndex, 0, dragedFile);
          setOnSelectedMonacoIndex(
            Math.min(onDropIndex, monacoPaths.length - 1)
          );
        }
        setMonacoPaths(editedFiles);

        setOnSelectedMonacoIndex(onDropIndex);

        setOnDragIndex(-1);
        setOnDropIndex(-1);
        setOnSwapIndex(-1);
        setDraggedItem(null);
        setDraggedOverItem(null);
        setDragCommand("DELETE FROM SOURCE");
      } else {
        if (draggedItem.source === "vecoder_explorer") {
          setDragCommand("WAITING FOR MODEL APPEND");
        } else {
          setDragCommand("WAITING FOR MODEL APPEND THEN DELETE FROM SOURCE");
        }
        const dragedFile = draggedItem.content;
        editedFiles.splice(onDropIndex, 0, dragedFile);
        const draggedMonacoCore = draggedItem.monaco_cores;
        const editedMonacoCore = { ...monacoCores };
        editedMonacoCore[dragedFile] = draggedMonacoCore;
        setMonacoPaths(editedFiles);
        setMonacoCores(editedMonacoCore);
        setOnSelectedMonacoIndex(onDropIndex);

        setOnDragIndex(-1);
        setOnDropIndex(-1);
        setOnSwapIndex(-1);
        setDraggedItem(null);
        setDraggedOverItem(null);
      }
    }
    if (onDragIndex !== -1 && dragCommand === "DELETE FROM SOURCE") {
      const editedFiles = [...monacoPaths];
      const editedMonacoCore = { ...monacoCores };
      delete editedMonacoCore[monacoPaths[onDragIndex]];
      editedFiles.splice(onDragIndex, 1);
      setMonacoPaths(editedFiles);
      setMonacoCores(editedMonacoCore);
      setOnSelectedMonacoIndex(null);

      setOnDragIndex(-1);
      setOnDropIndex(-1);
      setOnSwapIndex(-1);
      setDragCommand(null);
    }
  }, [dragCommand, monacoPaths, monacoCores]);
  useEffect(() => {
    setOnDropIndex(-1);
  }, [draggedOverItem]);

  /* File Selection Bar parameters & Functions ==================================================== */

  /* Styling----------------------------------------------------------------------------------- */
  const spanRefs = useRef([]);
  useEffect(() => {
    refresh();
  }, [spanRefs.current[onSelectedMonacoIndex]?.offsetWidth]);
  /* Styling----------------------------------------------------------------------------------- */

  return (
    <div
      className={
        mode === "horizontal_stack_horizontal_mode"
          ? "file_selection_bar_container1114"
          : "file_selection_bar_container_vertical0122"
      }
      ref={fileSelectionBarContainerRef}
      onDragOver={(e) => {
        fileSelectionBarOnDragOver(e);
      }}
      onDragLeave={(e) => {
        fileSelectionBarOnDragLeave(e);
      }}
    >
      {monacoPaths.map((filePath, index) => {
        let className;
        let containerStyle = {};
        switch (true) {
          case index === onSelectedMonacoIndex:
            if (mode === "horizontal_stack_horizontal_mode") {
              className = "file_selection_bar_item_selected1114";
              containerStyle = {
                width: spanRefs.current[index]?.offsetWidth + 54 + "px",
              };
            } else {
              className = "file_selection_bar_item_selected_vertical0123";
              containerStyle = {
                height: spanRefs.current[index]?.offsetWidth + 54 + "px",
              };
            }
            if (index === onDragIndex) {
              if (mode === "horizontal_stack_horizontal_mode") {
                containerStyle = {
                  width: 0 + "px",
                  height: 30 + "px",
                  opacity: 0,
                  margin: "0px 0px 0px 0px",
                  overflow: "hidden",
                  transition: "width 0.12s ease, opacity 0.12s ease",
                };
              } else {
                containerStyle = {
                  width: 30 + "px",
                  height: 0 + "px",
                  opacity: 0,
                  margin: "0px 0px 0px 0px",
                  overflow: "hidden",
                  transition: "height 0.12s ease, opacity 0.12s ease",
                };
              }
            }
            break;
          case index === onDropIndex:
            if (mode === "horizontal_stack_horizontal_mode") {
              className = "file_selection_bar_item1114";
              containerStyle = {
                width: spanRefs.current[index]?.offsetWidth + 38 + "px",
                transition: "opacity 0.32s ease",
              };
            } else {
              className = "file_selection_bar_item_vertical0123";
              containerStyle = {
                height: spanRefs.current[index]?.offsetWidth + 38 + "px",
                transition: "opacity 0.32s ease",
              };
            }
            break;
          default:
            if (mode === "horizontal_stack_horizontal_mode") {
              className = "file_selection_bar_item1114";
              containerStyle = {
                width: spanRefs.current[index]?.offsetWidth + 38 + "px",
              };
            } else {
              className = "file_selection_bar_item_vertical0123";
              containerStyle = {
                height: spanRefs.current[index]?.offsetWidth + 38 + "px",
              };
            }
        }
        if (onDragIndex !== -1) {
          containerStyle = { ...containerStyle, backgroundColor: "#252525" };
        }
        return (
          <div
            key={filePath}
            ref={(el) => (fileItemRefs.current[index] = el)}
            className={className}
            draggable={true}
            onDragStart={(e) => {
              onFileDragStart(e, index);
            }}
            onDragEnd={(e) => {
              onFileDragEnd(e);
            }}
            onClick={() => {
              setOnSelectedMonacoIndex(index);
            }}
            style={containerStyle}
          >
            <span
              ref={(el) => (spanRefs.current[index] = el)}
              className={
                mode === "horizontal_stack_horizontal_mode"
                  ? "file_selection_bar_file_text1114"
                  : "file_selection_bar_file_text_vertical0123"
              }
              style={
                index === onSelectedMonacoIndex
                  ? {
                      color: "#cccccc",
                      left:
                        mode === "horizontal_stack_horizontal_mode"
                          ? "47px"
                          : "50%",
                      top:
                        mode === "horizontal_stack_horizontal_mode"
                          ? "50%"
                          : "47px",
                      transition:
                        "color 0.2s ease, left 0.2s ease, top 0.2s ease",
                    }
                  : {
                      color: "#8c8c8c",
                      transition:
                        "color 0.2s ease, left 0.2s ease, top 0.2s ease",
                    }
              }
            >
              {access_file_name_by_path_in_file(filePath)}
            </span>
            <img
              src={
                FILE_TYPE_ICON_MANAGER[
                  access_file_name_by_path_in_file(filePath).split(".").pop()
                ]?.ICON512
              }
              className={
                mode === "horizontal_stack_horizontal_mode"
                  ? "file_selection_bar_item_filetype_icon1114"
                  : "file_selection_bar_item_filetype_icon_vertical0123"
              }
              alt="close"
              style={
                index === onSelectedMonacoIndex
                  ? {
                      opacity: "1",
                      padding:
                        mode === "horizontal_stack_horizontal_mode"
                          ? "7px 0px 0px 28px"
                          : "28px 0px 0px 7px",
                      transition: "padding 0.2s ease",
                      pointerEvents: "none",
                    }
                  : {
                      opacity: "0.64",
                      padding: "7px 0px 0px 7px",
                      transition: "padding 0.2s ease",
                      pointerEvents: "none",
                    }
              }
            />
            <img
              src={SYSTEM_ICON_MANAGER.close.ICON512}
              className={
                mode === "horizontal_stack_horizontal_mode"
                  ? "file_selection_bar_item_close_icon1114"
                  : "file_selection_bar_item_close_icon_vertical0123"
              }
              style={
                onSelectedMonacoIndex === index
                  ? { opacity: "1" }
                  : {
                      opacity: "0",
                      pointerEvents: "none",
                    }
              }
              alt="close"
              draggable="false"
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                onFileDelete(e)(index);
              }}
            />
            {/* Drag and Drop Invisible Overlay ---------------------------------------------- */}
            {onDragIndex !== -1 || draggedItem != null ? (
              <div
                className="file_selection_bar_item_overlay_invisible0206"
                style={containerStyle}
              ></div>
            ) : null}
            {/* Drag and Drop HighLight Overlay ---------------------------------------------- */}
            {index === onDropIndex ? (
              <div
                className="file_selection_bar_item_overlay_highlight0206"
                style={{ ...containerStyle, backgroundColor: "#ffffff" }}
              ></div>
            ) : null}
          </div>
        );
      })}
      {/* {onDragIndex !== -1 || draggedItem !== null ? (
        <DirItemGhostDragImage draggedDirItemPath={draggedItem?.content} />
      ) : null} */}
    </div>
  );
};
const MonacoEditorGroup = ({
  code_editor_container_ref_index,
  setOnSelectedContent,
  onAppendContent,
  setOnAppendContent,
  //HORIZONTAL OR VERTICAL MODE
  mode,

  onDeleteMonacoEditorPath,
  setOnDeleteMonacoEditorPath,
}) => {
  const { onSelectedMonacoIndex, monacoPaths } =
    useContext(MonacoEditorContexts);
  const [diffContent, setDiffContent] = useState(null);
  return monacoPaths.map((filePath, index) => {
    return (
      <MonacoCore
        key={filePath}
        //Editor required parameters
        editor_filePath={filePath}
        code_editor_container_ref_index={code_editor_container_ref_index}
        //Editor function parameters
        onAppendContent={onAppendContent}
        setOnAppendContent={setOnAppendContent}
        setOnSelectedContent={setOnSelectedContent}
        onContextMenu={(e) => {
          handleRightClick(e);
        }}
        mode={mode}
        display={filePath === monacoPaths[onSelectedMonacoIndex] ? true : false}
        //editor_diffContent={diffContent}
        //editor_setDiffContent={setDiffContent}
        onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
        setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
      ></MonacoCore>
    );
  });
};
const MonacoEditorContextMenuWrapper = ({ children }) => {
  const {
    command,
    setCommand,
    load_contextMenu,
    onSelectedCotent,
    setOnSelectedCotent,
    onAppendContent,
    setOnAppendContent,
  } = useContext(MonacoEditorContexts);
  const base_context_menu = {
    root: {
      type: "root",
      sub_items: [
        "continue",
        "fix",
        "br",
        "customizeInstruction",
        "customizeAPI",
        "AST",
        "br",
        "moreOptions",
        "copy",
        "paste",
      ],
    },
    copy: {
      type: "button",
      id: "copy",
      clickable: true,
      label: "copy",
      short_cut_label: "Ctrl+C",
      icon: SYSTEM_ICON_MANAGER.copy.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
    },
    paste: {
      type: "button",
      id: "paste",
      clickable: false,
      label: "paste",
      short_cut_label: "Ctrl+V",
      icon: SYSTEM_ICON_MANAGER.paste.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
    },
    customizeInstruction: {
      type: "button",
      id: "customizeInstruction",
      clickable: true,
      label: "customize instruction",
      icon: SYSTEM_ICON_MANAGER.draftingCompass.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.draftingCompass.ICON16,
    },
    customizeAPI: {
      type: "button",
      id: "customizeAPI",
      icon: SYSTEM_ICON_MANAGER.customize.ICON512,
      label: "customize API",
      quick_view_background: SYSTEM_ICON_MANAGER.customize.ICON16,
      clickable: true,
      sub_items: ["customizeRequest"],
    },
    AST: {
      type: "button",
      id: "AST",
      label: "AST",
      icon: SYSTEM_ICON_MANAGER.ast.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.ast.ICON16,
      clickable: true,
      sub_items: ["viewAST", "updateAST"],
    },
    continue: {
      type: "button",
      id: "continue",
      clickable: true,
      label: "continue...",
      icon: SYSTEM_ICON_MANAGER.continue.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.continue.ICON16,
    },
    fix: {
      type: "button",
      id: "fix",
      clickable: true,
      label: "fix...",
      icon: SYSTEM_ICON_MANAGER.fix.ICON512,
      quick_view_background: SYSTEM_ICON_MANAGER.fix.ICON16,
    },
    br: {
      type: "br",
      id: "br",
    },
    moreOptions: {
      type: "button",
      id: "moreOptions",
      icon: SYSTEM_ICON_MANAGER.moreOptions.ICON512,
      label: "more editor options...",
      quick_view_background: SYSTEM_ICON_MANAGER.moreOptions.ICON16,
      clickable: true,
      sub_items: ["fold", "unfold"],
    },
    fold: {
      type: "button",
      id: "fold",
      icon: SYSTEM_ICON_MANAGER.fold.ICON512,
      label: "fold all",
      quick_view_background: SYSTEM_ICON_MANAGER.fold.ICON16,
      clickable: true,
    },
    unfold: {
      type: "button",
      id: "unfold",
      icon: SYSTEM_ICON_MANAGER.unfold.ICON512,
      label: "unfold all",
      quick_view_background: SYSTEM_ICON_MANAGER.unfold.ICON16,
      clickable: true,
    },
    viewAST: {
      type: "button",
      id: "viewAST",
      icon: SYSTEM_ICON_MANAGER.folderTree.ICON512,
      label: "view AST",
      quick_view_background: SYSTEM_ICON_MANAGER.folderTree.ICON16,
      clickable: true,
    },
    updateAST: {
      type: "button",
      id: "updateAST",
      icon: SYSTEM_ICON_MANAGER.update.ICON512,
      label: "update AST",
      quick_view_background: SYSTEM_ICON_MANAGER.update.ICON16,
      clickable: true,
    },
    customizeRequest: {
      id: "customizeRequest",
      height: 256,
      type: "component",
      path: "monaco_editor/customizeRequestForm/customizeRequestForm",
      width: 278,
    },
  };

  /* APIs ============================================================================================================== */
  const continue_api = async () => {
    const requestBody = {
      language: "js",
      prompt: onSelectedCotent?.selectedText,
    };

    try {
      console.log(onSelectedCotent);
      const response = await axios.post(
        "http://localhost:8200/openai/continue",
        requestBody
      );
      setOnAppendContent(response.data.data.content);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const view_ast_api = async () => {
    const requestBody = {
      language: "js",
      prompt: onSelectedCotent?.selectedText,
    };

    try {
      const response = await axios.post(
        "http://localhost:8200/AST/javascript",
        requestBody
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handle_customized_request_api = async () => {
    let prompt = "";
    const requestURL = command?.content?.command_content?.requestURL;

    if (!requestURL) {
      console.log("requestURL is not defined");
      return;
    }
    switch (command?.content?.command_content?.inputFormat) {
      case "onSelect":
        prompt = onSelectedCotent?.selectedText || "";
        break;
      case "entireFile":
        prompt = "";
        break;
      default:
        console.log("Invalid input format");
        return;
    }
    const requestBody = {
      language: "defaultLanguage",
      prompt: prompt,
    };
    switch (command?.content?.command_content?.requestMethod) {
      case "GET":
        try {
          const response = await axios.get(requestURL, requestBody);
          console.log(response.data);
        } catch (e) {
          console.log("Error in axios request:", e);
        }
        break;
      case "POST":
        try {
          const response = await axios.post(requestURL, requestBody);
          console.log(response.data);
        } catch (e) {
          console.log("Error in axios request:", e);
        }
        break;
      default:
        console.log("Invalid request method");
        return;
    }
  };
  /* APIs =============================================================================================================== */

  /* { context menu command handler } ----------------------------------------------------------------------------------- */
  const handle_context_menu_command = async () => {
    if (command && command.source === "context_menu") {
      const command_title = command.content.command_title;
      switch (command_title) {
        case "continue":
          continue_api();
          break;
        case "customizeRequest":
          handle_customized_request_api();
          break;
        case "viewAST":
          view_ast_api();
          break;
        case "copy":
          if (onSelectedCotent) {
            await navigator.clipboard.writeText(onSelectedCotent?.selectedText);
          }
          break;
        case "paste":
          const onPaste = await navigator.clipboard.readText();
          if (onPaste !== "") {
            setOnAppendContent(onPaste);
          }
          break;
      }
      setCommand([]);
    }
  };
  /* { context menu command handler } ----------------------------------------------------------------------------------- */

  /* { context menu render } ============================================================================================ */
  const render_context_menu = async (source_editor_component) => {
    let contextStructure = { ...base_context_menu };
    switch (source_editor_component) {
      case "monaco_core": {
        let onPaste = "";
        try {
          onPaste = await navigator.clipboard.readText();
        } catch (error) {
          console.error(
            "[Error] Failed to read clipboard contents, ",
            error,
            "[ monaco_editor.js / render_context_menu ]"
          );
        }
        if (onPaste !== "") {
          contextStructure = {
            ...base_context_menu,
            paste: { ...base_context_menu.paste, clickable: true },
          };
        } else {
          contextStructure = {
            ...base_context_menu,
            paste: { ...base_context_menu.paste, clickable: false },
          };
        }
        return contextStructure;
      }
      default:
        return null;
    }
  };
  const load_editor_context_menu = async (e, source_editor_component) => {
    const contextStructure = await render_context_menu(source_editor_component);
    if (!contextStructure) return;
    load_contextMenu(e, contextStructure);
  };
  /* { context menu render } ============================================================================================ */

  useEffect(() => {
    handle_context_menu_command();
  }, [command]);
  return (
    <MonacoEditorContextMenuContexts.Provider
      value={{
        load_editor_context_menu,
      }}
    >
      <div className="code_editor_container1113">{children}</div>
    </MonacoEditorContextMenuContexts.Provider>
  );
};

/* { File Selection List Sub Component } --------------------------------------------------------------------------------------- */
const FileSelectionListItem = ({ reference, file_path, tag_position }) => {
  const { access_dir_name_by_path } = useContext(RootDataContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: tag_position + "px",
      }}
    >
      <Tag
        config={{
          reference: reference,
          type: "file",
          label: access_dir_name_by_path(file_path),
          style: {
            boxShadow: "none",
          },
        }}
      />
    </div>
  );
};
const FileSelectionListContainer = ({}) => {
  const { width, monacoPaths, setMonacoPaths } =
    useContext(MonacoEditorContexts);

  const tagRefs = useRef(monacoPaths.map(() => React.createRef()));
  const [tagPositions, setTagPositions] = useState([]);

  useEffect(() => {
    const render_tag_positions = () => {
      const tagPositions = [];
      let position_x = 0;

      for (let i = 0; i < monacoPaths.length; i++) {
        tagPositions.push(position_x);
        position_x +=
          tagRefs.current[i].current.offsetWidth +
          default_selecion_list_item_padding;
      }
      setTagPositions(tagPositions);
    };
    render_tag_positions();
  }, [width]);

  return (
    <div
      style={{
        position: "absolute",
        top: "128px",
        left: "0px",

        width: width + "px",
        height: "32px",

        border: "1px solid #252525",
      }}
    >
      {monacoPaths.map((filePath, index) => {
        return (
          <FileSelectionListItem
            key={filePath}
            reference={tagRefs.current[index]}
            file_path={filePath}
            tag_position={tagPositions[index]}
          />
        );
      })}
    </div>
  );
};
/* { File Selection List Sub Component } --------------------------------------------------------------------------------------- */

const MonacoEditor = ({
  id,
  width,
  mode,
  code_editor_container_ref_index,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
  item_on_drag,
  item_on_drop,
}) => {
  //console.log("RDM/RCM/stack_frame/monaco_editor", new Date().getTime());
  /* { Monaco Editor Data } --------------------------------------------------------------------------------------- */
  const [onSelectedMonacoIndex, setOnSelectedMonacoIndex] = useState(
    data?.on_selected_monaco_core_index
  );
  const [monacoPaths, setMonacoPaths] = useState(data?.monaco_paths);
  const [monacoCores, setMonacoCores] = useState(data?.monaco_cores);
  const access_monaco_core_by_path = (path) => {
    return monacoCores[path];
  };
  const update_monaco_core_view_state = (path, view_state) => {
    setMonacoCores((prevData) => {
      return {
        ...prevData,
        [path]: { ...prevData[path], viewState: view_state },
      };
    });
  };
  const update_monaco_core_model = (path, model) => {
    setMonacoCores((prevData) => {
      return {
        ...prevData,
        [path]: { ...prevData[path], model: model },
      };
    });
  };
  useEffect(() => {
    setData((prevData) => {
      return {
        ...prevData,
        on_selected_monaco_core_index: onSelectedMonacoIndex,
      };
    });
  }, [onSelectedMonacoIndex]);
  useEffect(() => {
    setData((prevData) => {
      return {
        ...prevData,
        monaco_paths: monacoPaths,
      };
    });
  }, [monacoPaths]);
  useEffect(() => {
    setData((prevData) => {
      return {
        ...prevData,
        monaco_cores: monacoCores,
      };
    });
  }, [monacoCores]);
  /* { Monaco Editor Data } --------------------------------------------------------------------------------------- */

  const [onDeleteMonacoEditorPath, setOnDeleteMonacoEditorPath] =
    useState(null);
  const [onSelectedCotent, setOnSelectedCotent] = useState(null);
  const [onAppendContent, setOnAppendContent] = useState(null);

  return (
    <MonacoEditorContexts.Provider
      value={{
        id,
        width,
        command,
        setCommand,
        load_contextMenu,
        onSelectedMonacoIndex,
        setOnSelectedMonacoIndex,
        monacoPaths,
        setMonacoPaths,
        monacoCores,
        setMonacoCores,
        access_monaco_core_by_path,
        update_monaco_core_view_state,
        update_monaco_core_model,
        onDeleteMonacoEditorPath,
        setOnDeleteMonacoEditorPath,
        onSelectedCotent,
        setOnSelectedCotent,
        onAppendContent,
        setOnAppendContent,
        item_on_drag,
        item_on_drop,
      }}
    >
      <MonacoEditorContextMenuWrapper>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
        ></link>
        <div style={{ height: "100%" }}>
          <MonacoEditorGroup
            code_editor_container_ref_index={code_editor_container_ref_index}
            setOnSelectedContent={setOnSelectedCotent}
            onAppendContent={onAppendContent}
            setOnAppendContent={setOnAppendContent}
            //HORIZONTAL OR VERTICAL MODE
            mode={mode}
            onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
            setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
          />
          <FileSelectionBar
            code_editor_container_ref_index={code_editor_container_ref_index}
            //HORIZONTAL OR VERTICAL MODE
            mode={mode}
            onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
            setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
          />
          {/* <FileSelectionListContainer /> */}
        </div>
      </MonacoEditorContextMenuWrapper>
    </MonacoEditorContexts.Provider>
  );
};

export default MonacoEditor;
