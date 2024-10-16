import React, { useState, useEffect, useRef } from "react";

const R = 30;
const G = 30;
const B = 30;

const default_forground_color_offset = 12;
const default_font_color_offset = 128;
const default_font_size = 12;
const default_border_radius = 7;

const ChatBox = ({ content }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",

        transform: "translate(-50%, -50%)",

        /* { style } --------------------------------------------------------------------- */
        padding: `${default_font_size / 2}px ${default_font_size}px ${
          default_font_size / 2
        }px ${default_font_size}px`,
        borderRadius: `${default_border_radius}px`,
        backgroundColor: `rgb(${R + default_forground_color_offset}, ${
          G + default_forground_color_offset
        }, ${B + default_forground_color_offset})`,
        color: `rgb(${R + default_font_color_offset}, ${
          G + default_font_color_offset
        }, ${B + default_font_color_offset})`,
        boxShadow: `0px 4px 16px rgba(0, 0, 0, 0.16)`,
      }}
    >
      <span
        style={{
          fontSize: `${default_font_size}px`,
        }}
      >
        The error you’re encountering suggests that the version of Node.js
        (v23.0.0) is too new, and some native dependencies, such as node-pty,
        have not yet been updated to support it. To resolve this issue, you can
        try using an LTS (Long-Term Support) version of Node.js, like v18.x or
        v20.x, which is more likely to be compatible with the dependencies.
        Step-by-Step Solution 1. Switch to an LTS Version of Node.js Use nvm to
        install an LTS version, such as v20.x:
      </span>
    </div>
  );
};
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
      <ChatBox />
    </div>
  );
};

export default Chat;
