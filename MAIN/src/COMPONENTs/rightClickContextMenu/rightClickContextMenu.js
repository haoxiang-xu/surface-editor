import React, { useState, useEffect, useRef, useContext } from "react";
import ContextItem from "./contextItem/contextItem";
import "./rightClickContextMenu.css";
import {
  rightClickContextMenuCommandContexts,
  rightClickContextMenuInsideContexts,
} from "../../CONTEXTs/rightClickContextMenuContexts";
import {
  CONTEXTMENU_WIDTH,
  CONTEXTITEM_BORDER,
  CONTEXTITEM_HEIGHT,
  CUSTOMIZE_REQUEST_FORM_WIDTH,
  CUSTOMIZE_REQUEST_FORM_HEIGHT,
  COMPONENT_ITEM_FUNCTION_CONFIG,
} from "../../CONSTs/contextMenuConfig";

const RightClickContextMenu = ({}) => {
  const {
    rightClickX,
    rightClickY,
    onRightClickItem,
    setOnRightClickItem,
    setRightClickCommand,
  } = useContext(rightClickContextMenuCommandContexts);
  let contextItems = [];
  const progressRightClickCommand = (command, content) => {
    content = content ? content : onRightClickItem.content;
    setRightClickCommand({
      command: command,
      content: content,
      target: onRightClickItem.target,
    });
  };
  const configContextMenuItems = (onRightClickItem) => {
    const pasteCondition = onRightClickItem?.condition.paste
      ? "paste"
      : "unpaste";
    if (onRightClickItem !== null) {
      if (onRightClickItem.source.split("/")[0] === "vecoder_editor") {
        contextItems = COMPONENT_ITEM_FUNCTION_CONFIG.vecoder_editor.map(
          (contextItemFunction, index) =>
            contextItemFunction === "paste_or_unpaste" ? (
              <ContextItem
                key={index}
                item_function={pasteCondition}
                parentContextMenuWidth={CONTEXTMENU_WIDTH}
              />
            ) : (
              <ContextItem
                key={index}
                item_function={contextItemFunction}
                parentContextMenuWidth={CONTEXTMENU_WIDTH}
              />
            )
        );
      } else if (onRightClickItem.source.split("/")[0] === "vecoder_explorer") {
        if (
          onRightClickItem.content.fileType &&
          onRightClickItem.content.fileType === "folder"
        ) {
          if (
            onRightClickItem.content.filePath &&
            onRightClickItem.content.filePath.split("/").length === 1
          ) {
            contextItems =
              COMPONENT_ITEM_FUNCTION_CONFIG.vecoder_explorer_root_folder.map(
                (contextItemFunction, index) =>
                  contextItemFunction === "paste_or_unpaste" ? (
                    <ContextItem
                      key={index}
                      item_function={pasteCondition}
                      parentContextMenuWidth={CONTEXTMENU_WIDTH}
                    />
                  ) : (
                    <ContextItem
                      key={index}
                      item_function={contextItemFunction}
                      parentContextMenuWidth={CONTEXTMENU_WIDTH}
                    />
                  )
              );
          } else {
            contextItems =
              COMPONENT_ITEM_FUNCTION_CONFIG.vecoder_explorer_folder.map(
                (contextItemFunction, index) =>
                  contextItemFunction === "paste_or_unpaste" ? (
                    <ContextItem
                      key={index}
                      item_function={pasteCondition}
                      parentContextMenuWidth={CONTEXTMENU_WIDTH}
                    />
                  ) : (
                    <ContextItem
                      key={index}
                      item_function={contextItemFunction}
                      parentContextMenuWidth={CONTEXTMENU_WIDTH}
                    />
                  )
              );
          }
        } else {
          contextItems =
            COMPONENT_ITEM_FUNCTION_CONFIG.vecoder_explorer_file.map(
              (contextItemFunction, index) =>
                contextItemFunction === "paste_or_unpaste" ? (
                  <ContextItem
                    key={index}
                    item_function={pasteCondition}
                    parentContextMenuWidth={CONTEXTMENU_WIDTH}
                  />
                ) : (
                  <ContextItem
                    key={index}
                    item_function={contextItemFunction}
                    parentContextMenuWidth={CONTEXTMENU_WIDTH}
                  />
                )
            );
        }
      } else {
      }
    }
    return contextItems;
  };

  /* Define Menu Items -------------------------------------------------------------------------------------- */
  const [onHoverContextItems, setOnHoverContextItems] = useState([]);
  contextItems = configContextMenuItems(onRightClickItem);
  /* Define Menu Items -------------------------------------------------------------------------------------- */

  /* CONTEXT MENU DIMENSIONs ================================================================================= */
  const CONTEXTMENU_HEIGHT =
    CONTEXTITEM_HEIGHT * contextItems.length + CONTEXTITEM_BORDER;
  /* CONTEXT MENU DIMENSIONs ================================================================================= */

  /* Menu Styling and Position -------------------------------------------------------------------------- */
  const menuRef = useRef(null);
  const [menuClassName, setMenuClassName] = useState(
    "rightClickContextMenu_component_container0802"
  );
  const [position, setPosition] = useState({
    top:
      window.innerHeight < rightClickY + CONTEXTMENU_HEIGHT
        ? rightClickY - CONTEXTMENU_HEIGHT
        : rightClickY,
    left:
      window.innerWidth < rightClickX + CONTEXTMENU_WIDTH
        ? rightClickX - CONTEXTMENU_WIDTH
        : rightClickX,
  });
  const setMenuPosition = () => {
    if (menuRef.current) {
      let newStyle = "rightClickContextMenu_component_container0802";

      if (window.innerHeight < rightClickY + CONTEXTMENU_HEIGHT) {
        newStyle = "rightClickContextMenu_component_container_leftbottom0930";
      }
      if (window.innerWidth < rightClickX + CONTEXTMENU_WIDTH) {
        newStyle = "rightClickContextMenu_component_container_rigttop0930";
      }
      if (
        window.innerHeight < rightClickY + CONTEXTMENU_HEIGHT &&
        window.innerWidth < rightClickX + CONTEXTMENU_WIDTH
      ) {
        newStyle = "rightClickContextMenu_component_container_rightbottom0930";
      }

      setPosition({
        top:
          window.innerHeight < rightClickY + CONTEXTMENU_HEIGHT
            ? rightClickY - CONTEXTMENU_HEIGHT
            : rightClickY,
        left:
          window.innerWidth < rightClickX + CONTEXTMENU_WIDTH
            ? rightClickX - CONTEXTMENU_WIDTH
            : rightClickX,
      });
      setMenuClassName(newStyle);
    }
  };
  useEffect(() => {
    setOnHoverContextItems(null);
    setMenuPosition();
  }, [rightClickX, rightClickY]);
  /* Menu Styling and Position -------------------------------------------------------------------------- */

  return (
    <rightClickContextMenuInsideContexts.Provider
      value={{
        progressRightClickCommand,
        onHoverContextItems,
        setOnHoverContextItems,
      }}
    >
      {onRightClickItem !== null ? (
        <div className={menuClassName} ref={menuRef} style={position}>
          {contextItems}
        </div>
      ) : (
        <div></div>
      )}
    </rightClickContextMenuInsideContexts.Provider>
  );
};
const RightClickSubContextMenu = ({
  contextItemFunctions,
  subContextMenuWidth,
  x,
  y,
  parentContextMenuWidth,
}) => {
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(
    "subContextMenu_component_container1119"
  );
  const handleOnRightClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  /* Menu Styling and Position -------------------------------------------------------------------------- */
  const [position, setPosition] = useState({ top: y, left: x });
  const setMenuPosition = () => {
    if (menuRef.current) {
      let subContextMenuHeight = 0;

      if (contextItemFunctions?.some((item) => item === "customizeRequest")) {
        subContextMenuHeight = CUSTOMIZE_REQUEST_FORM_HEIGHT;
      } else {
        subContextMenuHeight =
          CONTEXTITEM_HEIGHT * contextItemFunctions.length + CONTEXTITEM_BORDER;
      }

      let newTop = y;
      let newLeft = x;

      if (y + subContextMenuHeight > window.innerHeight) {
        newTop -=
          subContextMenuHeight + CONTEXTITEM_BORDER - CONTEXTITEM_HEIGHT;
      }
      if (x + subContextMenuWidth > window.innerWidth) {
        newLeft = newLeft - (subContextMenuWidth + parentContextMenuWidth);
      }

      setPosition({
        top: newTop,
        left: newLeft,
        width: subContextMenuWidth + "px",
      });
    }
  };
  useEffect(() => {
    setMenuPosition();
  }, [x, y]);
  /* Menu Styling and Position -------------------------------------------------------------------------- */

  return (
    <div
      className={menuStyle}
      style={position}
      ref={menuRef}
      onContextMenu={handleOnRightClick}
    >
      {contextItemFunctions.map((contextItemFunction, index) => (
        <ContextItem
          key={index}
          item_function={contextItemFunction}
          parentContextMenuWidth={parentContextMenuWidth}
        />
      ))}
    </div>
  );
};

export default RightClickContextMenu;

export const ContextMenu = RightClickContextMenu;
export const SubContextMenu = RightClickSubContextMenu;
