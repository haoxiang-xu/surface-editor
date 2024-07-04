import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../../../ICONs/icon_manager";

const StackDivCloseButton = ({}) => {
  /* Load ICON manager ------------------------------------------------------------------------------ */
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
  /* Load ICON manager ------------------------------------------------------------------------------ */

  const [isHover, setIsHover] = useState(false);
  const [isOnClick, setIsOnClick] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({
    transition: "all 0.2s ease",
    backgroundColor: "rgba(0, 0, 0, 0)",
    boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  });

  useEffect(() => {
    if (isOnClick) {
      setButtonStyle({
        transition: "all 0s",
        backgroundColor: "#444444",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    } else if (isHover) {
      setButtonStyle({
        transition: "all 0.2s ease",
        backgroundColor: "#2E2E2E",
        boxShadow: "0px 4px 12px 4px rgba(0, 0, 0, 0.16)",
      });
    } else {
      setButtonStyle({
        transition: "all 0.2s ease",
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    }
  }, [isHover, isOnClick]);

  return (
    <img
      src={SYSTEM_ICON_MANAGER.close.ICON512}
      style={{
        /* ANIMATION ------------- */
        transition: buttonStyle.transition,

        /* POSITION -------------- */
        position: "absolute",
        top: "5px",
        left: "5px",

        /* SIZE ------------------ */
        width: "12px",
        height: "12px",

        /* STYLE ----------------- */
        borderRadius: "6px",
        padding: "9px",
        backgroundColor: buttonStyle.backgroundColor,
        boxShadow: buttonStyle.boxShadow,
      }}
      loading="lazy"
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsOnClick(false);
        setIsHover(false);
      }}
      onMouseDown={() => {
        setIsOnClick(true);
      }}
      onMouseUp={() => {
        setIsOnClick(false);
      }}
      onDrag={(e) => {
        setIsOnClick(false);
        setIsHover(false);
        e.stopPropagation();
        e.preventDefault();
      }}
      alt="close"
    />
  );
};

export default StackDivCloseButton;
