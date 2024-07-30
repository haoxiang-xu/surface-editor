import React, { useState, useCallback, useEffect } from "react";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react";
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

const RootCommandManager = ({ children }) => {
  //console.log("RDM/RCM", new Date().getTime());
  const [cmd, setCmd] = useCustomizedState({}, compareJson);
  const push_command_by_id = useCallback(
    (id, command) => {
      setCmd((prevCommand) => {
        const updatedCommand = { ...prevCommand };

        if (updatedCommand[id]) {
          updatedCommand[id].push(command);
        } else {
          updatedCommand[id] = [command];
        }

        return updatedCommand;
      });
    },
    [cmd]
  );
  const pop_command_by_id = useCallback(
    (id) => {
      let popped_command = null;

      setCmd((prevCommand) => {
        const updatedCommand = { ...prevCommand };
        if (updatedCommand[id] && updatedCommand[id].length > 0) {
          popped_command = updatedCommand[id].splice(0, 1)[0];

          if (updatedCommand[id].length === 0) {
            delete updatedCommand[id];
          }
        }
        return updatedCommand;
      });

      return popped_command;
    },
    [cmd]
  );

  /* { Context Menu } -------------------------------------------------------------------------------- */
  const [contextMenuOnLoad, setContextMenuOnLoad] = useState(false);
  const [contextMenuPositionX, setContextMenuPositionX] = useState(-1);
  const [contextMenuPositionY, setContextMenuPositionY] = useState(-1);
  const [sourceComponentId, setSourceComponentId] = useState(null);

  const [contextStructure, setContextStructure] = useCustomizedState(
    null,
    compareJson
  );

  const load_context_menu = useCallback(
    (event, unique_tag, context_menu_structure) => {
      event.preventDefault();

      if (!unique_tag) {
        return;
      }
      setSourceComponentId(unique_tag);
      if (!context_menu_structure) {
        setContextStructure(null);
      } else {
        setContextStructure(context_menu_structure);
      }

      const position_x = event.clientX;
      const position_y = event.clientY;

      setContextMenuPositionX(position_x);
      setContextMenuPositionY(position_y);

      setContextMenuOnLoad(true);
    },
    []
  );
  const unload_context_menu = useCallback(() => {
    setContextMenuOnLoad(false);
    setContextMenuPositionX(-999);
    setContextMenuPositionY(-999);
    setSourceComponentId(null);
  }, []);
  /* { Context Menu } -------------------------------------------------------------------------------- */

  /* { Drag and Drop Panel } ========================================================================= */
  const [onDrag, setOnDrag] = useState(false);
  const [dragPositionX, setDragPositionX] = useState(-1);
  const [dragPositionY, setDragPositionY] = useState(-1);

  const item_on_drag = (event) => {
    const handleMouseUp = (event) => {
      setOnDrag(false);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    const handleMouseMove = (event) => {
      const position_x = event.clientX;
      const position_y = event.clientY;

      setDragPositionX(position_x);
      setDragPositionY(position_y);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.style.cursor = "none";
    unload_context_menu();
    setOnDrag(true);
  };
  /* { Drag and Drop Panel } ========================================================================= */

  return (
    <RootCommandContexts.Provider
      value={{
        cmd,
        push_command_by_id,
        pop_command_by_id,

        /* { Context Menu } ------------------------- */
        contextMenuPositionX,
        contextMenuPositionY,
        sourceComponentId,
        contextStructure,
        load_context_menu,
        unload_context_menu,
        /* { Context Menu } ------------------------- */
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
