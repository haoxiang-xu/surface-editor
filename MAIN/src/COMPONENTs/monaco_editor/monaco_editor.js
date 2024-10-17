import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
/* { Import Components } ------------------------------------------------------------------------------------- */
import MonacoCore from "./monaco_core/monaco_core";
import Tag from "../../BUILTIN_COMPONENTs/tag/tag";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
/* { Import Contexts } --------------------------------------------------------------------------------------- */
import { globalDragAndDropContexts } from "../../CONTEXTs/globalDragAndDropContexts";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import { MonacoEditorContexts } from "./monaco_editor_contexts";
import { MonacoEditorContextMenuContexts } from "./monaco_editor_context_menu_contexts";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import { ICON_MANAGER } from "../../ICONs/icon_manager";
/* { Import Styling } ---------------------------------------------------------------------------------------- */
import "./monaco_editor.css";
import { on } from "events";

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

const default_selecion_list_item_padding = 8;
const default_border_radius = 5;
const default_selecion_list_icon_offset = 22;
const default_tag_max_width = 128;

const default_onhover_item_background_color_offset = 16;

const R = 30;
const G = 30;
const B = 30;

const MonacoEditorGroup = ({
  code_editor_container_ref_index,
  setOnSelectedContent,
  onAppendContent,
  setOnAppendContent,
  //HORIZONTAL OR VERTICAL MODE
  mode,

  onDeleteMonacoEditorPath,
  setOnDeleteMonacoEditorPath,

  setMonacoCallbacks,
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
        setMonacoCallbacks={setMonacoCallbacks}
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
      icon: "fold",
      label: "fold all",
      quick_view_background: SYSTEM_ICON_MANAGER.fold.ICON16,
      clickable: true,
    },
    unfold: {
      type: "button",
      id: "unfold",
      icon: "unfold",
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
const FileSelectionListItem = ({
  containerListRef,
  reference,
  index,
  file_path,
  tag_position,
  tag_size,
  setTagPositions,
}) => {
  const { access_dir_name_by_path } = useContext(RootDataContexts);
  const {
    id,
    mode,
    width,
    onSelectedMonacoIndex,
    setOnSelectedMonacoIndex,
    onDragedMonacoIndex,
    setOnDragMonacoIndex,
    onDragOveredMonacoIndex,
    setOnDragOverMonacoIndex,
    onDragOverPosition,
    setOnDragOverPosition,
    monacoPaths,
    setMonacoPaths,
    item_on_drag,
    item_on_drop,
    monacoCallbacks,
  } = useContext(MonacoEditorContexts);
  const containerRef = useRef(null);
  const [zIndex, setZIndex] = useState(6);
  const [itemWidth, setItemWidth] = useState(0);
  const [tagSize, setTagSize] = useState({
    width: default_tag_max_width,
    height: 0,
  });
  const [tagLeft, setTagLeft] = useState(0);
  const [tagColorOffset, setTagColorOffset] = useState(0);
  const [closeButtonStyle, setCloseButtonStyle] = useState({
    backgroundColorOffset: 32,
    onHover: false,
  });
  const [tagOpacity, setTagOpacity] = useState(1);

  const to_delete_tag = useCallback(
    (onDragItem, onDropItem) => {
      setOnSelectedMonacoIndex(-1);
      if (
        monacoCallbacks[onDragItem.content.path]?.callback_to_delete !==
        undefined
      ) {
        monacoCallbacks[onDragItem.content.path].callback_to_delete();
      }
      const to_delete_index = monacoPaths.indexOf(onDragItem.content.path);
      setMonacoPaths((prevData) => {
        return prevData.filter((path, index) => index !== to_delete_index);
      });
      setTagPositions((prevData) => {
        const new_data = { ...prevData };
        delete new_data[onDragItem.content.path];
        return new_data;
      });
    },
    [file_path, monacoPaths]
  );

  useEffect(() => {
    setItemWidth(
      onDragOveredMonacoIndex === index
        ? tagSize.width + default_tag_max_width + "px"
        : tagSize.width + "px"
    );
  }, [tag_size, onDragOveredMonacoIndex, index]);
  useEffect(() => {
    if (index === onDragedMonacoIndex) {
      setZIndex(6);
      setTagOpacity(0);
      setTagColorOffset(0);
    } else if (index === onSelectedMonacoIndex) {
      setZIndex(7);
      setTagOpacity(1);
      setTagColorOffset(default_onhover_item_background_color_offset);
    } else {
      setZIndex(6);
      setTagOpacity(0.32);
      setCloseButtonStyle({
        backgroundColorOffset: 32,
        onHover: false,
      });
      setTagColorOffset(0);
    }
  }, [onSelectedMonacoIndex, onDragedMonacoIndex]);
  useEffect(() => {
    if (reference?.current) {
      setTagSize({
        width: reference?.current?.offsetWidth,
        height: reference?.current?.offsetHeight,
      });
    }
  }, [tag_size]);
  const update_on_drag_over_position = useCallback(
    (event, index) => {
      if (index === onDragedMonacoIndex) return;
      if (onDragOveredMonacoIndex === index && containerRef) {
        const rect = containerRef.current.getBoundingClientRect();
        setOnDragOverPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
      setOnDragOverMonacoIndex(index);
    },
    [containerRef, onDragedMonacoIndex, onDragOveredMonacoIndex]
  );
  useEffect(() => {
    if (onDragOveredMonacoIndex === index) {
      if (onDragOverPosition.x < (tag_size.width + default_tag_max_width) / 2) {
        setTagLeft(default_tag_max_width);
      } else {
        setTagLeft(0);
      }
    } else {
      setTagLeft(0);
    }
  }, [onDragOverPosition, onDragOveredMonacoIndex, tag_position, tag_size]);

  const memoized_tag_style = useMemo(() => {
    return {
      top: "50%",
      left: tagLeft,
      transform: "translate(0%, -50%)",
      boxShadow: "none",
      pointerEvents: "none",
      maxWidth: default_tag_max_width,
      backgroundColor: `rgba( ${R + tagColorOffset}, ${G + tagColorOffset}, ${
        B + tagColorOffset
      }, 1 )`,
      verticalMode: mode.includes("vertical"),
    };
  }, [tagLeft, tagColorOffset, mode]);

  return (
    <div
      ref={containerRef}
      draggable={true}
      style={{
        transition:
          "left 0.32s cubic-bezier(0.32, 1, 0.32, 1), width 0.32s cubic-bezier(0.32, 1, 0.32, 1)",
        position: "absolute",
        top: 0,
        left: tag_position ? tag_position : 0,
        width: itemWidth,
        bottom: default_selecion_list_item_padding / 2,
        zIndex: zIndex,
        opacity: tagOpacity,
        backgroundColor: `rgba( ${R}, ${G}, ${B}, 1 )`,
      }}
      onMouseUp={() => {
        setOnSelectedMonacoIndex(index);
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
        setOnDragMonacoIndex(index);
        setOnDragOverMonacoIndex(-1);
        setOnSelectedMonacoIndex(index);
        item_on_drag(e, {
          source: id,
          ghost_image: "tag",
          content: {
            type: "file",
            path: file_path,
          },
          callback_to_delete: to_delete_tag,
        });
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        setOnDragMonacoIndex(-1);
        setOnDragOverMonacoIndex(-1);
        item_on_drop(e);
      }}
      onDragOver={(e) => {
        update_on_drag_over_position(e, index);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
      }}
    >
      <Tag
        config={{
          reference: reference,
          type: "file_page",
          label: access_dir_name_by_path(file_path),
          style: memoized_tag_style,
        }}
      />
      {index === onSelectedMonacoIndex ? (
        <Icon
          draggable={false}
          src="close"
          style={{
            transition:
              "left 0.32s cubic-bezier(0.32, 1, 0.32, 1), backgroundColor 0.12s ease",

            transform: "translate(0%, -50%)",
            position: "absolute",
            top: "50%",
            left: -default_selecion_list_icon_offset + tagLeft,
            width: 16,
            height: 16,
            padding: 1,
            borderRadius: 3,
            opacity: closeButtonStyle.onHover ? 0.72 : 0.32,
            backgroundColor: `rgba( ${
              R + closeButtonStyle.backgroundColorOffset
            }, ${G + closeButtonStyle.backgroundColorOffset}, ${
              B + closeButtonStyle.backgroundColorOffset
            }, ${closeButtonStyle.onHover ? 1 : 0} )`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            to_delete_tag({ content: { path: file_path } });
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setCloseButtonStyle({
              backgroundColorOffset: 64,
              onHover: true,
            });
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setCloseButtonStyle({
              backgroundColorOffset: 32,
              onHover: false,
            });
          }}
          onMouseDown={() => {
            setCloseButtonStyle({
              backgroundColorOffset: 128,
              onHover: true,
            });
          }}
          onMouseUp={() => {
            setCloseButtonStyle({
              backgroundColorOffset: 64,
              onHover: true,
            });
          }}
        />
      ) : null}
    </div>
  );
};
const FileSelectionListContainer = ({}) => {
  const { onDragItem } = useContext(RootCommandContexts);
  const {
    id,
    mode,
    height,
    width,
    onDragedMonacoIndex,
    setOnDragMonacoIndex,
    onDragOveredMonacoIndex,
    setOnDragOverMonacoIndex,
    onSelectedMonacoIndex,
    setOnSelectedMonacoIndex,
    onDragOverPosition,
    monacoPaths,
    setMonacoPaths,
    item_on_drag_over,
  } = useContext(MonacoEditorContexts);

  const containerRef = useRef(null);
  const [containerStyle, setContainerStyle] = useState({
    width: 0,
    transform: "rotate(0deg)",
    top: 6,
    left: 6,
    right: 6,
    height: 28,
  });
  const tagRefs = useRef(monacoPaths.map(() => React.createRef()));
  const [tags, setTags] = useState([]);
  const [tagPositions, setTagPositions] = useState([]);
  const [requiredRerender, setRequiredRerender] = useState(true);

  /* { render tags } ============================================================== */
  const render_tags = useCallback(() => {
    if (!tagRefs.current) return;
    if (!containerRef.current) return;

    let tags = [];
    let tag_positions = [];

    let position_x = 0;

    for (let i = 0; i < monacoPaths.length; i++) {
      let tagPosition = {};
      let tag_width = tagRefs.current[i]?.current?.offsetWidth;

      if (isNaN(tag_width)) {
        tag_width = tagPositions[monacoPaths[i]]?.width;
      }
      if (isNaN(tag_width)) {
        tag_width = default_tag_max_width;
      }

      if (i === onDragedMonacoIndex) {
        position_x += 0;
      } else if (i === onSelectedMonacoIndex) {
        position_x += default_selecion_list_icon_offset + 6;
      }
      tagPosition.x = position_x;
      if (i !== onDragedMonacoIndex) {
        position_x += tag_width + 0.5 * default_selecion_list_item_padding;
      }
      if (i === onDragOveredMonacoIndex) {
        position_x += default_tag_max_width;
      }
      tagPosition.width = tag_width;
      tagPosition.height = tagRefs.current[i]?.current?.offsetHeight;
      tags.push(
        <FileSelectionListItem
          key={monacoPaths[i]}
          index={i}
          containerListRef={containerRef}
          reference={tagRefs.current[i]}
          file_path={monacoPaths[i]}
          tag_position={tagPosition.x}
          tag_size={{ width: tagPosition.width, height: tagPosition.height }}
          setTagPositions={setTagPositions}
        />
      );
      tag_positions[monacoPaths[i]] = tagPosition;
    }
    setTagPositions(tag_positions);
    setTags(tags);
  }, [
    monacoPaths,
    tagRefs.current,
    containerRef.current,
    tagPositions,
    onSelectedMonacoIndex,
    onDragedMonacoIndex,
    onDragOveredMonacoIndex,
  ]);
  useEffect(() => {
    if (!requiredRerender) return;
    const intervalId = setInterval(() => {
      if (Object.keys(tagPositions).length === 0) {
        render_tags();
      } else {
        for (let i = 0; i < monacoPaths.length; i++) {
          if (isNaN(tagPositions[Object.keys(tagPositions)[0]].height)) {
            render_tags();
            return;
          }
        }
        clearInterval(intervalId);
        setRequiredRerender(false);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [tagPositions, requiredRerender]);
  useEffect(() => {
    render_tags();
  }, [
    width,
    tagRefs.current,
    containerRef.current,
    onSelectedMonacoIndex,
    onDragedMonacoIndex,
    onDragOveredMonacoIndex,
  ]);
  useEffect(() => {
    if (!tagRefs.current) return;
    tagRefs.current = tagRefs.current.slice(0, monacoPaths.length);
    for (let i = 0; i < monacoPaths.length; i++) {
      tagRefs.current[i] = React.createRef();
    }
  }, [monacoPaths]);
  /* { render tags } ============================================================== */

  /* { drag and drop } ============================================================ */
  const to_append_tag = useCallback(
    (onDragItem, onDropItem) => {
      if (!onDragItem || !onDropItem) return;
      let on_drop_index = monacoPaths.indexOf(onDropItem.content.path);
      if (onDropItem.content.append_to_left) {
        if (onDragedMonacoIndex !== -1 && onDragedMonacoIndex < on_drop_index) {
          on_drop_index -= 1;
        }
        setMonacoPaths((prevData) => {
          return [
            ...prevData.slice(0, on_drop_index),
            onDragItem.content.path,
            ...prevData.slice(on_drop_index),
          ];
        });
      } else {
        if (onDragedMonacoIndex !== -1 && onDragedMonacoIndex < on_drop_index) {
          on_drop_index -= 1;
        }
        on_drop_index += 1;
        setMonacoPaths((prevData) => {
          return [
            ...prevData.slice(0, on_drop_index),
            onDragItem.content.path,
            ...prevData.slice(on_drop_index),
          ];
        });
      }
      setRequiredRerender(true);
      setOnSelectedMonacoIndex(-1);
    },
    [onDragedMonacoIndex, onDragOverPosition, tagPositions, monacoPaths]
  );
  useEffect(() => {
    if (onDragItem) return;
    setOnDragMonacoIndex(-1);
    setOnDragOverMonacoIndex(-1);
  }, [onDragItem]);
  useEffect(() => {
    /* on drag index cannot be set to on drag overed index ------------------------ */
    if (onDragOveredMonacoIndex === onDragedMonacoIndex) {
      setOnDragOverMonacoIndex(-1);
      return;
    }
    if (onDragOveredMonacoIndex === -1) return;
    if (!tagPositions[monacoPaths[onDragOveredMonacoIndex]]) return;
    item_on_drag_over(null, {
      source: id,
      content: {
        type: "file",
        path: monacoPaths[onDragOveredMonacoIndex],
        append_to_left:
          onDragOverPosition.x <
          (tagPositions[monacoPaths[onDragOveredMonacoIndex]].width +
            default_tag_max_width) /
            2,
      },
      callback_to_append: to_append_tag,
    });
  }, [onDragOveredMonacoIndex, monacoPaths, onDragOverPosition, tagPositions]);
  /* { drag and drop } ============================================================ */

  useEffect(() => {
    if (mode.includes("vertical")) {
      setContainerStyle({
        width: height - 32,
        transform: "rotate(90deg)",
        top: 6 - 37,
        left: 4,
        right: undefined,
        height: 32,
      });
    } else {
      setContainerStyle({
        width: undefined,
        transform: "rotate(0deg)",
        top: 6,
        left: 6,
        right: 6,
        height: 28,
      });
    }
  }, [mode, height, width]);
  useEffect(() => {
    if (onSelectedMonacoIndex === -1) return;
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: tagPositions[onSelectedMonacoIndex] - 0.5 * default_tag_max_width,
        behavior: "smooth",
      });
    }
  }, [onSelectedMonacoIndex, containerRef.current]);

  return (
    <div
      ref={containerRef}
      style={{
        transition: "all 0.12s cubic-bezier(0.32, 1, 0.32, 1)",
        transform: containerStyle.transform,
        transformOrigin: "0 100%",
        position: "absolute",
        top: containerStyle.top,
        left: containerStyle.left,
        right: containerStyle.right,

        width: containerStyle.width,
        height: containerStyle.height,

        borderRadius: `${default_border_radius}px ${default_border_radius}px 0px 0px`,
        overflow: "hidden",
        padding: default_selecion_list_item_padding / 2,
        backgroundColor: `rgba( ${R}, ${G}, ${B}, 1 )`,
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOnDragOverMonacoIndex(-1);
      }}
    >
      {tags}
    </div>
  );
};
/* { File Selection List Sub Component } --------------------------------------------------------------------------------------- */

const MonacoEditor = ({
  id,
  width,
  height,
  mode,
  code_editor_container_ref_index,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
  item_on_drag,
  item_on_drag_over,
  item_on_drop,
}) => {
  //console.log("RDM/RCM/stack_frame/monaco_editor", new Date().getTime());
  /* { Monaco Editor Data } --------------------------------------------------------------------------------------- */
  const [onSelectedMonacoIndex, setOnSelectedMonacoIndex] = useState(
    data?.on_selected_monaco_core_index
  );
  const [onDragedMonacoIndex, setOnDragMonacoIndex] = useState(-1);
  const [onDragOveredMonacoIndex, setOnDragOverMonacoIndex] = useState(-1);
  const [onDragOverPosition, setOnDragOverPosition] = useState({ x: 0, y: 0 });

  const [monacoPaths, setMonacoPaths] = useState(data?.monaco_paths);
  const [monacoCores, setMonacoCores] = useState(data?.monaco_cores);
  const [monacoCallbacks, setMonacoCallbacks] = useState({});

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
    const timeoutId = setTimeout(() => {
      setData((prevData) => {
        if (prevData.monaco_cores === monacoCores) return prevData;
        return {
          ...prevData,
          monaco_cores: monacoCores,
        };
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [monacoCores]);
  /* { Monaco Editor Data } --------------------------------------------------------------------------------------- */

  const [onSelectedCotent, setOnSelectedCotent] = useState(null);
  const [onAppendContent, setOnAppendContent] = useState(null);

  return (
    <MonacoEditorContexts.Provider
      value={{
        id,
        width,
        height,
        mode,
        command,
        setCommand,
        load_contextMenu,
        onSelectedMonacoIndex,
        setOnSelectedMonacoIndex,
        onDragedMonacoIndex,
        setOnDragMonacoIndex,
        onDragOveredMonacoIndex,
        setOnDragOverMonacoIndex,
        onDragOverPosition,
        setOnDragOverPosition,
        monacoPaths,
        setMonacoPaths,
        monacoCores,
        setMonacoCores,
        access_monaco_core_by_path,
        update_monaco_core_view_state,
        update_monaco_core_model,
        onSelectedCotent,
        setOnSelectedCotent,
        onAppendContent,
        setOnAppendContent,
        item_on_drag,
        item_on_drag_over,
        item_on_drop,
        monacoCallbacks,
        setMonacoCallbacks,
      }}
    >
      <MonacoEditorContextMenuWrapper>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
        ></link>
        <div style={{ height: "100%" }}>
          <div
            style={{
              transition: "all 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
              position: "absolute",
              top: 38,
              left: 6,
              right: 6,
              bottom: 6,
              padding: "0px 8px 8px 0px",

              boxSizing: "border-box",
              backgroundColor: "#202020",
              borderRadius: "0px 0px 5px 5px",
              border: "1px solid #282828",
              // boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.32)",
              opacity: mode === "horizontal_stack_horizontal_mode" ? 1 : 0,
            }}
          >
            <MonacoEditorGroup
              code_editor_container_ref_index={code_editor_container_ref_index}
              setOnSelectedContent={setOnSelectedCotent}
              onAppendContent={onAppendContent}
              setOnAppendContent={setOnAppendContent}
              //HORIZONTAL OR VERTICAL MODE
              mode={mode}
              setMonacoCallbacks={setMonacoCallbacks}
            />
          </div>
          <FileSelectionListContainer />
        </div>
      </MonacoEditorContextMenuWrapper>
    </MonacoEditorContexts.Provider>
  );
};

export default MonacoEditor;
