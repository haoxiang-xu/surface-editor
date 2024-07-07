import React from "react";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_context";

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
  
  return <></>;
};

export default ContextMenu;
