import React, { useState, useEffect, useMemo } from "react";

import RootDataManager from "../root_data_manager/root_data_manager";
import RootCommandManager from "../root_command_manager/root_command_manager";
import RootStackManager from "../root_stack_manager/root_stack_manager";

import { RootEventContexts } from "./root_event_contexts";

import TitleBar from "../../BUILTIN_COMPONENTs/title_bar/title_bar";
import {
  SYSTEM_FRAME_BORDER,
  SYSTEM_FRAME_BORDER_RADIUS,
} from "../../CONSTs/systemFrameStyling";

const MainStack = React.memo(() => {
  // console.log("RDM/REL/MainStack", new Date().getTime());
  const root_stack_manager = useMemo(() => <RootStackManager />, []);
  const root_command_manager = useMemo(
    () => <RootCommandManager>{root_stack_manager}</RootCommandManager>,
    []
  );
  return <RootDataManager>{root_command_manager}</RootDataManager>;
});

const RootEventListener = () => {
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [isOnTitleBar, setIsOnTitleBar] = useState(false);

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

  /* { Global Mouse Event Listener } ================================================================= */
  const [mouseActive, setMouseActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", () =>
      setMouseActive((prev) => {
        if (!prev) {
          return true;
        }
        return prev;
      })
    );
    window.addEventListener("mouseout", () => setMouseActive(false));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", () =>
        setMouseActive((prev) => {
          if (!prev) {
            return true;
          }
          return prev;
        })
      );
      window.removeEventListener("mouseout", () => setMouseActive(false));
    };
  }, []);
  /* { Global Mouse Event Listener } ================================================================= */

  useEffect(() => {
    if (isWindowMaximized) {
      setIsOnTitleBar(true);
      return;
    }
    setIsOnTitleBar((prev) => {
      if (!prev) {
        if (mousePosition.y <= 8 || (!mouseActive && mousePosition.y <= 64)) {
          return true;
        }
        return prev;
      } else {
        if (mousePosition.y > 36 && mouseActive) {
          return false;
        }
        return prev;
      }
    });
  }, [isWindowMaximized, mouseActive, mousePosition]);
  useEffect(() => {
    window.rootEventListenerAPI.windowStateEventListener(({ isMaximized }) => {
      setIsWindowMaximized(isMaximized);
    });
  }, []);
  useEffect(() => {
    window.rootEventListenerAPI.windowTitleBarEventHandler(isOnTitleBar);
  }, [isOnTitleBar]);

  return (
    <RootEventContexts.Provider
      value={{
        pressedKeys,
        mouseActive,
        mousePosition,
        isOnTitleBar,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",

          /* STYLE */
          backgroundColor: "#181818",
          boxSizing: "border-box",
          overflowY: "hidden",
          overflowX: "hidden",
          borderRadius: isWindowMaximized ? "0px" : SYSTEM_FRAME_BORDER_RADIUS,
          border: isWindowMaximized ? "none" : SYSTEM_FRAME_BORDER,
        }}
      >
        {isOnTitleBar ? (
          <TitleBar isWindowMaximized={isWindowMaximized} />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <MainStack />
        </div>
      </div>
    </RootEventContexts.Provider>
  );
};

export default RootEventListener;
