import React, { useState, useEffect, useRef } from "react";
import Span from "../../BUILTIN_COMPONENTs/span/span";

const R = 30;
const G = 30;
const B = 30;

const default_forground_color_offset = 12;
const default_font_color_offset = 128;
const default_font_size = 12;
const default_border_radius = 7;

const Chat = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",

        width: "100%",
        height: "100%",

        backgroundColor: `rgb(${R}, ${G}, ${B})`,
      }}
    >
      <Span>	1.	Wrapped CodeBlock in a div with the custom-scrollbar Class:</Span>
    </div>
  );
};

export default Chat;
