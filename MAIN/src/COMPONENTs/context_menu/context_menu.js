import React, { useState, useContext, useEffect } from "react";

import { default_clickable_panel_styling } from "../../DATA_MANAGERs/global_styling_manager/global_styling_default_consts";
import {
  context_menu_fixed_styling,
  button_fixed_styling,
} from "./context_menu_fixed_styling_config";

import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import { ContextMenuContexts } from "./context_menu_contexts";

import { ICON_MANAGER } from "../../ICONs/icon_manager";

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

const FAKE_CONTEXT = {
  root: {
    type: "root",
    sub_items: ["continue", "fix", "copy", "paste"],
  },
  copy: {
    type: "button",
    unique_tag: "copy",
    height: 30,
    clickable: true,
    label: "Copy",
    icon: SYSTEM_ICON_MANAGER.copy.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
  },
  paste: {
    type: "button",
    unique_tag: "paste",
    height: 30,
    clickable: true,
    label: "Paste",
    icon: SYSTEM_ICON_MANAGER.paste.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
  },
  continue: {
    type: "button",
    unique_tag: "continue",
    height: 30,
    clickable: true,
    label: "Continue...",
    icon: SYSTEM_ICON_MANAGER.continue.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.continue.ICON16,
  },
  fix: {
    type: "button",
    unique_tag: "fix",
    height: 30,
    clickable: true,
    label: "Fix...",
    icon: SYSTEM_ICON_MANAGER.fix.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.fix.ICON16,
  },
};

const ContextItemButton = ({ index, unique_tag, top_position }) => {
  const { contextStructure, get_context_item_height } =
    useContext(ContextMenuContexts);

  const [onHover, setOnHover] = useState(false);
  const [onClicked, setOnClicked] = useState(false);
  const [isIconLoaded, setIsIconLoaded] = useState(false);
  const handleIconLoad = () => {
    setIsIconLoaded(true);
  };

  const [style, setStyle] = useState({
    backgroundColor: default_clickable_panel_styling.backgroundColor.default,
    boxShadow: default_clickable_panel_styling.boxShadow.default,
    borderRadius: default_clickable_panel_styling.borderRadius.default,
    transition: default_clickable_panel_styling.transition.default,
  });
  useEffect(() => {
    if (onClicked) {
      setStyle({
        backgroundColor:
          default_clickable_panel_styling.backgroundColor.onClick,
        boxShadow: default_clickable_panel_styling.boxShadow.onClick,
        borderRadius: default_clickable_panel_styling.borderRadius.default,
        transition: default_clickable_panel_styling.transition.onClick,
      });
    } else if (onHover) {
      setStyle({
        backgroundColor:
          default_clickable_panel_styling.backgroundColor.onHover,
        boxShadow: default_clickable_panel_styling.boxShadow.onHover,
        borderRadius: default_clickable_panel_styling.borderRadius.default,
        transition: default_clickable_panel_styling.transition.onHover,
      });
    } else {
      setStyle({
        backgroundColor:
          default_clickable_panel_styling.backgroundColor.default,
        boxShadow: default_clickable_panel_styling.boxShadow.default,
        borderRadius: default_clickable_panel_styling.borderRadius.default,
        transition: default_clickable_panel_styling.transition.default,
      });
    }
  }, [onHover, onClicked]);

  return (
    <div
      style={{
        /* POSITION -------------- */
        position: "absolute",
        top: top_position,
        left: context_menu_fixed_styling.padding,

        /* SIZE ------------------ */
        height: get_context_item_height(unique_tag),
        width: `calc(100% - ${context_menu_fixed_styling.padding * 2}px)`,

        /* STYLE ----------------- */
        fontSize: "13px",
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => {
        setOnHover(false);
        setOnClicked(false);
      }}
      onMouseDown={() => setOnClicked(true)}
      onMouseUp={() => setOnClicked(false)}
    >
      <div
        style={{
          /* POSITION -------------- */
          position: "absolute",
          top: "50%",
          left: "6px",
          transform: "translate(0%, -50%)",

          /* SIZE ------------------ */
          width: "16px",
          height: "16px",
          backgroundImage: isIconLoaded
            ? `url(${contextStructure[unique_tag].quick_view_background})`
            : null,
        }}
      >
        <img
          src={contextStructure[unique_tag].icon}
          style={{
            /* POSITION -------------- */
            position: "absolute",
            top: "0px",
            left: "0px",

            /* SIZE ------------------ */
            width: "16px",
            height: "16px",
          }}
          loading="lazy"
          onLoad={handleIconLoad}
          alt={unique_tag}
        />
      </div>
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "32px",
          color: "#CCCCCC",
          transform: "translate(0%, -54%)",
          userSelect: "none",
        }}
      >
        {contextStructure[unique_tag].label}
      </span>
    </div>
  );
};
const ContextList = ({ position_x, position_y, position_z, sub_items }) => {
  const {
    contextStructure,
    calculate_context_list_height,
    calculate_item_top_position,
  } = useContext(ContextMenuContexts);

  return (
    <div
      style={{
        /*POSITION ---------------- */
        position: "fixed",
        top: `${position_y}px`,
        left: `${position_x}px`,
        zIndex: position_z,

        /*SIZE -------------------- */
        height: `${calculate_context_list_height(sub_items)}px`,
        width: "238px",

        /*STYLE ------------------- */
        border: "1.5px solid #58585896",
        backgroundColor: "#202020",
        borderRadius: "0px 11px 11px 11px",
        boxShadow: "0px 4px 16px 8px rgba(0, 0, 0, 0.32)",
        overflow: "hidden",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {sub_items.map((item, index) => {
        return (
          <ContextItemButton
            key={item}
            index={index}
            unique_tag={item}
            top_position={calculate_item_top_position(index, sub_items)}
          />
        );
      })}
    </div>
  );
};

const ContextMenu = () => {
  const {
    command,
    push_command_by_tag,
    pop_command_by_tag,
    contextMenuPositionX,
    contextMenuPositionY,
    loadContextMenu,
    unloadContextMenu,
  } = useContext(RootCommandContexts);

  const [contextStructure, setContextStructure] = useState(FAKE_CONTEXT);
  const get_context_item_height = (unique_tag) => {
    if (contextStructure[unique_tag].type === "button") {
      return button_fixed_styling.height;
    } else {
      return contextStructure[unique_tag].height;
    }
  };
  const calculate_context_list_height = (sub_items) => {
    let height = context_menu_fixed_styling.padding * 2 + 2;
    for (let i = 0; i < sub_items.length; i++) {
      height += get_context_item_height(sub_items[i]);
    }
    return height;
  };
  const calculate_item_top_position = (index, sub_items) => {
    let top_position = context_menu_fixed_styling.padding + 1;
    for (let i = 0; i < index; i++) {
      top_position += get_context_item_height(sub_items[i]);
    }
    return top_position;
  };

  const progress_context_menu_item = () => {};
  return (
    <ContextMenuContexts.Provider
      value={{
        contextStructure,
        get_context_item_height,
        calculate_context_list_height,
        calculate_item_top_position,
        progress_context_menu_item,
      }}
    >
      <ContextList
        position_x={contextMenuPositionX}
        position_y={contextMenuPositionY}
        position_z={12}
        sub_items={contextStructure.root.sub_items}
      />
    </ContextMenuContexts.Provider>
  );
};

export default ContextMenu;
