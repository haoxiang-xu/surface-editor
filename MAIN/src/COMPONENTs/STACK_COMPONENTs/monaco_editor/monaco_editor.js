import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import MonacoCore from "./monaco_core/monaco_core";
import DirItemGhostDragImage from "../../dirItemGhostDragImage/dirItemGhostDragImage";
import "./monaco_editor.css";
import { ICON_MANAGER } from "../../../ICONs/icon_manager";
import { rightClickContextMenuCommandContexts } from "../../../CONTEXTs/rightClickContextMenuContexts";
import { globalDragAndDropContexts } from "../../../CONTEXTs/globalDragAndDropContexts";
import { RootDataContexts } from "../../../DATA_MANAGERs/root_data_manager/root_data_contexts";

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
const GHOST_IMAGE = ICON_MANAGER().GHOST_IMAGE;
/* Load ICON manager --------------------------------------------------------------------------------- */

const FileSelectionBar = ({
  code_editor_container_ref_index,
  onSelectedIndex,
  setOnSelectedIndex,
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
  const {
    setMonacoEditorsOptionsData,
    updateMonacoEditorPathsByEditorIndex,
    accessMonacoEditorPathsByEditorIndex,
    accessVecoderEditorFileNameDataByPath,
  } = useContext(RootDataContexts);
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
    setOnDeleteMonacoEditorPath(
      accessMonacoEditorPathsByEditorIndex(code_editor_container_ref_index)[
        index
      ]
    );
    setOnDeleteIndex(index);
  };
  useEffect(() => {
    if (onDeleteMonacoEditorPath === null && onDeleteIndex !== -1) {
      const editedFiles = [
        ...accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ),
      ];
      const pathToRemove = accessMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index
      )[onDeleteIndex];
      setMonacoEditorsOptionsData((prevState) => {
        let editedOptions = { ...prevState };
        delete editedOptions[pathToRemove];
        return editedOptions;
      });
      editedFiles.splice(onDeleteIndex, 1);
      updateMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index,
        editedFiles
      );
      if (onSelectedIndex === onDeleteIndex) {
        setOnSelectedIndex(null);
      } else {
        if (onSelectedIndex > onDeleteIndex) {
          setOnSelectedIndex(onSelectedIndex - 1);
        }
      }
      setOnDeleteIndex(-1);
    }
  }, [onDeleteMonacoEditorPath]);
  const onFileDragStart = (e, index) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);

    setOnSelectedIndex(index);
    setOnDragIndex(index);
    setDraggedItem({
      source:
        "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
      content: accessMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index
      )[index],
    });
  };
  const onFileDragEnd = (e, index) => {
    e.stopPropagation();

    document.body.style.cursor = "";

    if (onDropIndex !== -1) {
      const editedFiles = [
        ...accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ),
      ];

      if (onDragIndex < onDropIndex) {
        const dragedFile = editedFiles.splice(onDragIndex, 1)[0];
        editedFiles.splice(onDropIndex - 1, 0, dragedFile);
        setOnSelectedIndex(
          Math.min(
            onDropIndex - 1,
            accessMonacoEditorPathsByEditorIndex(
              code_editor_container_ref_index
            ).length - 1
          )
        );
      } else {
        const dragedFile = editedFiles.splice(onDragIndex, 1)[0];
        editedFiles.splice(onDropIndex, 0, dragedFile);
        setOnSelectedIndex(
          Math.min(
            onDropIndex,
            accessMonacoEditorPathsByEditorIndex(
              code_editor_container_ref_index
            ).length - 1
          )
        );
      }
      updateMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index,
        editedFiles
      );
    }
    if (onDropIndex === -1 && draggedOverItem !== null) {
      setDragCommand("APPEND TO TARGET");
    } else {
      setOnDragIndex(-1);
      setOnDropIndex(-1);
      setOnSwapIndex(-1);
      setDraggedItem(null);
    }
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
          setDraggedOverItem(
            accessMonacoEditorPathsByEditorIndex(
              code_editor_container_ref_index
            )[dropIndex]
          );
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
    if (onSelectedIndex !== -1) {
      const itemScrollLeft = fileItemRefs.current[onSelectedIndex]?.offsetLeft;
      const itemWidth = fileItemRefs.current[onSelectedIndex]?.offsetWidth;
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
  }, [onSelectedIndex]);
  useEffect(() => {
    if (onDropIndex !== -1 && dragCommand === "APPEND TO TARGET") {
      const editedFiles = [
        ...accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ),
      ];
      if (
        accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ).indexOf(draggedItem.content) !== -1
      ) {
        const LocalOnDragIndex = accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ).indexOf(draggedItem.content);

        if (LocalOnDragIndex < onDropIndex) {
          const dragedFile = editedFiles.splice(LocalOnDragIndex, 1)[0];
          editedFiles.splice(onDropIndex, 0, dragedFile);
          setOnSelectedIndex(
            Math.min(
              onDropIndex - 1,
              accessMonacoEditorPathsByEditorIndex(
                code_editor_container_ref_index
              ).length - 1
            )
          );
        } else {
          const dragedFile = editedFiles.splice(LocalOnDragIndex, 1)[0];
          editedFiles.splice(onDropIndex, 0, dragedFile);
          setOnSelectedIndex(
            Math.min(
              onDropIndex,
              accessMonacoEditorPathsByEditorIndex(
                code_editor_container_ref_index
              ).length - 1
            )
          );
        }
        updateMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index,
          editedFiles
        );

        setOnSelectedIndex(onDropIndex);

        setOnDragIndex(-1);
        setOnDropIndex(-1);
        setOnSwapIndex(-1);
        setDraggedItem(null);
        setDraggedOverItem(null);
        setDragCommand("DELETE FROM SOURCE");
      } else {
        const dragedFile = draggedItem.content;
        editedFiles.splice(onDropIndex, 0, dragedFile);
        updateMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index,
          editedFiles
        );
        setOnSelectedIndex(onDropIndex);

        setOnDragIndex(-1);
        setOnDropIndex(-1);
        setOnSwapIndex(-1);
        setDraggedItem(null);
        setDraggedOverItem(null);
        if (draggedItem.source === "vecoder_explorer") {
          setDragCommand("WAITING FOR MODEL APPEND");
        } else {
          setDragCommand("WAITING FOR MODEL APPEND THEN DELETE FROM SOURCE");
        }
      }
    }
    if (onDragIndex !== -1 && dragCommand === "DELETE FROM SOURCE") {
      const editedFiles = [
        ...accessMonacoEditorPathsByEditorIndex(
          code_editor_container_ref_index
        ),
      ];
      editedFiles.splice(onDragIndex, 1);
      updateMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index,
        editedFiles
      );
      setOnSelectedIndex(null);

      setOnDragIndex(-1);
      setOnDropIndex(-1);
      setOnSwapIndex(-1);
      setDragCommand(null);
    }
  }, [dragCommand]);
  useEffect(() => {
    setOnDropIndex(-1);
  }, [draggedOverItem]);

  /* File Selection Bar parameters & Functions ==================================================== */

  /* Styling----------------------------------------------------------------------------------- */
  const spanRefs = useRef([]);
  useEffect(() => {
    refresh();
  }, [spanRefs.current[onSelectedIndex]?.offsetWidth]);
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
      {accessMonacoEditorPathsByEditorIndex(
        code_editor_container_ref_index
      ).map((filePath, index) => {
        let className;
        let containerStyle = {};
        switch (true) {
          case index === onSelectedIndex:
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
              setOnSelectedIndex(index);
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
                index === onSelectedIndex
                  ? {
                      color: "#cccccc",
                      left: mode === "horizontal_stack_horizontal_mode" ? "47px" : "50%",
                      top: mode === "horizontal_stack_horizontal_mode" ? "50%" : "47px",
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
              {accessVecoderEditorFileNameDataByPath(filePath)}
            </span>
            <img
              src={
                FILE_TYPE_ICON_MANAGER[
                  accessVecoderEditorFileNameDataByPath(filePath)
                    .split(".")
                    .pop()
                ]?.ICON512
              }
              className={
                mode === "horizontal_stack_horizontal_mode"
                  ? "file_selection_bar_item_filetype_icon1114"
                  : "file_selection_bar_item_filetype_icon_vertical0123"
              }
              alt="close"
              style={
                index === onSelectedIndex
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
                onSelectedIndex === index
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
      {onDragIndex !== -1 || draggedItem !== null ? (
        <DirItemGhostDragImage draggedDirItemPath={draggedItem?.content} />
      ) : null}
    </div>
  );
};
const MonacoEditorGroup = ({
  code_editor_container_ref_index,
  //CONTEXT MENU
  setOnRightClickItem,
  onSelectedIndex,
  onSelectedContent,
  setOnSelectedContent,
  onAppendContent,
  setOnAppendContent,
  customizeRequest,
  //HORIZONTAL OR VERTICAL MODE
  mode,

  onDeleteMonacoEditorPath,
  setOnDeleteMonacoEditorPath,
}) => {
  const { accessMonacoEditorPathsByEditorIndex } = useContext(RootDataContexts);
  const [diffContent, setDiffContent] = useState(null);
  const handleRightClick = (event) => {
    event.preventDefault();
    if (onSelectedContent || navigator.clipboard.readText() !== "") {
      setOnRightClickItem({
        source:
          "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
        condition: { paste: true },
        content: { customizeRequest: customizeRequest },
        target:
          "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
      });
    } else {
      setOnRightClickItem({
        source:
          "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
        condition: { paste: false },
        content: { customizeRequest: customizeRequest },
        target:
          "vecoder_editor" + "/" + code_editor_container_ref_index.toString(),
      });
    }
  };

  return accessMonacoEditorPathsByEditorIndex(
    code_editor_container_ref_index
  ).map((filePath, index) => {
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
        display={
          filePath ===
          accessMonacoEditorPathsByEditorIndex(code_editor_container_ref_index)[
            onSelectedIndex
          ]
            ? true
            : false
        }
        //editor_diffContent={diffContent}
        //editor_setDiffContent={setDiffContent}
        onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
        setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
      ></MonacoCore>
    );
  });
};

const MonacoEditor = ({
  mode,
  code_editor_container_ref_index,
}) => {
  const {
    accessOnSelectedMonacoIndexByEditorIndex,
    updateOnSelectedMonacoIndexByEditorIndex,
    accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex,
    accessMonacoEditorFileContentDataByEditorIndexAndOnSelectedIndex,
  } = useContext(RootDataContexts);

  const [onSelectedIndex, setOnSelectedIndex] = useState(
    accessOnSelectedMonacoIndexByEditorIndex(code_editor_container_ref_index)
  );
  const [onDeleteMonacoEditorPath, setOnDeleteMonacoEditorPath] =
    useState(null);
  useEffect(() => {
    updateOnSelectedMonacoIndexByEditorIndex(
      code_editor_container_ref_index,
      onSelectedIndex
    );
  }, [onSelectedIndex]);
  const [onSelectedCotent, setOnSelectedCotent] = useState(null);
  const [onAppendContent, setOnAppendContent] = useState(null);

  /* API =================================================================================== */
  const continueAPI = async () => {
    const requestBody = {
      language:
        accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex(
          code_editor_container_ref_index,
          onSelectedIndex
        ),
      prompt: onSelectedCotent?.selectedText,
    };

    try {
      const response = await axios.post(
        "http://localhost:8200/openai/continue",
        requestBody
      );
      console.log(onSelectedCotent);
      setOnAppendContent(response.data.data.content);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getAST = async () => {
    const requestBody = {
      language:
        accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex(
          code_editor_container_ref_index,
          onSelectedIndex
        ),
      prompt: onSelectedCotent?.selectedText,
    };

    try {
      const response = await axios.post(
        "http://localhost:8200/AST/" +
          accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex(
            code_editor_container_ref_index,
            onSelectedIndex
          ),
        requestBody
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCustomizeRequest = async () => {
    setCustomizeRequest(rightClickCommand.content);
    let prompt = "";
    const requestURL = rightClickCommand?.content?.requestURL;

    if (!requestURL) {
      console.log("requestURL is not defined");
      return;
    }
    switch (rightClickCommand?.content?.inputFormat) {
      case "onSelect":
        prompt = onSelectedCotent?.selectedText || "";
        break;
      case "entireFile":
        prompt =
          accessMonacoEditorFileContentDataByEditorIndexAndOnSelectedIndex(
            code_editor_container_ref_index,
            onSelectedIndex
          ) || "";
        break;
      default:
        console.log("Invalid input format");
        return;
    }
    const requestBody = {
      language:
        accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex(
          code_editor_container_ref_index,
          onSelectedIndex
        ) || "defaultLanguage",
      prompt: prompt,
    };
    switch (rightClickCommand?.content?.requestMethod) {
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
  /* API =================================================================================== */

  /* Context Menu ----------------------------------------------------------------------- */
  const {
    onRightClickItem,
    setOnRightClickItem,
    rightClickCommand,
    setRightClickCommand,
  } = useContext(rightClickContextMenuCommandContexts);
  const [customizeRequest, setCustomizeRequest] = useState(null);
  const handleLeftClick = (event) => {
    setOnRightClickItem(null);
  };
  useEffect(() => {
    if (
      rightClickCommand &&
      rightClickCommand.target ===
        "vecoder_editor" + "/" + code_editor_container_ref_index.toString()
    ) {
      handleRightClickCommand(rightClickCommand.command);
      setRightClickCommand(null);
      setOnRightClickItem(null);
    }
  }, [rightClickCommand]);
  const handleRightClickCommand = async (command) => {
    switch (command) {
      case "continue":
        continueAPI();
        break;
      case "viewAST":
        getAST();
        break;
      case "copy":
        if (onSelectedCotent) {
          await navigator.clipboard.writeText(onSelectedCotent?.selectedText);
        }
        break;
      case "paste":
        setOnAppendContent(await navigator.clipboard.readText());
        break;
      case "customizeRequest":
        await handleCustomizeRequest();
        break;
    }
  };
  /* Context Menu ----------------------------------------------------------------------- */

  return (
    <div
      className="code_editor_container1113"
      onClick={(e) => {
        handleLeftClick(e);
      }}
    >
      <link
        href="https://fonts.googleapis.com/css?family=Roboto"
        rel="stylesheet"
      ></link>
      <div style={{ height: "100%" }}>
        <MonacoEditorGroup
          code_editor_container_ref_index={code_editor_container_ref_index}
          //CONTEXT MENU
          setOnRightClickItem={setOnRightClickItem}
          onSelectedIndex={onSelectedIndex}
          onSelectedContent={onSelectedCotent}
          setOnSelectedContent={setOnSelectedCotent}
          onAppendContent={onAppendContent}
          setOnAppendContent={setOnAppendContent}
          customizeRequest={customizeRequest}
          //HORIZONTAL OR VERTICAL MODE
          mode={mode}
          onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
          setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
        />
        <FileSelectionBar
          code_editor_container_ref_index={code_editor_container_ref_index}
          onSelectedIndex={onSelectedIndex}
          setOnSelectedIndex={setOnSelectedIndex}
          //HORIZONTAL OR VERTICAL MODE
          mode={mode}
          onDeleteMonacoEditorPath={onDeleteMonacoEditorPath}
          setOnDeleteMonacoEditorPath={setOnDeleteMonacoEditorPath}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
