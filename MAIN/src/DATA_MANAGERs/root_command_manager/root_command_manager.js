import React, { useState, useEffect, useContext } from "react";
import { RootCommandContexts } from "./root_command_contexts";
import ContextMenu from "../../BUILTIN_COMPONENTs/context_menu/context_menu";

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
    unique_tag: "copy",
    clickable: true,
    label: "Copy",
    short_cut_label: "Ctrl + C",
    icon: SYSTEM_ICON_MANAGER.copy.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.copy.ICON16,
  },
  paste: {
    type: "button",
    unique_tag: "paste",
    clickable: false,
    label: "Paste",
    icon: SYSTEM_ICON_MANAGER.paste.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.paste.ICON16,
  },
  customizeInstruction: {
    type: "button",
    unique_tag: "customizeInstruction",
    clickable: true,
    label: "Customize Instruction",
    icon: SYSTEM_ICON_MANAGER.draftingCompass.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.draftingCompass.ICON16,
  },
  customizeAPI: {
    type: "button",
    unique_tag: "customizeAPI",
    icon: SYSTEM_ICON_MANAGER.customize.ICON512,
    label: "Customize API",
    quick_view_background: SYSTEM_ICON_MANAGER.customize.ICON16,
    clickable: true,
    sub_items: ["customizeRequest"],
  },
  AST: {
    type: "button",
    unique_tag: "AST",
    label: "AST",
    icon: SYSTEM_ICON_MANAGER.ast.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.ast.ICON16,
    clickable: true,
    sub_items: ["viewAST", "updateAST"],
  },
  continue: {
    type: "button",
    unique_tag: "continue",
    clickable: true,
    label: "Continue...",
    icon: SYSTEM_ICON_MANAGER.continue.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.continue.ICON16,
  },
  fix: {
    type: "button",
    unique_tag: "fix",
    clickable: true,
    label: "Fix...",
    icon: SYSTEM_ICON_MANAGER.fix.ICON512,
    quick_view_background: SYSTEM_ICON_MANAGER.fix.ICON16,
  },
  br: {
    type: "br",
    unique_tag: "br",
  },
  moreOptions: {
    type: "button",
    unique_tag: "moreOptions",
    icon: SYSTEM_ICON_MANAGER.moreOptions.ICON512,
    label: "More Editor Options...",
    quick_view_background: SYSTEM_ICON_MANAGER.moreOptions.ICON16,
    clickable: true,
    sub_items: ["fold", "unfold"],
  },
  fold: {
    type: "button",
    unique_tag: "fold",
    icon: SYSTEM_ICON_MANAGER.fold.ICON512,
    label: "Fold All",
    quick_view_background: SYSTEM_ICON_MANAGER.fold.ICON16,
    clickable: true,
  },
  unfold: {
    type: "button",
    unique_tag: "unfold",
    icon: SYSTEM_ICON_MANAGER.unfold.ICON512,
    label: "Unfold All",
    quick_view_background: SYSTEM_ICON_MANAGER.unfold.ICON16,
    clickable: true,
  },
  viewAST: {
    type: "button",
    unique_tag: "viewAST",
    icon: SYSTEM_ICON_MANAGER.folderTree.ICON512,
    label: "view AST",
    quick_view_background: SYSTEM_ICON_MANAGER.folderTree.ICON16,
    clickable: true,
  },
  updateAST: {
    type: "button",
    unique_tag: "updateAST",
    icon: SYSTEM_ICON_MANAGER.update.ICON512,
    label: "update AST",
    quick_view_background: SYSTEM_ICON_MANAGER.update.ICON16,
    clickable: true,
  },
  customizeRequest: {
    unique_tag: "customizeRequest",
    height: 256,
    type: "component",
    path: "monaco_editor/customizeRequestForm/customizeRequestForm",
    width: 278,
  },
};

const RootCommandManager = ({ children }) => {
  const [cmd, setCmd] = useState({});

  /* { Context Menu } -------------------------------------------------------------------------------- */
  const [contextMenuOnLoad, setContextMenuOnLoad] = useState(false);
  const [contextMenuPositionX, setContextMenuPositionX] = useState(-1);
  const [contextMenuPositionY, setContextMenuPositionY] = useState(-1);
  const [sourceStackComponentTag, setSourceStackComponentTag] = useState(null);

  const [contextStructure, setContextStructure] = useState(FAKE_CONTEXT);

  const load_context_menu = (event, unique_tag, context_menu_structure) => {
    event.preventDefault();

    if (!unique_tag) {
      return;
    }
    setSourceStackComponentTag(unique_tag);
    if (!context_menu_structure) {
      setContextStructure(FAKE_CONTEXT);
    } else {
      setContextStructure(context_menu_structure);
    }

    const position_x = event.clientX;
    const position_y = event.clientY;

    setContextMenuPositionX(position_x);
    setContextMenuPositionY(position_y);

    setContextMenuOnLoad(true);
  };
  const unload_context_menu = () => {
    setContextMenuOnLoad(false);
    setContextMenuPositionX(-999);
    setContextMenuPositionY(-999);
    setSourceStackComponentTag(null);
  };
  /* { Context Menu } -------------------------------------------------------------------------------- */

  const push_command_by_tag = (stack_component_unique_tag, command) => {
    setCmd((prevCommand) => {
      const updatedCommand = { ...prevCommand };

      if (updatedCommand[stack_component_unique_tag]) {
        updatedCommand[stack_component_unique_tag].push(command);
      } else {
        updatedCommand[stack_component_unique_tag] = [command];
      }

      return updatedCommand;
    });
  };
  const pop_command_by_tag = (stack_component_unique_tag) => {
    let popped_command = null;

    setCmd((prevCommand) => {
      const updatedCommand = { ...prevCommand };
      if (updatedCommand[stack_component_unique_tag] && updatedCommand[stack_component_unique_tag].length > 0) {
        popped_command = updatedCommand[stack_component_unique_tag].splice(
          0,
          1
        )[0];

        if (updatedCommand[stack_component_unique_tag].length === 0) {
          delete updatedCommand[stack_component_unique_tag];
        }
      }
      return updatedCommand;
    });

    return popped_command;
  };

  return (
    <RootCommandContexts.Provider
      value={{
        cmd,
        push_command_by_tag,
        pop_command_by_tag,

        /* { Context Menu } ------------------------- */
        contextMenuPositionX,
        contextMenuPositionY,
        sourceStackComponentTag,
        contextStructure,
        load_context_menu,
        unload_context_menu,
      }}
    >
      <div onClick={unload_context_menu}>
        {children}
        {contextMenuOnLoad ? <ContextMenu /> : null}
      </div>
    </RootCommandContexts.Provider>
  );
};

export default RootCommandManager;
