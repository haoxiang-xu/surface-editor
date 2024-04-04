import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../../ICONs/icon_manager";
import { SubContextMenu } from "../rightClickContextMenu";
import Form from "../customizeRequestForm/customizeRequestForm";
import "./contextItem.css";
import {
  rightClickContextMenuCommandContexts,
  rightClickContextMenuInsideContexts,
} from "../../../CONTEXTs/rightClickContextMenuContexts";
import {
  CONTEXTMENU_WIDTH,
  CONTEXTITEM_BORDER,
  CONTEXTITEM_HEIGHT,
  SUBCONTEXTMENU_WIDTH,
  CUSTOMIZE_REQUEST_FORM_WIDTH,
  CUSTOMIZE_REQUEST_FORM_HEIGHT,
  COMPONENT_ITEM_FUNCTION_CONFIG,
} from "../../../CONSTs/contextMenuConfig";

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

/* Context Menu Item List ============================================================================================================= */
const CONTEXT_MENU_FUNCTION_MANAGER = {
  newFile: {
    ICON: SYSTEM_ICON_MANAGER.newFile.ICON512,
    LABEL: "New File...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.newFile.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.newFile.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  newFolder: {
    ICON: SYSTEM_ICON_MANAGER.newFolder.ICON512,
    LABEL: "New Folder...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.newFolder.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.newFolder.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  insertFile: {
    ICON: SYSTEM_ICON_MANAGER.insertFile.ICON512,
    LABEL: "Insert Files...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.insertFile.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.insertFile.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  rename: {
    ICON: SYSTEM_ICON_MANAGER.rename.ICON512,
    LABEL: "Rename...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.rename.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.rename.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  copy: {
    ICON: SYSTEM_ICON_MANAGER.copy.ICON512,
    LABEL: "Copy",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.copy.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.copy.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  paste: {
    ICON: SYSTEM_ICON_MANAGER.paste.ICON512,
    LABEL: "Paste",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.paste.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.paste.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  unpaste: {
    ICON: SYSTEM_ICON_MANAGER.unpaste.ICON512,
    LABEL: "Paste",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.unpaste.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.unpaste.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: false,
  },
  delete: {
    ICON: SYSTEM_ICON_MANAGER.trash.ICON512,
    LABEL: "Delete",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.trash.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.trash.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  duplicate: {
    ICON: SYSTEM_ICON_MANAGER.duplicate.ICON512,
    LABEL: "Duplicate",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.duplicate.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.duplicate.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  continue: {
    ICON: SYSTEM_ICON_MANAGER.continue.ICON512,
    LABEL: "Continue...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.continue.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.continue.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  fix: {
    ICON: SYSTEM_ICON_MANAGER.fix.ICON512,
    LABEL: "Fix...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.fix.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.fix.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  AST: {
    ICON: SYSTEM_ICON_MANAGER.ast.ICON512,
    LABEL: "AST",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.ast.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.ast.ICON16,
    MORE_OPTIONS: ["viewAST", "updateAST"],
    SUB_MENU_WIDTH: SUBCONTEXTMENU_WIDTH,
    LEVEL: 0,
    CLICKABLE: true,
  },
  viewAST: {
    ICON: SYSTEM_ICON_MANAGER.folderTree.ICON512,
    LABEL: "view AST",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.ast.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.folderTree.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  updateAST: {
    ICON: SYSTEM_ICON_MANAGER.update.ICON512,
    LABEL: "update AST",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.update.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.update.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  customizeAPI: {
    ICON: SYSTEM_ICON_MANAGER.customize.ICON512,
    LABEL: "Customize API",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.customize.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.customize.ICON16,
    MORE_OPTIONS: ["customizeRequest"],
    SUB_MENU_WIDTH: CUSTOMIZE_REQUEST_FORM_WIDTH,
    LEVEL: 0,
    CLICKABLE: true,
  },
  sendRequest: {
    ICON: SYSTEM_ICON_MANAGER.send.ICON512,
    LABEL: "Send Customized Request...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.send.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.send.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  customizeRequest: {
    ICON: SYSTEM_ICON_MANAGER.customize.ICON512,
    LABEL: "Customize Request",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.customize.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.customize.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  fold: {
    ICON: SYSTEM_ICON_MANAGER.fold.ICON512,
    LABEL: "Fold All",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.fold.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.fold.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  unfold: {
    ICON: SYSTEM_ICON_MANAGER.unfold.ICON512,
    LABEL: "Unfold All",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.unfold.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.unfold.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 1,
    CLICKABLE: true,
  },
  customizeInstruction: {
    ICON: SYSTEM_ICON_MANAGER.draftingCompass.ICON512,
    LABEL: "Customize Instruction",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.draftingCompass.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.draftingCompass.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  moreOptions: {
    ICON: SYSTEM_ICON_MANAGER.moreOptions.ICON512,
    LABEL: "More Editor Options...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.moreOptions.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.moreOptions.ICON16,
    MORE_OPTIONS: ["fold", "unfold"],
    SUB_MENU_WIDTH: SUBCONTEXTMENU_WIDTH,
    LEVEL: 0,
    CLICKABLE: true,
  },
  openFolder: {
    ICON: SYSTEM_ICON_MANAGER.openFolder.ICON512,
    LABEL: "Open Folder...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.openFolder.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.openFolder.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
  openFile: {
    ICON: SYSTEM_ICON_MANAGER.openFile.ICON512,
    LABEL: "Open File...",
    LABEL_COLOR: SYSTEM_ICON_MANAGER.openFile.LABEL_COLOR,
    BACKGROUND_ICON: SYSTEM_ICON_MANAGER.openFile.ICON16,
    MORE_OPTIONS: null,
    LEVEL: 0,
    CLICKABLE: true,
  },
};
/* Context Menu Item List ============================================================================================================= */

const CustomizedRequestFormContextItem = () => {
  return <Form></Form>;
};
const DefaultContextItem = ({ item_function, parentContextMenuWidth }) => {
  const { onRightClickItem } = useContext(rightClickContextMenuCommandContexts);
  const {
    progressRightClickCommand,
    onHoverContextItems,
    setOnHoverContextItems,
  } = useContext(rightClickContextMenuInsideContexts);
  const menuRef = useRef(null);
  const [contextItemContainerClassName, setContextItemContainerClassName] =
    useState(
      CONTEXT_MENU_FUNCTION_MANAGER[item_function]?.CLICKABLE
        ? "contextItem_component_container0802"
        : "contextItem_component_container_unclickable0826"
    );
  const handleItemOnClick = (e) => {
    if (CONTEXT_MENU_FUNCTION_MANAGER[item_function].MORE_OPTIONS === null) {
      progressRightClickCommand(item_function);
    } else {
      e.stopPropagation();
    }
  };
  const handleItemOnHover = () => {
    setOnHoverContextItems((prevItems) => {
      if (!prevItems || prevItems.length === 0) {
        return [item_function];
      } else if (
        CONTEXT_MENU_FUNCTION_MANAGER[prevItems[prevItems.length - 1]].LEVEL <
        CONTEXT_MENU_FUNCTION_MANAGER[item_function].LEVEL
      ) {
        return [...prevItems, item_function];
      } else if (
        CONTEXT_MENU_FUNCTION_MANAGER[prevItems[prevItems.length - 1]].LEVEL ===
        CONTEXT_MENU_FUNCTION_MANAGER[item_function].LEVEL
      ) {
        return [...prevItems.slice(0, prevItems.length - 1), item_function];
      } else if (
        CONTEXT_MENU_FUNCTION_MANAGER[prevItems[prevItems.length - 1]].LEVEL >
        CONTEXT_MENU_FUNCTION_MANAGER[item_function].LEVEL
      ) {
        return [...prevItems.slice(0, item_function.LEVEL + 1), item_function];
      }
      return prevItems;
    });
  };
  /* Sub Context Menu ----------------------------------------------------------------- */
  const [subContextMenu, setSubContextMenu] = useState(null);
  useEffect(() => {
    if (onHoverContextItems?.some((item) => item === item_function)) {
      if (CONTEXT_MENU_FUNCTION_MANAGER[item_function].MORE_OPTIONS !== null) {
        setSubContextMenu(
          <SubContextMenu
            contextItemFunctions={
              CONTEXT_MENU_FUNCTION_MANAGER[item_function].MORE_OPTIONS
            }
            subContextMenuWidth={
              CONTEXT_MENU_FUNCTION_MANAGER[item_function].SUB_MENU_WIDTH
            }
            x={
              menuRef.current.getBoundingClientRect().left +
              parentContextMenuWidth -
              12
            }
            y={menuRef.current.getBoundingClientRect().top}
            onRightClickItem={onRightClickItem}
            progressRightClickCommand={progressRightClickCommand}
            parentContextMenuWidth={menuRef.current.offsetWidth}
          />
        );
      }
    } else {
      setSubContextMenu(null);
    }
  }, [onHoverContextItems]);
  /* Sub Context Menu ----------------------------------------------------------------- */

  /* ICON Loader ===================================================================== */
  const [isFunctionIconLoaded, setIsFunctionIconLoaded] = useState(false);
  const handleFunctionIconLoad = () => {
    setIsFunctionIconLoaded(true);
  };
  const [isMoreOptionIconLoaded, setIsMoreOptionIconLoaded] = useState(false);
  const handleMoreOptionIconLoad = () => {
    setIsMoreOptionIconLoaded(true);
  };
  /* ICON Loader ===================================================================== */
  return (
    <div
      ref={menuRef}
      className={contextItemContainerClassName}
      onClick={(e) => {
        handleItemOnClick(e);
      }}
      onMouseEnter={handleItemOnHover}
    >
      {/* Icon ----------------------------------------------------------------- */}
      {CONTEXT_MENU_FUNCTION_MANAGER[item_function].ICON !== undefined ? (
        /* Icon Loader ----------------------------------------------------------------- */
        <div
          className="contextItem_blur_loader0827"
          style={
            isFunctionIconLoaded
              ? {}
              : {
                  backgroundImage: `url(${CONTEXT_MENU_FUNCTION_MANAGER[item_function].BACKGROUND_ICON})`,
                }
          }
        >
          <img
            src={CONTEXT_MENU_FUNCTION_MANAGER[item_function].ICON}
            className="contextItem_component_icon0802"
            loading="lazy"
            onLoad={handleFunctionIconLoad}
          />
        </div>
      ) : null}
      {/* Icon ----------------------------------------------------------------- */}

      {/* Label ================================================================= */}
      <span
        className="contextItem_component_label0802"
        style={{
          color: CONTEXT_MENU_FUNCTION_MANAGER[item_function].LABEL_COLOR,
        }}
      >
        {CONTEXT_MENU_FUNCTION_MANAGER[item_function].LABEL}
      </span>
      {/* Label ================================================================= */}

      {/* Paste Preview ----------------------------------------------------------------- */}
      {item_function === "paste" ? (
        <span className="contextItem_component_copyfile_label0827">
          {onRightClickItem.condition.paste}
        </span>
      ) : null}
      {/* Paste Preview ----------------------------------------------------------------- */}

      {/* More Options ==================================================================== */}
      {CONTEXT_MENU_FUNCTION_MANAGER[item_function].MORE_OPTIONS !== null ? (
        <div
          className="contextItem_more_options_blur_loader1119"
          style={
            isMoreOptionIconLoaded
              ? {}
              : {
                  backgroundImage: `url(${SYSTEM_ICON_MANAGER.arrow.ICON16})`,
                }
          }
        >
          <img
            src={SYSTEM_ICON_MANAGER.arrow.ICON512}
            className="contextItem_component_more_options_icon1119"
            loading="lazy"
            onLoad={handleMoreOptionIconLoad}
          />
        </div>
      ) : null}
      {onHoverContextItems?.some((item) => item === item_function)
        ? subContextMenu
        : null}
      {/* More Options ==================================================================== */}
    </div>
  );
};
const ContextItem = ({ item_function, parentContextMenuWidth }) => {
  const renderContextItem = (item_function) => {
    switch (item_function) {
      case "hr":
        return (
          <div>
            <hr className="contextItem_component_br0802" />
          </div>
        );
      case "customizeRequest":
        return (
          <CustomizedRequestFormContextItem></CustomizedRequestFormContextItem>
        );
      default:
        return (
          <DefaultContextItem
            item_function={item_function}
            parentContextMenuWidth={parentContextMenuWidth}
          ></DefaultContextItem>
        );
    }
  };
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto"
        rel="stylesheet"
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      ></link>
      {renderContextItem(item_function)}
    </div>
  );
};

export default ContextItem;
