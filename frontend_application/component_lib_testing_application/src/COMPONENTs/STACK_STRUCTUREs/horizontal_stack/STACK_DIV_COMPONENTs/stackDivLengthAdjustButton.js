import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../../../ICONs/icon_manager";

const StackDivLengthAdjustButton = ({
  mode,
  //Maximize and Minimize Container
  onMaximizeOnClick,
  onMinimizeOnClick,
}) => {
  /* Load ICON manager --------------------------------------------------------------------------------- */
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

  const [isMaxOnHover, setIsMaxOnHover] = useState(false);
  const [isMinOnHover, setIsMinOnHover] = useState(false);
  const [isMaxOnClick, setIsMaxOnClick] = useState(false);
  const [isMinOnClick, setIsMinOnClick] = useState(false);

  const [MaximizeStyling, setMaximizeStyling] = useState({
    opacity: 1,
    zIndex: 0,
    padding: "9px 3px 9px 0px",
    left: 55,
    backgroundColor: "rgba(0, 0, 0, 0)",
    boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  });
  const [MinimizeStyling, setMinimizeStyling] = useState({
    opacity: 1,
    zIndex: 0,
    padding: "9px 0px 9px 3px",
    left: 40,
    backgroundColor: "rgba(0, 0, 0, 0)",
    boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  });

  useEffect(() => {
    if (isMaxOnClick) {
      setMaximizeStyling({
        opacity: 1,
        zIndex: 1,
        padding: "9px 4px 9px 4px",
        left: 50,
        backgroundColor: "#444444",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
      setMinimizeStyling({
        opacity: 0.16,
        zIndex: 0,
        left: 40,
        padding: "9px 0px 9px 0px",
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    } else if (isMinOnClick) {
      setMaximizeStyling({
        opacity: 0.16,
        zIndex: 0,
        padding: "9px 0px 9px 0px",
        left: 58,
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
      setMinimizeStyling({
        opacity: 1,
        zIndex: 1,
        left: 40,
        padding: "9px 4px 9px 4px",
        backgroundColor: "#444444",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    } else if (isMaxOnHover) {
      setMaximizeStyling({
        opacity: 1,
        zIndex: 1,
        padding: "9px 4px 9px 4px",
        left: 50,
        backgroundColor: "#2E2E2E",
        boxShadow: "0px 4px 12px 4px rgba(0, 0, 0, 0.16)",
      });
      setMinimizeStyling({
        opacity: 0.16,
        zIndex: 0,
        left: 40,
        padding: "9px 0px 9px 0px",
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    } else if (isMinOnHover) {
      setMaximizeStyling({
        opacity: 0.16,
        zIndex: 0,
        padding: "9px 0px 9px 0px",
        left: 58,
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
      setMinimizeStyling({
        opacity: 1,
        zIndex: 1,
        left: 40,
        padding: "9px 4px 9px 4px",
        backgroundColor: "#2E2E2E",
        boxShadow: "0px 4px 12px 4px rgba(0, 0, 0, 0.16)",
      });
    } else {
      setMaximizeStyling({
        opacity: 1,
        zIndex: 0,
        padding: "9px 3px 9px 0px",
        left: 55,
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
      setMinimizeStyling({
        opacity: 1,
        zIndex: 0,
        padding: "9px 0px 9px 3px",
        left: 40,
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      });
    }
  }, [isMaxOnHover, isMinOnHover, isMaxOnClick, isMinOnClick]);

  return mode === "HORIZONTAL" ? (
    <>
      <img
        src={SYSTEM_ICON_MANAGER.rightArrow.ICON512}
        style={{
          /* ANIMATION ------------- */
          transition: "all 0.2s ease",

          /* POSITION -------------- */
          position: "absolute",
          top: "5px",
          left: MaximizeStyling.left,
          zIndex: MaximizeStyling.zIndex,

          /* SIZE ------------------ */
          width: "12px",
          height: "12px",

          /* STYLE ----------------- */
          borderRadius: "6px",
          padding: MaximizeStyling.padding,
          opacity: MaximizeStyling.opacity,
          backgroundColor: MaximizeStyling.backgroundColor,
          boxShadow: MaximizeStyling.boxShadow,
        }}
        onMouseEnter={() => {
          setIsMaxOnHover(true);
          setIsMinOnHover(false);
        }}
        onMouseLeave={() => {
          setIsMaxOnHover(false);
          setIsMaxOnClick(false);
        }}
        onMouseDown={() => {
          setIsMaxOnClick(true);
        }}
        onMouseUp={() => {
          setIsMaxOnClick(false);
        }}
        onDrag={(e) => {
          setIsMaxOnClick(false);
          setIsMaxOnHover(false);
          setIsMinOnClick(false);
          setIsMinOnHover(false);
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={onMaximizeOnClick}
        alt="maximize"
      />
      <img
        src={SYSTEM_ICON_MANAGER.leftArrow.ICON512}
        style={{
          /* ANIMATION ------------- */
          transition: "all 0.2s ease",

          /* POSITION -------------- */
          position: "absolute",
          top: "5px",
          left: MinimizeStyling.left,
          zIndex: MinimizeStyling.zIndex,

          /* SIZE ------------------ */
          width: "12px",
          height: "12px",

          /* STYLE ----------------- */
          borderRadius: "6px",
          padding: MinimizeStyling.padding,
          opacity: MinimizeStyling.opacity,
          backgroundColor: MinimizeStyling.backgroundColor,
          boxShadow: MinimizeStyling.boxShadow,
        }}
        onMouseEnter={() => {
          setIsMinOnHover(true);
          setIsMaxOnHover(false);
        }}
        onMouseLeave={() => {
          setIsMinOnHover(false);
          setIsMinOnClick(false);
        }}
        onMouseDown={() => {
          setIsMinOnClick(true);
        }}
        onMouseUp={() => {
          setIsMinOnClick(false);
        }}
        onDrag={(e) => {
          setIsMaxOnClick(false);
          setIsMaxOnHover(false);
          setIsMinOnClick(false);
          setIsMinOnHover(false);
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={onMinimizeOnClick}
        alt="minimize"
      />
    </>
  ) : (
    <>
      <img
        src={SYSTEM_ICON_MANAGER.rightArrow.ICON512}
        style={{
          /* ANIMATION ------------- */
          transition: "all 0.2s ease",

          /* POSITION -------------- */
          position: "absolute",
          top: "40px",
          left: "5px",

          /* SIZE ------------------ */
          width: "12px",
          height: "12px",

          /* STYLE ----------------- */
          borderRadius: "6px",
          padding: "9px",
          opacity: MaximizeStyling.opacity,
          backgroundColor: MaximizeStyling.backgroundColor,
          boxShadow: MaximizeStyling.boxShadow,
        }}
        onMouseEnter={() => {
          setIsMaxOnHover(true);
          setIsMinOnHover(false);
        }}
        onMouseLeave={() => {
          setIsMaxOnHover(false);
          setIsMaxOnClick(false);
        }}
        onMouseDown={() => {
          setIsMaxOnClick(true);
        }}
        onMouseUp={() => {
          setIsMaxOnClick(false);
        }}
        onDrag={(e) => {
          setIsMaxOnClick(false);
          setIsMaxOnHover(false);
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={onMaximizeOnClick}
        alt="maximize"
      />
    </>
  );
};

export default StackDivLengthAdjustButton;
