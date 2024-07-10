import React, { useContext } from "react";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";

const FAKE_CONTEXT = {
  root: {
    type: "root",
    sub_items: ["copy", "paste", "cut", "delete"],
  },
  copy: {
    type: "button",
    unique_tag: "copy",
    clickable: true,
    text: "Copy",
  },
  paste: {
    type: "button",
    unique_tag: "paste",
    clickable: true,
    text: "Paste",
  },
  cut: {
    type: "button",
    unique_tag: "cut",
    clickable: true,
    text: "Cut",
  },
  delete: {
    type: "button",
    unique_tag: "delete",
    clickable: true,
    text: "Delete",
  },
};

const ContextMenuItemList = ({ position_x, position_y, position_z }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: `${position_y}px`,
        left: `${position_x}px`,
        padding: "4px",
        zIndex: position_z,

        height: "64px",
        width: "238px",

        /*STYLE*/
        border: "1.5px solid #585858",
        backgroundColor: "#202020",
        borderRadius: "0px 11px 11px 11px",
        boxShadow: "0px 4px 16px 8px rgba(0, 0, 0, 0.32)",
      }}
    ></div>
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

  const progress_context_menu_item = () => {};
  return (
    <ContextMenuItemList
      position_x={contextMenuPositionX}
      position_y={contextMenuPositionY}
      position_z={12}
    />
  );
};

export default ContextMenu;
