import React, { useState, useRef, useEffect } from "react";

const TestingWrapper = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: "#1E1E1E",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
const FAKE_TAG_DATA = {
  type: "key",
  value: "tag.js",
};

/* { Tag types } ================================================================================= */
const KeyTag = ({ type, value }) => {
  const spanRef = useRef(null);
  const [style, setStyle] = useState({});
  useEffect(() => {
    if (!spanRef.current) return;
    const spanWidth = spanRef.current.offsetWidth;
    const spanHeight = spanRef.current.offsetHeight;
    setStyle({
      width: spanWidth + 9,
      height: spanHeight + 11,
    });
  }, [spanRef]);

  return (
    <div
      style={{
        /* { Tag Position } ------------------------ */
        position: "absolute",
        top: 0,
        left: 0,

        /* { Tag Size } ---------------------------- */
        width: style.width,
        height: style.height,

        /* { Tag Styling } ------------------------- */
        borderRadius: 4,
        display: "inline-block",
        backgroundColor: "#4A4A4A",
        overflow: "hidden",
      }}
    >
      <span
        ref={spanRef}
        style={{
          /* { Tag Position } ------------------------ */
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          /* { Font Styling } ---------------------- */
          fontFamily: "monospace",
          fontSize: 11,
          color: "#CCCCCC",
          userSelect: "none",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        {value}
      </span>
    </div>
  );
};
const FileTag = ({ type, value }) => {
  const spanRef = useRef(null);
  const [style, setStyle] = useState({});
  useEffect(() => {
    if (!spanRef.current) return;
    const spanWidth = spanRef.current.offsetWidth;
    const spanHeight = spanRef.current.offsetHeight;
    setStyle({
      width: spanWidth + 9,
      height: spanHeight + 11,
    });
  }, [spanRef]);

  return (
    <div
      style={{
        /* { Tag Position } ------------------------ */
        position: "absolute",
        top: 0,
        left: 0,

        /* { Tag Size } ---------------------------- */
        width: style.width,
        height: style.height,

        /* { Tag Styling } ------------------------- */
        borderRadius: 4,
        display: "inline-block",
        backgroundColor: "#323232",
        overflow: "hidden",
      }}
    >
      <span
        ref={spanRef}
        style={{
          /* { Tag Position } ------------------------ */
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          /* { Font Styling } ---------------------- */
          fontFamily: "monospace",
          fontSize: 11,
          color: "#CCCCCC",
          userSelect: "none",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        {value}
      </span>
    </div>
  );
};
/* { Tag types } ================================================================================= */

const Tag = () => {
  const render_tag = () => {
    switch (FAKE_TAG_DATA.type) {
      case "key":
        return <KeyTag {...FAKE_TAG_DATA} />;
      case "file":
        return <FileTag {...FAKE_TAG_DATA} />;
      default:
        return null;
    }
  };

  return <TestingWrapper>{render_tag()}</TestingWrapper>;
};

export default Tag;
