import React, { useState } from "react";
import ContextMenu from "../../COMPONENTs/rightClickContextMenu/rightClickContextMenu";
import { rightClickContextMenuCommandContexts } from "../../CONTEXTs/rightClickContextMenuContexts";

const CommandDataManager = ({ children }) => {
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [rightClickX, setRightClickX] = useState(-1);
  const [rightClickY, setRightClickY] = useState(-1);
  const [onRightClickItem, setOnRightClickItem] = useState(null);
  const [rightClickCommand, setRightClickCommand] = useState(null);
  const handleRightClick = (event) => {
    event.preventDefault();
    setIsRightClicked(true);

    const rightClickX = event.clientX;
    const rightClickY = event.clientY;

    setRightClickX(rightClickX);
    setRightClickY(rightClickY);
  };
  const handleLeftClick = (event) => {
    setIsRightClicked(false);
    setOnRightClickItem(null);
  };

  return (
    <rightClickContextMenuCommandContexts.Provider
      value={{
        isRightClicked,
        setIsRightClicked,
        rightClickX,
        rightClickY,
        onRightClickItem,
        setOnRightClickItem,
        rightClickCommand,
        setRightClickCommand,
        handleRightClick,
        handleLeftClick,
      }}
    >
      {children}
      {/* {isRightClicked ? <ContextMenu /> : <div></div>} */}
    </rightClickContextMenuCommandContexts.Provider>
  );
};

export default CommandDataManager;
