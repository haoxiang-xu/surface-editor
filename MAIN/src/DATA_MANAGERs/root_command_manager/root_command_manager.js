import React, { useState, useContext } from "react";
import { RootCommandContexts } from "./root_command_context";
import ContextMenu from "../../COMPONENTs/context_menu/context_menu";

const RootCommandManager = ({ children }) => {
  const [command, setCommand] = useState({});

  /* { Context Menu } -------------------------------------------------------------------------------- */
  const [contextMenuOnLoad, setContextMenuOnLoad] = useState(false);
  const [contextMenuPositionX, setContextMenuPositionX] = useState(-1);
  const [contextMenuPositionY, setContextMenuPositionY] = useState(-1);

  const loadContextMenu = (event) => {
    event.preventDefault();
    setContextMenuOnLoad(true);

    const position_x = event.clientX;
    const position_y = event.clientY;

    setContextMenuPositionX(position_x);
    setContextMenuPositionY(position_y);
  };
  const unloadContextMenu = (event) => {
    setContextMenuOnLoad(false);
  };
  /* { Context Menu } -------------------------------------------------------------------------------- */

  const push_command_by_tag = (stack_component_unique_tag, command) => {
    setCommand((prevCommand) => {
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

    setCommand((prevCommand) => {
      const updatedCommand = { ...prevCommand };
      if (updatedCommand[stack_component_unique_tag].length > 0) {
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
        command,
        push_command_by_tag,
        pop_command_by_tag,

        /* { Context Menu } ------------------------- */
        contextMenuPositionX,
        contextMenuPositionY,
        loadContextMenu,
        unloadContextMenu,
      }}
    >
      {children}
      {contextMenuOnLoad ? <ContextMenu /> : null}
    </RootCommandContexts.Provider>
  );
};

export default RootCommandManager;
