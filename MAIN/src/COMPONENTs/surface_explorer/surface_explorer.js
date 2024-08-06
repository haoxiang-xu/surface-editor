import React, { useState, useEffect, useRef, useContext } from "react";
/* Context ------------------------------------------------------------------------------------------------------------------------ */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
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
const default_explorer_item_height = 20.5;
const default_x_axis_offset = 12;

const ExplorerItemFolder = ({ file_path, position_y, position_x }) => {
  const {
    access_dir_name_by_path,
    access_dir_expand_status_by_path,
    update_dir_expand_status_by_path,
  } = useContext(RootDataContexts);
  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 0)`,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);

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
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 0)`,
      });
    }
  }, [onHover]);

  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y,
        left: position_x,
        /* Size ======================== */
        width: "calc(100% - " + position_x + "px)",
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
      onMouseDown={() => {
        setOnClick(true);
      }}
      onMouseUp={() => {
        setOnClick(false);
        update_dir_expand_status_by_path(
          file_path,
          !access_dir_expand_status_by_path(file_path)
        );
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
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
          },
        }}
      />
    </div>
  );
};
const ExplorerItemFile = ({ file_path, position_y, position_x }) => {
  const { access_dir_name_by_path } = useContext(RootDataContexts);
  const tagRef = useRef(null);
  const [style, setStyle] = useState({
    backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 0)`,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);

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
    } else {
      setStyle({
        backgroundColor: `rgba( ${surface_explorer_fixed_styling.backgroundColorR}, ${surface_explorer_fixed_styling.backgroundColorG}, ${surface_explorer_fixed_styling.backgroundColorB}, 0)`,
      });
    }
  }, [onHover]);

  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
        position: "absolute",
        top: position_y,
        left: position_x,
        /* Size ======================== */
        width: "calc(100% - " + position_x + "px)",
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
      onMouseDown={() => {
        setOnClick(true);
      }}
      onMouseUp={() => {
        setOnClick(false);
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
            backgroundColor: style.backgroundColor,
            boxShadow: "none",
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
  const [explorer_list, setExplorerList] = useState([]);

  useEffect(() => {
    const update_explorer_list = async () => {
      const new_explorer_list = await render_explorer_structure("root", 0, 0);
      setExplorerList(new_explorer_list);
    };
    const render_explorer_structure = async (path, position_y, position_x) => {
      const sub_items = access_dir_sub_items_by_path(path);
      let explorer_structure = [];
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
            const sub_explorer_structure = await render_explorer_structure(
              sub_items[index],
              next_position_y,
              next_position_x
            );
            explorer_structure = explorer_structure.concat(
              sub_explorer_structure
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
            next_position_y += default_explorer_item_height;
          }
        }
      }
      return explorer_structure;
    };
    update_explorer_list();
  }, [dir2]);

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        e.preventDefault();
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
        borderRadius: "4px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {explorer_list.slice().reverse().map((item) => {
        return item;
      })}
    </div>
  );
};

const SurfaceExplorer = ({
  id,
  mode,
  command,
  setCommand,
  load_contextMenu,
  data,
  setData,
  item_on_drag,
  item_on_drop,
}) => {
  return (
    <>
      <ExplorerList />
    </>
  );
};

export default SurfaceExplorer;
