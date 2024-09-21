import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import { throttle } from "lodash";
/* Context ------------------------------------------------------------------------------------------------------------------------ */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { SurfaceExplorerContexts } from "./surface_explorer_contexts.js";
import { SurfaceExplorerContextMenuContexts } from "./surface_explorer_context_menu_contexts.js";
import { globalDragAndDropContexts } from "../../CONTEXTs/globalDragAndDropContexts.js";
/* Sub Components ----------------------------------------------------------------------------------------------------------------- */
import Tag from "../../BUILTIN_COMPONENTs/tag/tag";
import BarLoader from "react-spinners/BarLoader";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import { ICON_MANAGER } from "../../ICONs/icon_manager";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
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
const GHOST_IMAGE = ICON_MANAGER().GHOST_IMAGE;
/* { ICONs } ------------------------------------------------------------------------------------------------- */

const padding = { top: 43, right: 6, bottom: 6, left: 6 };
const default_explorer_item_height = 22;
const default_x_axis_offset = 10;
const default_font_size = 12;
const default_indicator_padding = 4;
const default_border_width = 1;
const default_scrollbar_width = 10;
const default_indicator_layer = 12;

/* { Explorer Search Bar } ------------------------------------------------------------------------------------------------------------------------------------------- */
const ExplorerSearchBar = ({ filterKeyWord, setFilterKeyWord }) => {
  const hoverTimeout = useRef(null);
  const [onHover, setOnHover] = useState(false);
  const [onFocus, setOnFocus] = useState(false);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.16)",
    width: 24,
  });
  const [searchingKeyword, setSearchingKeyword] = useState("");
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: `transparent`,
    boxShadow: "none",
  });
  const [searchButtonOnHover, setSearchButtonOnHover] = useState(false);
  const [searchButtonOnClicked, setSearchButtonOnClicked] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (onHover || onFocus) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 16
        }, ${surface_explorer_fixed_styling.backgroundColorG + 16}, ${
          surface_explorer_fixed_styling.backgroundColorB + 16
        }, 1)`,
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.32)",
        width: "calc(100% - " + (padding.left + padding.right) + "px)",
        opacity: 0.64,
      });
      setButtonStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.32)",
      });
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
        boxShadow: "none",
        width: 38,
        opacity: 0.32,
      });
      setButtonStyle({
        backgroundColor: `transparent`,
        boxShadow: "none",
      });
    }
    if (onFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [onHover, onFocus]);
  useEffect(() => {
    if ((onHover || onFocus) && searchButtonOnClicked) {
      setButtonStyle((prev) => {
        return {
          ...prev,
          backgroundColor: `rgba( ${
            surface_explorer_fixed_styling.backgroundColorR + 64
          }, ${surface_explorer_fixed_styling.backgroundColorG + 64}, ${
            surface_explorer_fixed_styling.backgroundColorB + 64
          }, 1)`,
        };
      });
    } else if ((onHover || onFocus) && searchButtonOnHover) {
      setButtonStyle((prev) => {
        return {
          ...prev,
          backgroundColor: `rgba( ${
            surface_explorer_fixed_styling.backgroundColorR + 48
          }, ${surface_explorer_fixed_styling.backgroundColorG + 48}, ${
            surface_explorer_fixed_styling.backgroundColorB + 48
          }, 1)`,
        };
      });
    } else if (onHover || onFocus) {
      setButtonStyle((prev) => {
        return {
          ...prev,
          backgroundColor: `rgba( ${
            surface_explorer_fixed_styling.backgroundColorR + 32
          }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
            surface_explorer_fixed_styling.backgroundColorB + 32
          }, 1)`,
        };
      });
    } else {
      setButtonStyle({
        backgroundColor: `transparent`,
        boxShadow: "none",
      });
    }
  }, [searchButtonOnHover, searchButtonOnClicked, onHover, onFocus]);
  const handle_on_search_submit = useCallback(() => {
    setFilterKeyWord(searchingKeyword);
  }, [searchingKeyword]);

  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
        position: "absolute",
        right: padding.right,
        top: padding.bottom,
        /* Size ======================== */
        width: style.width,
        height: 32,
        /* Style ======================= */

        backgroundColor: style.backgroundColor,
        borderRadius: 5,
        boxShadow: style.boxShadow,

        overflow: "hidden",
      }}
      draggable={true}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseEnter={() => {
        hoverTimeout.current = setTimeout(() => {
          setOnHover(true);
        }, 300);
      }}
      onMouseLeave={() => {
        clearTimeout(hoverTimeout.current);
        if (hoverTimeout.current) {
          setOnHover(false);
        }
        hoverTimeout.current = null;
      }}
      onMouseUp={() => {
        setOnFocus(true);
      }}
    >
      <Icon
        src={"search"}
        style={{
          position: "absolute",
          top: "50%",
          right: 4,
          transform: "translateY(-50%)",

          width: 16,
          height: 16,

          padding: 4,

          opacity: style.opacity,

          borderRadius: 3,
          backgroundColor: buttonStyle.backgroundColor,
          boxShadow: buttonStyle.boxShadow,
        }}
        onMouseEnter={(e) => {
          setSearchButtonOnHover(true);
        }}
        onMouseLeave={(e) => {
          setSearchButtonOnHover(false);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSearchButtonOnClicked(true);
        }}
        onMouseUp={(e) => {
          setSearchButtonOnClicked(false);
          handle_on_search_submit();
        }}
      />
      <input
        ref={inputRef}
        style={{
          position: "absolute",
          top: "50%",
          left: 4,
          right: 32,
          transform: "translateY(-50%)",
          height: default_font_size,
          backgroundColor: "transparent",
          border: "none",
          color: "#FFFFFF",
          font: "inherit",
          fontSize: default_font_size,
          outline: "none",
          opacity: style.opacity,
        }}
        onFocus={() => {
          setOnFocus(true);
        }}
        onBlur={() => {
          setOnFocus(false);
        }}
        value={searchingKeyword}
        onChange={(e) => {
          setSearchingKeyword(e.target.value);
        }}
      />
    </div>
  );
};
/* { Explorer Search Bar } ------------------------------------------------------------------------------------------------------------------------------------------- */

/* { Explorer Loading Sub Components } =============================================================================================================================== */
const ExplorerLoadingIndicator = ({ width }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: padding.bottom,
        left: padding.left,
        right: padding.right,

        /* Size ======================== */
        borderRadius: 10,
        border: ` 3px solid rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 12
        }, ${surface_explorer_fixed_styling.backgroundColorG + 12}, ${
          surface_explorer_fixed_styling.backgroundColorB + 12
        }, 1)`,
        overflow: "hidden",
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 12
        }, ${surface_explorer_fixed_styling.backgroundColorG + 12}, ${
          surface_explorer_fixed_styling.backgroundColorB + 12
        }, 1)`,
      }}
    >
      <BarLoader
        size={8}
        color={`rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 64
        }, ${surface_explorer_fixed_styling.backgroundColorG + 64}, ${
          surface_explorer_fixed_styling.backgroundColorB + 64
        }, 1)`}
        height={3}
        width={width}
        speed={1}
      />
    </div>
  );
};
/* { Explorer Loading Sub Components } =============================================================================================================================== */

/* { Explorer List Sub Components } ================================================================================================================================== */
const ExplorerLevelIndicatorFilter = ({
  position_y,
  position_x,
  height: indicator_height,
}) => {
  const { height, explorerScrollPosition } = useContext(
    SurfaceExplorerContexts
  );
  if (
    position_y + indicator_height < explorerScrollPosition ||
    position_y > explorerScrollPosition + height
  ) {
    return null;
  } else {
    return (
      <ExplorerLevelIndicatorComponent
        position_y={position_y}
        position_x={position_x}
        height={indicator_height}
      />
    );
  }
};
const ExplorerLevelIndicatorComponent = ({
  position_y,
  position_x,
  height,
}) => {
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
          surface_explorer_fixed_styling.backgroundColorR + 16
        }, ${surface_explorer_fixed_styling.backgroundColorG + 16}, ${
          surface_explorer_fixed_styling.backgroundColorB + 16
        }, 1)`,
      }}
    ></div>
  );
};
const ExplorerOnSelectedIndicator = ({ file_path, position_y, position_x }) => {
  const { onHoverExplorerItem } = useContext(SurfaceExplorerContexts);
  const { explorerScrollPosition } = useContext(SurfaceExplorerContexts);
  const on_select_wrapper_border = default_border_width;

  return (
    <div
      style={{
        position: "absolute",
        top: position_y - on_select_wrapper_border,
        left: position_x - on_select_wrapper_border,
        zIndex: default_indicator_layer,
        /* Size ======================== */
        width:
          "calc(100% - " +
          (position_x +
            on_select_wrapper_border * 2 +
            default_indicator_padding) +
          "px)",
        height: default_explorer_item_height + on_select_wrapper_border * 2,

        /* Style ======================= */
        borderRadius: 4,
        border:
          onHoverExplorerItem === file_path
            ? "none"
            : `${on_select_wrapper_border}px solid rgba( ${
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
        transition: "all 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
        position: "absolute",
        top: position_y - default_indicator_padding,

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
const ExplorerEndingIndicator = ({ position_y, position_x }) => {
  const { setOnHoverExplorerItem } = useContext(SurfaceExplorerContexts);
  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y,
        left: position_x,
        zIndex: default_indicator_layer,

        /* Size ======================== */
        width:
          "calc(100% - " + (position_x + 2 + default_indicator_padding) + "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
      }}
      onMouseEnter={() => {
        setOnHoverExplorerItem(null);
      }}
    ></div>
  );
};
const ExplorerItemFolderFilter = ({ file_path, position_y, position_x }) => {
  // const {
  //   update_dir_expand_status_by_path,
  //   access_dir_expand_status_by_path,
  //   access_dir_name_by_path,
  // } = useContext(RootDataContexts);
  // return (
  //   <span
  //     style={{
  //       position: "absolute",
  //       top: position_y,
  //       left: position_x,
  //       color: '#CCCCCC',
  //       fontSize: 12,
  //     }}
  //     onClick={() => {
  //       update_dir_expand_status_by_path(
  //         file_path,
  //         !access_dir_expand_status_by_path(file_path)
  //       );
  //     }}
  //   >
  //     {access_dir_name_by_path(file_path)}
  //   </span>
  // );
  return (
    <ExplorerItemFolderComponent
      file_path={file_path}
      position_y={position_y}
      position_x={position_x}
    />
  );
};
const ExplorerItemFolderComponent = ({ file_path, position_y, position_x }) => {
  const {
    dir,
    access_dir_name_by_path,
    access_dir_expand_status_by_path,
    update_dir_expand_status_by_path,
    rename_file_by_path,
    check_if_file_name_duplicate,
  } = useContext(RootDataContexts);
  const {
    id,
    width,
    command,
    command_executed,
    item_on_drag,
    item_on_drop,
    explorerListWidth,
    explorerListTop,
    explorerScrollPosition,
    setOnSelectedExplorerItems,
    setOnHoverExplorerItem,
    setFirstVisibleItem,
    scrollbarVisible,
  } = useContext(SurfaceExplorerContexts);
  const { onConextMenuPath, setOnConextMenuPath } = useContext(
    SurfaceExplorerContextMenuContexts
  );
  const { load_explorer_context_menu } = useContext(
    SurfaceExplorerContextMenuContexts
  );

  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
    maxWidth:
      explorerListWidth -
      position_x -
      2 * default_indicator_padding -
      2 * default_border_width,
  });

  const [isExpanded, setIsExpanded] = useState(
    access_dir_expand_status_by_path(file_path)
  );
  useEffect(() => {
    setIsExpanded(access_dir_expand_status_by_path(file_path));
  }, [dir]);
  const [fullSizeMode, setFullSizeMode] = useState(false);
  const [onPause, setOnPause] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const hoverTimeout = useRef(null);

  const [renameValue, setRenameValue] = useState(
    access_dir_name_by_path(file_path)
  );
  const [onRenameMode, setOnRenameMode] = useState(false);
  const handle_rename_on_sumbit = (change_or_not) => {
    if (change_or_not) {
      if (access_dir_name_by_path(onConextMenuPath) !== renameValue) {
        let parent_path = onConextMenuPath.split("/").slice(0, -1);
        if (parent_path.length === 1) {
          parent_path = "root";
        } else {
          parent_path = parent_path.join("/");
        }
        if (check_if_file_name_duplicate(parent_path, renameValue)) {
          alert("Duplicate Name Detected");
        } else {
          rename_file_by_path(onConextMenuPath, renameValue);
        }
      }
    } else {
      setRenameValue(access_dir_name_by_path(onConextMenuPath));
    }
    command_executed();
    setOnConextMenuPath(null);
  };
  useEffect(() => {
    setOnRenameMode(
      command.content?.command_title === "rename" &&
        file_path === onConextMenuPath
        ? true
        : false
    );
  }, [command, onConextMenuPath]);

  useEffect(() => {
    if (onRenameMode) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 16
        }, ${surface_explorer_fixed_styling.backgroundColorG + 16}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
    } else if (onHover) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
      setOnHoverExplorerItem(file_path);
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
    }
  }, [onHover, onRenameMode, width, scrollbarVisible, explorerListWidth]);
  useEffect(() => {
    if (tagRef.current) {
      if (
        tagRef.current.offsetWidth >
        explorerListWidth -
          position_x -
          2 * default_indicator_padding -
          2 * default_border_width -
          12
      ) {
        setFullSizeMode(onPause);
      } else {
        setFullSizeMode(false);
      }
    }
  }, [explorerListWidth, onPause]);

  return (
    <div
      draggable={!onRenameMode}
      style={{
        transition:
          "top 0.24s cubic-bezier(0.32, 0.96, 0.32, 1), left 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08), box-shadow 0.08s",
        position: "absolute",
        top: position_y,
        left: position_x,
        /* Size ======================== */
        width:
          "calc(100% - " +
          (position_x + 2 * default_border_width + default_indicator_padding) +
          "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
        borderRadius: 4,
        backgroundColor: style.backgroundColor,
        boxShadow: onPause
          ? "0px 4px 16px rgba(0, 0, 0, 0.32)"
          : "0px 4px 16px rgba(0, 0, 0, 0)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
        hoverTimeout.current = setTimeout(() => {
          setOnPause(true);
        }, 200);
      }}
      onMouseLeave={() => {
        setOnHover(false);
        clearTimeout(hoverTimeout.current);
        if (hoverTimeout.current) {
          setOnPause(false);
        }
        hoverTimeout.current = null;
      }}
      onMouseDown={() => {}}
      onMouseUp={(e) => {
        e.stopPropagation();
        if (e.button === 0 && !onRenameMode) {
          update_dir_expand_status_by_path(
            file_path,
            !access_dir_expand_status_by_path(file_path)
          );
        }
        setOnSelectedExplorerItems([file_path]);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (file_path === "root") {
          load_explorer_context_menu(e, "root", file_path);
          setOnSelectedExplorerItems(["root"]);
        } else {
          load_explorer_context_menu(e, "folder", file_path);
          setOnSelectedExplorerItems([file_path]);
        }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
        item_on_drag(e, {
          source: id,
          ghost_image: "tag",
          content: {
            type: "folder",
            path: file_path,
          },
        });
      }}
      onDragEnd={(e) => {
        item_on_drop(e);
      }}
    >
      <Tag
        config={{
          reference: tagRef,
          type: "folder",
          label: renameValue,
          label_on_change: (value) => {
            setRenameValue(value);
          },
          label_on_submit: handle_rename_on_sumbit,
          style: {
            top: fullSizeMode
              ? position_y + explorerListTop - explorerScrollPosition
              : 0,
            borderRadius: 4,
            padding_x: 3,
            padding_y: 2,
            fontSize: default_font_size,
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
            isExpanded: isExpanded,
            maxWidth: style.maxWidth,
            fullSizeMode: fullSizeMode,
            transparentMode: true,
            inputMode: onRenameMode,
          },
        }}
      />
    </div>
  );
};
const ExplorerItemFileFilter = ({ file_path, position_y, position_x }) => {
  // const { access_dir_name_by_path } = useContext(RootDataContexts);
  // return (
  //   <span
  //     style={{
  //       position: "absolute",
  //       top: position_y,
  //       left: position_x,
  //       color: '#CCCCCC',
  //       fontSize: 12,
  //     }}
  //   >
  //     {access_dir_name_by_path(file_path)}
  //   </span>
  // );
  return (
    <ExplorerItemFileComponent
      file_path={file_path}
      position_y={position_y}
      position_x={position_x}
    />
  );
};
const ExplorerItemFileComponent = ({ file_path, position_y, position_x }) => {
  const {
    draggedItem,
    setDraggedItem,
    draggedOverItem,
    setDraggedOverItem,
    dragCommand,
    setDragCommand,
  } = useContext(globalDragAndDropContexts);
  const {
    access_dir_name_by_path,
    rename_file_by_path,
    check_if_file_name_duplicate,
  } = useContext(RootDataContexts);
  const {
    width,
    id,
    command,
    setCommand,
    command_executed,
    item_on_drag,
    item_on_drop,
    explorerListWidth,
    explorerListTop,
    explorerScrollPosition,
    setOnSelectedExplorerItems,
    setOnHoverExplorerItem,
    setFirstVisibleItem,
    scrollbarVisible,
  } = useContext(SurfaceExplorerContexts);

  const { onConextMenuPath, setOnConextMenuPath } = useContext(
    SurfaceExplorerContextMenuContexts
  );
  const { load_explorer_context_menu } = useContext(
    SurfaceExplorerContextMenuContexts
  );
  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
    maxWidth:
      explorerListWidth -
      position_x -
      2 * default_indicator_padding -
      2 * default_border_width,
  });
  const [fullSizeMode, setFullSizeMode] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [onPause, setOnPause] = useState(false);
  const hoverTimeout = useRef(null);

  const [renameValue, setRenameValue] = useState(
    access_dir_name_by_path(file_path)
  );
  const [onRenameMode, setOnRenameMode] = useState(false);
  const handle_rename_on_sumbit = (change_or_not) => {
    if (change_or_not) {
      if (access_dir_name_by_path(onConextMenuPath) !== renameValue) {
        let parent_path = onConextMenuPath.split("/").slice(0, -1);
        if (parent_path.length === 1) {
          parent_path = "root";
        } else {
          parent_path = parent_path.join("/");
        }
        if (check_if_file_name_duplicate(parent_path, renameValue)) {
          alert("Duplicate Name Detected");
        } else {
          rename_file_by_path(onConextMenuPath, renameValue);
        }
      }
    } else {
      setRenameValue(access_dir_name_by_path(onConextMenuPath));
    }
    command_executed();
    setOnConextMenuPath(null);
  };
  useEffect(() => {
    setOnRenameMode(
      command.content?.command_title === "rename" &&
        file_path === onConextMenuPath
        ? true
        : false
    );
  }, [command, onConextMenuPath]);

  useEffect(() => {
    if (onRenameMode) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 16
        }, ${surface_explorer_fixed_styling.backgroundColorG + 16}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
    } else if (onHover) {
      setStyle({
        backgroundColor: `rgba( ${
          surface_explorer_fixed_styling.backgroundColorR + 32
        }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
          surface_explorer_fixed_styling.backgroundColorB + 32
        }, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
      setOnHoverExplorerItem(file_path);
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 1)`,
        maxWidth: scrollbarVisible
          ? explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width -
            default_scrollbar_width
          : explorerListWidth -
            position_x -
            2 * default_indicator_padding -
            2 * default_border_width,
      });
    }
  }, [onHover, onRenameMode, width, scrollbarVisible, explorerListWidth]);
  useEffect(() => {
    if (tagRef.current) {
      if (
        tagRef.current.offsetWidth >
        explorerListWidth -
          position_x -
          2 * default_indicator_padding -
          2 * default_border_width -
          12
      ) {
        setFullSizeMode(onPause);
      } else {
        setFullSizeMode(false);
      }
    }
  }, [explorerListWidth, onPause]);

  return (
    <div
      draggable={!onRenameMode}
      style={{
        transition:
          "top 0.24s cubic-bezier(0.32, 0.96, 0.32, 1), left 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08), box-shadow 0.08s",
        position: "absolute",
        top: position_y,
        left: position_x,
        /* Size ======================== */
        width:
          "calc(100% - " +
          (position_x + 2 * default_border_width + default_indicator_padding) +
          "px)",
        height: default_explorer_item_height,

        /* Style ======================= */
        borderRadius: 4,
        backgroundColor: style.backgroundColor,
        boxShadow: onPause
          ? "0px 4px 16px rgba(0, 0, 0, 0.32)"
          : "0px 4px 16px rgba(0, 0, 0, 0)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
        hoverTimeout.current = setTimeout(() => {
          setOnPause(true);
        }, 200);
      }}
      onMouseLeave={() => {
        setOnHover(false);
        clearTimeout(hoverTimeout.current);
        if (hoverTimeout.current) {
          setOnPause(false);
        }
        hoverTimeout.current = null;
      }}
      onMouseDown={() => {}}
      onMouseUp={(e) => {
        e.stopPropagation();
        setOnSelectedExplorerItems([file_path]);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        load_explorer_context_menu(e, "file", file_path);
        setOnSelectedExplorerItems([file_path]);
      }}
      onDragStart={(e) => {
        e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);
        setDraggedItem({
          source: "vecoder_explorer",
          content: file_path,
        });
        item_on_drag(e, {
          source: id,
          ghost_image: "tag",
          content: {
            type: "file",
            path: file_path,
          },
        });
      }}
      onDragEnd={(e) => {
        if (draggedOverItem) {
          setDragCommand("APPEND TO TARGET");
        } else {
          setDraggedItem(null);
          setDraggedOverItem(null);
        }
        item_on_drop(e);
      }}
    >
      <Tag
        config={{
          reference: tagRef,
          type: "file",
          label: renameValue,
          label_on_change: (value) => {
            setRenameValue(value);
          },
          label_on_submit: handle_rename_on_sumbit,
          style: {
            top: fullSizeMode
              ? position_y + explorerListTop - explorerScrollPosition
              : 0,
            borderRadius: 4,
            padding_x: 3,
            padding_y: 2,
            fontSize: default_font_size,
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
            maxWidth: style.maxWidth,
            fullSizeMode: fullSizeMode,
            transparentMode: true,
            inputMode: onRenameMode,
          },
        }}
      />
    </div>
  );
};

const ExplorerList = ({ filteredDir }) => {
  const { access_dir_type_by_path, access_dir_expand_status_by_path } =
    useContext(RootDataContexts);
  const {
    width,
    height,
    explorerListRef,
    explorerScrollPosition,
    scrollbarVisible,
    setScrollbarVisible,
    onSelectedExplorerItems,
    setOnSelectedExplorerItems,
    onHoverExplorerItem,
    setOnHoverExplorerItem,
    access_filtered_dir_sub_items_by_path,
  } = useContext(SurfaceExplorerContexts);
  const { load_explorer_context_menu } = useContext(
    SurfaceExplorerContextMenuContexts
  );
  const [explorerList, setExplorerList] = useState([]);
  const [explorerItemPositions, setExplorerItemPositions] = useState([]);
  const [visibleIndexRange, setVisibleIndexRange] = useState({
    startIndex: -1,
    endIndex: -1,
  });

  const [levelIndicators, setLevelIndicators] = useState([]);
  const [onSelectedIndicators, setOnSelectedIndicators] = useState([]);
  const [ParentIndicator, setParentIndicator] = useState(null);

  const style = document.createElement("style");
  style.innerHTML = `
  .scrollable-element::-webkit-scrollbar {
    width: 10px;
  }
  .scrollable-element::-webkit-scrollbar-track {
    background: rgba( ${
      surface_explorer_fixed_styling.backgroundColorR + 12
    }, ${surface_explorer_fixed_styling.backgroundColorG + 12}, ${
    surface_explorer_fixed_styling.backgroundColorB + 12
  }, 1);
    border-radius: 10px;
  }
  .scrollable-element::-webkit-scrollbar-thumb {
    background-color:rgba( ${
      surface_explorer_fixed_styling.backgroundColorR + 64
    }, ${surface_explorer_fixed_styling.backgroundColorG + 64}, ${
    surface_explorer_fixed_styling.backgroundColorB + 64
  }, 1);
    border-radius: 10px;
    border: 3px solid rgba( ${
      surface_explorer_fixed_styling.backgroundColorR + 12
    }, ${surface_explorer_fixed_styling.backgroundColorG + 12}, ${
    surface_explorer_fixed_styling.backgroundColorB + 12
  }, 1);
  }
`;
  document.head.appendChild(style);

  useEffect(() => {
    const update_explorer_list = async () => {
      if (!filteredDir) return;
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
      const sub_items = access_filtered_dir_sub_items_by_path(path);
      let explorer_structure = [];
      let explorer_structure_positions = [];
      let next_position_y = position_y;
      let next_position_x = position_x;

      explorer_structure.push(
        <ExplorerItemFolderFilter
          key={path}
          file_path={path}
          position_y={next_position_y}
          position_x={position_x}
        />
      );

      next_position_y += default_explorer_item_height;
      next_position_x += default_x_axis_offset;

      let sub_explorer_structure_positions = [];

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
            const sub_sub_explorer_structure_positions =
              updated_structure.explorer_structure_positions;
            explorer_structure = explorer_structure.concat(
              sub_explorer_structure
            );
            sub_explorer_structure_positions =
              sub_explorer_structure_positions.concat(
                sub_sub_explorer_structure_positions
              );
            next_position_y +=
              default_explorer_item_height * sub_explorer_structure.length;
          } else {
            explorer_structure.push(
              <ExplorerItemFileFilter
                key={sub_items[index]}
                file_path={sub_items[index]}
                position_y={next_position_y}
                position_x={next_position_x}
              />
            );
            sub_explorer_structure_positions.push({
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
      explorer_structure_positions = explorer_structure_positions.concat(
        sub_explorer_structure_positions
      );

      if (path === "root") {
        explorer_structure.push(
          <ExplorerEndingIndicator
            key={"explorer_endingIndicator"}
            position_y={next_position_y}
            position_x={position_x}
          />
        );
      }
      return {
        explorer_structure: explorer_structure,
        explorer_structure_positions: explorer_structure_positions,
      };
    };
    update_explorer_list();
  }, [filteredDir]);
  useEffect(() => {
    const update_on_selected_indicator = () => {
      const new_on_selected_indicator = [];
      if (!onSelectedExplorerItems || !explorerItemPositions || !explorerList)
        return;
      onSelectedExplorerItems.forEach((item) => {
        const position = explorerItemPositions.find(
          (element) => element.file_path === item
        );
        if (!position) return;
        new_on_selected_indicator.push(
          <ExplorerOnSelectedIndicator
            key={item}
            file_path={position.file_path}
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
      if (!explorerItemPositions || !explorerList) return;
      explorerItemPositions.forEach((item) => {
        if (!item) return;
        if (access_dir_type_by_path(item.file_path) === "folder") {
          const position = item;
          new_level_indicators.push(
            <ExplorerLevelIndicatorFilter
              key={position.file_path}
              file_path={position.file_path}
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
    const calculate_visible_index_range = () => {
      if (!explorerItemPositions || !explorerList) return;
      const startIndex = Math.max(
        parseInt(explorerScrollPosition / default_explorer_item_height) -
          parseInt(height / default_explorer_item_height / 2),
        0
      );
      const endIndex =
        2 * parseInt(height / default_explorer_item_height) + startIndex;

      setVisibleIndexRange({
        startIndex: startIndex,
        endIndex: endIndex,
      });
    };
    calculate_visible_index_range();
  }, [explorerScrollPosition]);
  useEffect(() => {
    const update_parent_indicator = () => {
      if (
        !onSelectedExplorerItems ||
        !onHoverExplorerItem ||
        !explorerItemPositions ||
        !explorerList
      ) {
        setParentIndicator(null);
        return;
      }
      let path = onHoverExplorerItem.split("/");
      if (access_dir_type_by_path(onHoverExplorerItem) === "file") {
        path.pop();
        if (path.length === 1) {
          path = ["root"];
        }
        const position = explorerItemPositions.find(
          (element) => element.file_path === path.join("/")
        );
        if (!position) return;
        setParentIndicator(
          <ExplorerParentIndicator
            position_y={position.position_y}
            position_x={position.position_x}
            height={position.height}
          />
        );
      } else {
        const position = explorerItemPositions.find(
          (element) => element.file_path === onHoverExplorerItem
        );
        if (!position) return;
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
  }, [explorerItemPositions, onHoverExplorerItem]);
  useEffect(() => {
    if (explorerList.length * default_explorer_item_height > height) {
      setScrollbarVisible(true);
    } else {
      setScrollbarVisible(false);
    }
  }, [explorerList, height]);

  useEffect(() => {
    console.log(explorerItemPositions);
  }, [explorerItemPositions]);

  return (
    <div
      className="scrollable-element"
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
        setOnHoverExplorerItem(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        load_explorer_context_menu(e, "explorer", "root");
      }}
      style={{
        /* Position ===================== */
        position: "absolute",
        top: padding.top,
        right: padding.right,
        bottom: padding.bottom,
        left: padding.left,

        /* Size ======================== */
        height: "calc(100% - " + (padding.top + padding.bottom) + "px",

        /* Style ======================= */
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {explorerList
        .slice(visibleIndexRange.startIndex, visibleIndexRange.endIndex)
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
/* { Explorer List Sub Components } ================================================================================================================================== */

const ContextMenuWrapper = ({ children }) => {
  const {
    isDirLoaded,
    read_dir_from_system,
    delete_file_by_path,
    check_if_file_name_duplicate,
    generate_on_copy_file,
    paste_on_copy_dir,
    create_file_by_path,
    update_dir_expand_status_by_path,
  } = useContext(RootDataContexts);
  const { id, command, setCommand, load_contextMenu, command_executed } =
    useContext(SurfaceExplorerContexts);
  const [onConextMenuPath, setOnConextMenuPath] = useState(null);
  const [onCopyFile, setOnCopyFile] = useState(null);
  const tagRef = useRef(null);
  const [clickablePaste, setClickablePaste] = useState({
    type: "button",
    id: "paste",
    clickable: true,
    label: "paste",
    short_cut_label: "Ctrl+V",
    icon: "paste",
  });
  useEffect(() => {
    if (onCopyFile) {
      const root_file_path = onCopyFile.root.file_path;
      const target_file_name = onCopyFile[root_file_path].file_name;
      setClickablePaste({
        type: "button",
        id: "paste",
        clickable: true,
        label: "paste",
        customized_tag: {
          reference: tagRef,
          type: "file",
          label: target_file_name,
          style: {
            fontSize: default_font_size - 1,
            right: 5,
            top: 0,
            borderRadius: 4,
            padding_x: 2,
            padding_y: 2,
            border: `1px solid rgba(${
              surface_explorer_fixed_styling.backgroundColorR + 32
            }, ${surface_explorer_fixed_styling.backgroundColorG + 32}, ${
              surface_explorer_fixed_styling.backgroundColorB + 32
            }, 0.96)`,
            backgroundColor: `rgba(${
              surface_explorer_fixed_styling.backgroundColorR + 16
            }, ${surface_explorer_fixed_styling.backgroundColorG + 16}, ${
              surface_explorer_fixed_styling.backgroundColorB + 16
            }, 0.64)`,
            boxShadow: "none",
            noWidthLimitMode: true,
          },
        },
        icon: "paste",
      });
    } else {
      setClickablePaste({
        type: "button",
        id: "paste",
        clickable: false,
        label: "paste",
        short_cut_label: "Ctrl+V",
        icon: SYSTEM_ICON_MANAGER.paste.ICON512,
        quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
      });
    }
  }, [onCopyFile]);
  useEffect(() => {
    if (isDirLoaded) {
      setOnConextMenuPath(null);
      command_executed();
    }
  }, [isDirLoaded]);

  /* { context menu command handler } ----------------------------------------------------------------------------------- */
  const handle_context_menu_command = async () => {
    if (command && command.source === "context_menu") {
      const command_title = command.content.command_title;
      switch (command_title) {
        case "copy": {
          setOnCopyFile(generate_on_copy_file(onConextMenuPath));
          setOnConextMenuPath(null);
          command_executed();
          break;
        }
        case "paste": {
          if (onCopyFile === null) return;
          const file_name = Object.keys(onCopyFile)[0].split("/")[1];
          if (!check_if_file_name_duplicate(onConextMenuPath, file_name)) {
            paste_on_copy_dir(onCopyFile, onConextMenuPath);
            update_dir_expand_status_by_path(onConextMenuPath, true);
          } else {
            alert("File name already exist");
          }
          setOnConextMenuPath(null);
          command_executed();
          break;
        }
        case "newFile": {
          const generate_new_file_name = (path) => {
            let index = 1;
            let new_file_name = "new_file";
            while (check_if_file_name_duplicate(path, new_file_name)) {
              new_file_name = "new_file_" + index;
              index++;
            }
            return new_file_name;
          };
          const new_file_name = generate_new_file_name(onConextMenuPath);
          const new_file_path = onConextMenuPath + "/" + new_file_name;
          create_file_by_path(onConextMenuPath, new_file_name, "file");
          setOnConextMenuPath(new_file_path);
          setCommand({
            source: "context_menu",
            target: id,
            content: { command_title: "rename", command_content: {} },
          });
          break;
        }
        case "newFolder": {
          const generate_new_file_name = (path) => {
            let index = 1;
            let new_file_name = "new_folder";
            while (check_if_file_name_duplicate(path, new_file_name)) {
              new_file_name = "new_folder_" + index;
              index++;
            }
            return new_file_name;
          };
          const new_file_name = generate_new_file_name(onConextMenuPath);
          const new_file_path = onConextMenuPath + "/" + new_file_name;
          create_file_by_path(onConextMenuPath, new_file_name, "folder");
          setOnConextMenuPath(new_file_path);
          setCommand({
            source: "context_menu",
            target: id,
            content: { command_title: "rename", command_content: {} },
          });
          break;
        }
        case "rename": {
          break;
        }
        case "delete": {
          delete_file_by_path(onConextMenuPath);
          setOnConextMenuPath(null);
          command_executed();
          break;
        }
        case "openFolder": {
          read_dir_from_system();
          break;
        }
      }
    }
  };
  /* { context menu command handler } ----------------------------------------------------------------------------------- */

  /* { context menu render } ============================================================================================ */
  const render_context_menu = async (source_editor_component) => {
    const default_explorer_context_menu = {
      root: {
        type: "root",
        sub_items: ["openFolder", "openFile"],
      },
      openFolder: {
        type: "button",
        id: "openFolder",
        clickable: true,
        label: "open folder...",
        icon: "open_folder",
        quick_view_background: SYSTEM_ICON_MANAGER.uploadFolder.ICON16,
      },
      openFile: {
        type: "button",
        id: "openFile",
        clickable: true,
        label: "open file...",
        icon: "open_file",
        quick_view_background: SYSTEM_ICON_MANAGER.uploadFile.ICON16,
      },
    };
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
        id: "open_folder",
        clickable: true,
        label: "open folder...",
        icon: "open_folder",
        quick_view_background: SYSTEM_ICON_MANAGER.uploadFolder.ICON16,
      },
      openFile: {
        type: "button",
        id: "openFile",
        clickable: true,
        label: "open file...",
        icon: "open_file",
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
        label: "new file...",
        icon: "new_file",
        quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
      },
      newFolder: {
        type: "button",
        id: "newFolder",
        clickable: true,
        label: "new folder...",
        icon: "new_folder",
        quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
      },
      paste: {
        type: "button",
        id: "paste",
        clickable: false,
        label: "paste",
        short_cut_label: "Ctrl+V",
        icon: "paste",
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
        label: "copy",
        short_cut_label: "Ctrl+C",
        icon: "copy",
      },
      rename: {
        type: "button",
        id: "rename",
        clickable: true,
        label: "rename",
        icon: "rename",
        quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
      },
      delete: {
        type: "button",
        id: "delete",
        clickable: true,
        label: "delete",
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
        label: "new file...",
        icon: "new_file",
        quick_view_background: SYSTEM_ICON_MANAGER.newFile.ICON16,
      },
      newFolder: {
        type: "button",
        id: "newFolder",
        clickable: true,
        label: "new folder...",
        icon: "new_folder",
        quick_view_background: SYSTEM_ICON_MANAGER.newFolder.ICON16,
      },
      paste: {
        type: "button",
        id: "paste",
        clickable: false,
        label: "paste",
        short_cut_label: "Ctrl+V",
        icon: "paste",
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
        label: "copy",
        short_cut_label: "Ctrl+C",
        icon: "copy",
      },
      rename: {
        type: "button",
        id: "rename",
        clickable: true,
        label: "rename",
        icon: "rename",
        quick_view_background: SYSTEM_ICON_MANAGER.rename.ICON16,
      },
      delete: {
        type: "button",
        id: "delete",
        clickable: true,
        label: "delete",
        icon: SYSTEM_ICON_MANAGER.trash.ICON512,
        quick_view_background: SYSTEM_ICON_MANAGER.trash.ICON16,
      },
      br: {
        type: "br",
        id: "br",
      },
    };
    let contextStructure = { ...default_file_context_menu };
    switch (source_editor_component) {
      case "file": {
        contextStructure = { ...default_file_context_menu };
        return contextStructure;
      }
      case "folder": {
        contextStructure = { ...default_folder_context_menu };
        if (onCopyFile) {
          contextStructure.paste = clickablePaste;
        }
        return contextStructure;
      }
      case "root": {
        contextStructure = { ...default_root_context_menu };
        if (onCopyFile) {
          contextStructure.paste = clickablePaste;
        }
        return contextStructure;
      }
      case "explorer": {
        contextStructure = { ...default_explorer_context_menu };
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
        setOnConextMenuPath,
        load_explorer_context_menu,
      }}
    >
      {children}
    </SurfaceExplorerContextMenuContexts.Provider>
  );
};
const SurfaceExplorer = ({
  id,
  width,
  height,
  mode,
  command,
  setCommand,
  load_contextMenu,
  command_executed,
  data,
  setData,
  item_on_drag,
  item_on_drop,
}) => {
  const { dir } = useContext(RootDataContexts);
  const [filteredDir, setFilteredDir] = useState(null);

  const { isDirLoaded } = useContext(RootDataContexts);
  const explorerListRef = useRef(null);
  const [explorerListWidth, setExplorerListWidth] = useState(0);
  const [explorerListTop, setExplorerListTop] = useState(0);
  const [explorerScrollPosition, setExplorerScrollPosition] = useState(0);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  const [onSelectedExplorerItems, setOnSelectedExplorerItems] = useState([]);
  const [onHoverExplorerItem, setOnHoverExplorerItem] = useState(null);
  const [firstVisibleItem, setFirstVisibleItem] = useState(null);
  const [filterKeyWord, setFilterKeyWord] = useState(null);

  const check_is_explorer_item_selected = useCallback(
    (file_path) => {
      if (!onSelectedExplorerItems) return false;
      if (onSelectedExplorerItems.includes(file_path)) {
        return true;
      } else {
        return false;
      }
    },
    [onSelectedExplorerItems]
  );
  const access_filtered_dir_sub_items_by_path = useCallback(
    (path) => {
      if (!filteredDir) return null;
      const sub_items = filteredDir[path]?.sub_items;

      for (let index = 0; index < sub_items.length; index++) {
        if (!filteredDir[sub_items[index]]) {
          sub_items.splice(index, 1);
        }
      }
      return sub_items;
    },
    [filteredDir]
  );

  useEffect(() => {
    const update_explorer_scroll_position = throttle(() => {
      if (explorerListRef.current) {
        setExplorerScrollPosition(explorerListRef.current.scrollTop);
        setExplorerListTop(explorerListRef.current.getBoundingClientRect().top);
      }
    }, 200);
    if (!explorerListRef.current) return;
    if (explorerListRef.current) {
      setExplorerListWidth(explorerListRef.current.offsetWidth);
      setExplorerListTop(explorerListRef.current.getBoundingClientRect().top);
    }
    explorerListRef.current.addEventListener(
      "scroll",
      update_explorer_scroll_position
    );
    return () => {
      if (explorerListRef.current) {
        explorerListRef.current.removeEventListener(
          "scroll",
          update_explorer_scroll_position
        );
      }
    };
  }, [isDirLoaded]);
  useEffect(() => {
    if (explorerListRef.current) {
      setExplorerListWidth(explorerListRef.current.offsetWidth);
    }
  }, [width]);
  useEffect(() => {
    if (!dir) return null;
    const filter = (filterKeyWord) => {
      if (!filterKeyWord || filterKeyWord.length === 0) return dir;
      if (filterKeyWord === "folder") {
        if (!dir || typeof dir !== "object") {
          console.error("Data is undefined or null");
          return {};
        }
        return Object.keys(dir)
          .filter((key) => dir[key]?.file_type === "folder")
          .reduce((acc, key) => {
            acc[key] = dir[key];
            return acc;
          }, {});
      }
      return dir;
    };
    setFilteredDir(filter(filterKeyWord));
  }, [dir, isDirLoaded, filterKeyWord]);

  return (
    <SurfaceExplorerContexts.Provider
      value={{
        id,
        width,
        height,
        command,
        setCommand,
        load_contextMenu,
        command_executed,
        item_on_drag,
        item_on_drop,
        explorerListRef,
        explorerListWidth,
        setExplorerListWidth,
        explorerListTop,
        setExplorerListTop,
        explorerScrollPosition,
        setExplorerScrollPosition,
        scrollbarVisible,
        setScrollbarVisible,
        onSelectedExplorerItems,
        setOnSelectedExplorerItems,
        onHoverExplorerItem,
        setOnHoverExplorerItem,
        firstVisibleItem,
        setFirstVisibleItem,
        check_is_explorer_item_selected,
        access_filtered_dir_sub_items_by_path,
      }}
    >
      <ContextMenuWrapper>
        {isDirLoaded ? (
          <>
            <ExplorerList filteredDir={filteredDir} />
            <ExplorerSearchBar
              filterKeyWord={filterKeyWord}
              setFilterKeyWord={setFilterKeyWord}
            />
          </>
        ) : (
          <ExplorerLoadingIndicator width={width} />
        )}
      </ContextMenuWrapper>
      {/* <ExplorerTopShadow position_y={padding.top} position_x={padding.left} /> */}
    </SurfaceExplorerContexts.Provider>
  );
};

export default SurfaceExplorer;
