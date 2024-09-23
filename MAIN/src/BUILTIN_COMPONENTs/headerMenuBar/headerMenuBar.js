import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../ICONs/icon_manager";
import "./headerMenuBar.css";

/* Load ICON manager --------------------------------------------------------------------------------- */
let FILE_TYPE_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  FILE_TYPE_ICON_MANAGER = ICON_MANAGER().FILE_TYPE_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
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
/* Load ICON manager --------------------------------------------------------------------------------- */

const HeaderMenuBar = ({
  isFrameMaximized,
  setIsFrameMaximized,
  isMenuBarHovered,
  setIsMenuBarHovered,
  cursorPosition,
}) => {
  const handleMenuBarOnHover = () => {
    setIsMenuBarHovered(true);
  };
  const handleClose = () => {
    window.electron.send("window-control", "close");
  };
  const handleMinimize = () => {
    window.electron.send("window-control", "minimize");
  };
  const handleMaximize = () => {
    window.electron.send("window-control", "maximize");
  };
  /* Darwin --------------------------------------------------------------------------------- */
  const [isDarwinIconOnHover, setIsDarwinIconOnHover] = useState(false);
  useEffect(() => {
    if (isFrameMaximized) {
      window.electronAPI.toggleWindowButtons(false);
    } else {
      window.electronAPI.toggleWindowButtons(!isMenuBarHovered);
    }
  }, [isMenuBarHovered, isFrameMaximized]);
  /* Darwin --------------------------------------------------------------------------------- */
  /* Win32 --------------------------------------------------------------------------------- */
  const [isWin32CloseIconOnHover, setIsWin32CloseIconOnHover] = useState(false);
  const [win32CloseIconOpacity, setWin32CloseIconOpacity] = useState(0.16);
  useEffect(() => {
    if (isWin32CloseIconOnHover) {
      setWin32CloseIconOpacity(1);
    } else if (isMenuBarHovered) {
      setWin32CloseIconOpacity(0.72);
    } else if (isFrameMaximized) {
      setWin32CloseIconOpacity(0.72);
    } else {
      setWin32CloseIconOpacity(0.16);
    }
  }, [isWin32CloseIconOnHover, isMenuBarHovered, isFrameMaximized]);
  /* Win32 --------------------------------------------------------------------------------- */
  const renderMenuBar = () => {
    switch (window.osInfo.platform) {
      case "darwin":
        return (
          <div className="header_menu_bar_container0316">
            <div
              className="header_menu_bar_darwin_overlay0316"
              onMouseEnter={() => {
                setIsDarwinIconOnHover(true);
              }}
              onMouseLeave={() => {
                setIsDarwinIconOnHover(false);
              }}
            ></div>
            <div
              className="header_menu_bar_darwin_container_dragging_area0316"
              style={{ height: isMenuBarHovered ? "40px" : "12px" }}
              onMouseOver={handleMenuBarOnHover}
            ></div>
          </div>
        );
      case "win32":
        return (
          <div className="header_menu_bar_container0316">
            <img
              src={SYSTEM_ICON_MANAGER.minimize.ICON512}
              className="header_menu_bar_minimize_icon0316"
              style={{
                opacity: isMenuBarHovered || isFrameMaximized ? 1 : 0.16,
              }}
              onClick={handleMinimize}
              draggable="false"
            />
            <img
              src={
                isFrameMaximized
                  ? SYSTEM_ICON_MANAGER.win32Unmaximize.ICON512
                  : SYSTEM_ICON_MANAGER.maximize.ICON512
              }
              className="header_menu_bar_maximize_icon0316"
              style={{
                opacity: isMenuBarHovered || isFrameMaximized ? 0.72 : 0.12,
              }}
              onClick={() => {
                handleMaximize();
              }}
              draggable="false"
            />
            <img
              src={SYSTEM_ICON_MANAGER.win32Close.ICON512}
              className="header_menu_bar_close_icon0316"
              style={{
                opacity: win32CloseIconOpacity,
                borderRadius: isFrameMaximized ? "3px" : "3px 5px 3px 3px",
              }}
              onClick={handleClose}
              onMouseEnter={() => {
                setIsMenuBarHovered(true);
              }}
              onMouseMove={() => {
                setIsWin32CloseIconOnHover(true);
              }}
              onMouseLeave={() => {
                setIsWin32CloseIconOnHover(false);
              }}
              draggable="false"
            />
            {/* <div
              className="header_menu_bar_file_button0316"
              style={{ opacity: isMenuBarHovered ? 1 : 0 }}
            >
              File
            </div> */}
            <div
              className="header_menu_bar_container_dragging_area0316"
              style={{ height: isMenuBarHovered ? "40px" : "12px" }}
              onMouseOver={handleMenuBarOnHover}
            ></div>
          </div>
        );
      default:
        return null;
    }
  };
  return renderMenuBar();
};

export default HeaderMenuBar;
