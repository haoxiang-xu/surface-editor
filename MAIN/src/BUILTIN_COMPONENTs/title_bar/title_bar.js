import React, { useState, useEffect, useContext } from "react";

import { TitleBarContexts } from "./title_bar_contexts";
import { RootConfigContexts } from "../../DATA_MANAGERs/root_config_manager/root_config_contexts";

import Icon from "../icon/icon";

const default_title_bar_style = {
  padding: 5,
  height: 40,
};
const default_button_style = {
  width: 36,
  height: 30,
  outterBorderRadius: 5,
  innerBorderRadius: 2,
  backLayer: 0,
  frontLayer: 1,
};

const Win32ControlPanelButton = ({
  title,
  position,
  borderRadius,
  handleOnClick,
  color,
}) => {
  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [zIndex, setZIndex] = useState(default_button_style.backLayer);
  const { R, G, B, on_hover, on_click } = useContext(RootConfigContexts);
  const [backgroundColor, setBackgroundColor] = useState(
    `rgba(${R}, ${G}, ${B}, 1)`
  );

  const [boxShadow, setBoxShadow] = useState("0px 0px 0px 0px rgba(0,0,0,0)");

  useEffect(() => {
    if (onClick) {
      setBoxShadow("0px 0px 0px 0px rgba(0,0,0,0)");
      setBackgroundColor(on_click(color.R, color.G, color.B));
    } else if (onHover) {
      setBoxShadow("0 2px 12px rgba(0, 0, 0, 0.32)");
      setBackgroundColor(on_hover(color.R, color.G, color.B));
    } else {
      setBoxShadow("0px 0px 0px 0px rgba(0,0,0,0)");
      setBackgroundColor(`rgba(${R}, ${G}, ${B}, 1)`);
    }
  }, [onHover, onClick]);

  return (
    <div
      style={{
        transition: "background-color 0.12s cubic-bezier(0.32, 1, 0.32, 1)",
        position: "absolute",
        top: default_title_bar_style.padding,
        right: position.right,
        zIndex: zIndex,

        width: default_button_style.width,
        height: default_button_style.height,

        borderRadius: borderRadius,
        boxSizing: "border-box",

        userSelect: "none",
        backgroundColor: backgroundColor,
        boxShadow: boxShadow,
      }}
      onMouseEnter={() => {
        setOnHover(true);
        setOnClick(false);
      }}
      onMouseLeave={() => {
        setOnHover(false);
        setOnClick(false);
      }}
      onMouseDown={() => {
        setOnClick(true);
        setOnHover(false);
      }}
      onMouseUp={() => {
        setOnClick(false);
        setOnHover(true);
        handleOnClick();
      }}
    >
      <Icon
        src={title}
        draggable={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: 20,
          height: 20,

          opacity: 0.5,
          userSelect: "none",
        }}
      />
    </div>
  );
};
const Win32ControlPanel = () => {
  const { isWindowMaximized, handleClose, handleMinimize, handleMaximize } =
    useContext(TitleBarContexts);
  const { R, G, B } = useContext(RootConfigContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width:
          default_title_bar_style.padding * 2 + default_button_style.width * 3,
        height: default_title_bar_style.height,

        boxSizing: "border-box",
        WebkitAppRegion: "no-drag",
        // border: "1px solid #FFFFFF",
      }}
    >
      <Win32ControlPanelButton
        title={"close"}
        position={{ right: default_title_bar_style.padding }}
        color={{ R: 150, G: 16, B: 4 }}
        handleOnClick={handleClose}
        borderRadius={`${default_button_style.innerBorderRadius}px ${
          isWindowMaximized
            ? default_button_style.innerBorderRadius
            : default_button_style.outterBorderRadius
        }px ${default_button_style.innerBorderRadius}px ${
          default_button_style.innerBorderRadius
        }px`}
      />
      {!isWindowMaximized ? (
        <Win32ControlPanelButton
          title={"win32_maximize"}
          position={{
            right: default_title_bar_style.padding + default_button_style.width,
          }}
          handleOnClick={handleMaximize}
          color={{ R, G, B }}
          borderRadius={`${default_button_style.innerBorderRadius}px`}
        />
      ) : (
        <Win32ControlPanelButton
          title={"win32_restore"}
          position={{
            right: default_title_bar_style.padding + default_button_style.width,
          }}
          handleOnClick={handleMaximize}
          color={{ R, G, B }}
          borderRadius={`${default_button_style.innerBorderRadius}px`}
        />
      )}
      <Win32ControlPanelButton
        title={"win32_minimize"}
        position={{
          right:
            default_title_bar_style.padding + default_button_style.width * 2,
        }}
        handleOnClick={handleMinimize}
        color={{ R, G, B }}
        borderRadius={`${default_button_style.innerBorderRadius}px`}
      />
    </div>
  );
};
const TitleBar = React.memo(({ isWindowMaximized }) => {
  const handleClose = () => {
    window.rootEventListenerAPI.windowStateEventHandler("close");
  };
  const handleMinimize = () => {
    window.rootEventListenerAPI.windowStateEventHandler("minimize");
  };
  const handleMaximize = () => {
    window.rootEventListenerAPI.windowStateEventHandler("maximize");
  };

  const render_title_bar = () => {
    switch (window.osInfo.platform) {
      case "win32":
        return <Win32ControlPanel />;
      case "darwin":
        return null;
    }
  };

  return (
    <TitleBarContexts.Provider
      value={{
        isWindowMaximized,
        handleClose,
        handleMinimize,
        handleMaximize,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: default_title_bar_style.height,

          // border: "1px solid #FFFFFF",
          borxSizing: "border-box",
          WebkitAppRegion: "drag",
        }}
      >
        {render_title_bar()}
      </div>
    </TitleBarContexts.Provider>
  );
});

export default TitleBar;
