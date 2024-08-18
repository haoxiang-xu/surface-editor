import React, { useState, useCallback, useEffect } from "react";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react";
import { RootCommandContexts } from "./root_command_contexts";
import ContextMenu from "../../BUILTIN_COMPONENTs/context_menu/context_menu";
import GhostImage from "../../BUILTIN_COMPONENTs/ghost_image/ghost_image";

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

      if (!cmd[id] || cmd[id].length === 0) {
        return popped_command;
      }

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

  /* { Drag and Drop } =============================================================================== */
  const [onDrag, setOnDrag] = useState(false);
  const [onDragItem, setOnDragItem] = useState(null);

  const item_on_drag = (event, on_drag_item) => {
    event.stopPropagation();
    setOnDragItem(on_drag_item);
    setOnDrag(true);

    unload_context_menu();
  };
  const item_on_drop = (event) => {
    event.stopPropagation();
    setOnDrag(false);
    setOnDragItem(null);
  };
  /* { Drag and Drop } =============================================================================== */

  /* { Global Key Event Listener } =================================================================== */
  const [pressedKeys, setPressedKeys] = useState(new Set());
  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prev) => new Set(prev).add(event.key));
    };
    const handleKeyUp = (event) => {
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.delete(event.key);
      setPressedKeys(newPressedKeys);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  /* { Global Key Event Listener } =================================================================== */

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

        /* { Drag and Drop } ------------------------ */
        onDrag,
        setOnDrag,
        onDragItem,
        setOnDragItem,
        item_on_drag,
        item_on_drop,
        /* { Drag and Drop } ------------------------ */

        /* { Global Key Event Listener } ------------ */
        pressedKeys,
        /* { Global Key Event Listener } ------------ */
      }}
    >
      <div onClick={unload_context_menu}>
        {children}
        {contextMenuOnLoad ? <ContextMenu /> : null}
        {onDrag ? <GhostImage onDragItem={onDragItem} /> : null}
      </div>
    </RootCommandContexts.Provider>
  );
};

export default RootCommandManager;
