import React, { useState, useEffect, useRef, useContext } from "react";
import RootDataManager from "../DATA_MANAGERs/root_data_manager/root_data_manager";
import RootCommandManager from "../DATA_MANAGERs/root_command_manager/root_command_manager";
import CommandDataManager from "../DATA_MANAGERs/command_data_manager/command_data_manager";
import HeaderMenuBar from "../COMPONENTs/headerMenuBar/headerMenuBar";
import HorizontalStack from "../STACK_STRUCTUREs/horizontal_stack/horizontal_stack";
import {
  SYSTEM_FRAME_BORDER,
  SYSTEM_FRAME_BORDER_RADIUS,
} from "../CONSTs/systemFrameStyling";
import "./home.css";

const Home = () => {
  const [isFrameMaximized, setIsFrameMaximized] = useState(false);
  const [isMenuBarHovered, setIsMenuBarHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (cursorPosition.y > 48) {
      setIsMenuBarHovered(false);
    }
    if (cursorPosition.y < 16 && cursorPosition.y > 0) {
      setIsMenuBarHovered(true);
    }
  }, [cursorPosition]);
  const handleMouseMove = (event) => {
    setCursorPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };
  useEffect(() => {
    window.electronAPI.subscribeToWindowStateChange(({ isMaximized }) => {
      setIsFrameMaximized(isMaximized);
    });
  }, []);
  return (
    <div
      className="main_container0315"
      onMouseMove={handleMouseMove}
      style={{
        transition: "border-radius 0.12s, border 0.12s",
        borderRadius: isFrameMaximized ? "0px" : SYSTEM_FRAME_BORDER_RADIUS,
        border: isFrameMaximized ? "none" : SYSTEM_FRAME_BORDER,
      }}
    >
      <HeaderMenuBar
        isFrameMaximized={isFrameMaximized}
        setIsFrameMaximized={setIsFrameMaximized}
        isMenuBarHovered={isMenuBarHovered}
        setIsMenuBarHovered={setIsMenuBarHovered}
        cursorPosition={cursorPosition}
      />
      <div
        className="major_content_container0316"
        style={{ top: isMenuBarHovered || isFrameMaximized ? "29px" : "0px" }}
      >
        <RootDataManager>
          <CommandDataManager>
            <RootCommandManager>
              <HorizontalStack />
            </RootCommandManager>
          </CommandDataManager>
        </RootDataManager>
      </div>
    </div>
  );
};

export default Home;