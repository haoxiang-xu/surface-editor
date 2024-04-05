import React, { useState, useEffect, useRef, useContext } from "react";
import VecoderEditorPage from "../DATA_MANAGERs/core_components_data_manager/core_components_data_manager";
import HeaderMenuBar from "../COMPONENTs/headerMenuBar/headerMenuBar";
import { SYSTEM_FRAME_BORDER, SYSTEM_FRAME_BORDER_RADIUS } from "../CONSTs/systemFrameStyling";
import "./home.css";

const Home = () => {
  const [isFrameMaximized, setIsFrameMaximized] = useState(false);
  const [isMenuBarHovered, setIsMenuBarHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (cursorPosition.y > 48) {
      setIsMenuBarHovered(false);
    }
    if (cursorPosition.y < 16) {
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
        transition: "border-radius 0.3s",
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
        style={{ top: isMenuBarHovered ? "29px" : "0px" }}
      >
        <VecoderEditorPage />
      </div>
    </div>
  );
};

export default Home;
