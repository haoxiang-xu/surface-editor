import React, { useState, useEffect, useRef, useContext } from "react";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";

const FAKE_DATA = {
  error_message: "This is a fake error message.",
};

const default_z_index = 64;
const default_border_radius = 12;
const default_background_R = 30;
const default_background_G = 30;
const default_background_B = 30;

const default_font_color = "#CCCCCC";
const default_box_shadow = "0 2px 12px rgba(0, 0, 0, 0.2)";

const default_button_boder = 5;
const default_button_padding_x = 4;
const default_button_padding_y = 2;

const Button = ({ label, onClick }) => {
  const labelRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(() => {
    if (labelRef.current) {
      setButtonWidth(labelRef.current.offsetWidth);
      setButtonHeight(labelRef.current.offsetHeight);
    }
  }, [labelRef.current]);

  return (
    <div
      style={{
        /* Position ----------------------- */
        position: "absolute",
        bottom: "5%",
        left: "50%",
        transform: "translate(-50%, 0%)",

        /* Size --------------------------- */
        width: buttonWidth + 2 * default_button_padding_x,
        height: buttonHeight + 2 * default_button_padding_y,

        /* Style --------------------------- */
        borderRadius: default_button_boder,
        backgroundColor: `rgba(${default_background_R + 16}, ${
          default_background_G + 16
        }, ${default_background_B + 16}, 1)`,
      }}
      onMouseUp={onClick}
    >
      <span
        ref={labelRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
          userSelect: "none",

          color: default_font_color,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const Alert = ({ error_message }) => {
  const { unload_alert } = useContext(RootCommandContexts);

  return (
    <div
      style={{
        /* Position ----------------------- */
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        /* Size --------------------------- */
        width: 256,
        height: 128,

        /* Style --------------------------- */
        border: `1px solid rgba(${default_background_R + 64}, ${
          default_background_G + 64
        }, ${default_background_B + 64}, 1)`,
        borderRadius: default_border_radius,
        zIndex: default_z_index,
        backgroundColor: `rgba(${default_background_R}, ${default_background_G}, ${default_background_B}, 1)`,
        boxShadow: default_box_shadow,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          color: default_font_color,
        }}
      >
        {error_message}
      </span>
      <Button label={"close"} onClick={unload_alert}/>
    </div>
  );
};

export default Alert;
