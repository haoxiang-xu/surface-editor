import React, { useState, useCallback, useEffect } from "react";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react";
import { RootCommandContexts } from "./root_command_contexts";
import ContextMenu from "../../BUILTIN_COMPONENTs/context_menu/context_menu";
import GhostImage from "../../BUILTIN_COMPONENTs/ghost_image/ghost_image";

const RootCommandManager = React.memo(({ children }) => {
  // console.log("RDM/RCM", new Date().getTime());
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
  const [onDropItem, setOnDropItem] = useState(null);
  const [onDragPosition, setOnDragPosition] = useState({ x: 0, y: 0 });

  const item_on_drag = useCallback((event, on_drag_item) => {
    if (event) {
      event.stopPropagation();
    }
    unload_context_menu();
    setOnDragItem(on_drag_item);
    setOnDrag(true);

    unload_context_menu();
  }, []);
  const item_on_drag_over = useCallback((event, on_drop_item) => {
    if (event) {
      event.stopPropagation();
    }
    setOnDropItem(on_drop_item);
  }, []);
  const item_on_drop = useCallback(
    (event) => {
      if (event) {
        event.stopPropagation();
      }
      if (onDragItem && onDropItem) {
        if (onDragItem.callback_to_delete) {
          onDragItem.callback_to_delete(onDragItem, onDropItem);
        }
        if (onDropItem.callback_to_append) {
          onDropItem.callback_to_append(onDragItem, onDropItem);
        }
      }

      setOnDrag(false);
      setOnDragItem(null);
      setOnDropItem(null);
      setOnDragPosition({ x: 0, y: 0 });
    },
    [onDragItem, onDropItem]
  );
  /* { Drag and Drop } =============================================================================== */

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
        onDragPosition,
        setOnDragPosition,
        item_on_drag,
        item_on_drag_over,
        item_on_drop,
        /* { Drag and Drop } ------------------------ */
      }}
    >
      <div onClick={unload_context_menu}>
        {children}
        {contextMenuOnLoad ? <ContextMenu /> : null}
        {onDrag ? <GhostImage onDragItem={onDragItem} /> : null}
      </div>
    </RootCommandContexts.Provider>
  );
});

export default RootCommandManager;
