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
        top: position_y,
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
      onMouseUp={() => {
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
            borderRadius: 2,
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
        top: position_y,
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
      onMouseUp={() => {
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
            borderRadius: 2,
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
