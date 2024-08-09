import React, { useState, useRef, useEffect } from "react";

/*




type: stacking, timing, center, customize_position
title: "String variable",
buttons: [{
    label: "Confirm",
    clicable: true,
    icon: url,
}]
*/

const default_font_size = 12;
const default_R = 30;
const default_G = 30;
const default_B = 30;

const Alert = ({
  display,
  setDisplay,
  alertPosition,
  label,
  icons,
  buttons,
}) => {
  const [buttonOnHover, setButtonOnHover] = useState(false);
  const button_labels = ["label1", "label2"];

  return (
    <div
      style={{
        position: "fixed",
        top: alertPosition.y,
        left: alertPosition.x,
        transform: "translate(-50%, -50%)",

        width: "400px",
        height: "200px",
        backgroundColor: `rgba(${default_R + 32}, ${default_G + 32}, ${
          default_B + 32
        }, 1)`,
        boxShadow: "0px 0px 16px 8px rgba(0, 0, 0, 0.64)",
        borderRadius: "12px",
        display: display ? "flex" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "16px",
          bottom: "16px",

          backgroundColor: buttonOnHover
            ? "rgba(255, 0, 0, 1)"
            : "rgba(255, 0, 0, 0.64)",
          padding: "8px 64px",
          borderRadius: "8px",
        }}
        onMouseUp={() => {
          setDisplay(false);
        }}
        onMouseEnter={() => {
          setButtonOnHover(true);
        }}
        onMouseLeave={() => {
          setButtonOnHover(false);
        }}
      >
        Confirm
      </div>
      {label}
    </div>
  );
};

export default Alert;
