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
          left: "calc(0% + 20px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
const FAKE_TAG_DATA = {
  type: "file",
  label: `context_menu_fixed_styling_config.js`,
};

const default_max_tag_width = 128;
const default_tag_padding_x = 6;
const default_tag_padding_y = 3;

/* { Tag types } ================================================================================= */
const CustomizedTag = ({ label, style }) => {
  const containerRef = useRef(null);
  const spanRef = useRef(null);

  const [tagStyle, setTagStyle] = useState(style);
  const [tagMaxWidth, setTagMaxWidth] = useState(
    style.maxWidth || default_max_tag_width
  );
  const [onHover, setOnHover] = useState(null);

  useEffect(() => {
    if (!spanRef.current || !containerRef.current) return;
    const spanWidth = spanRef.current.offsetWidth;
    const spanHeight = spanRef.current.offsetHeight;
    const containerWidth = Math.min(spanWidth, tagMaxWidth);
    setTagStyle((prevData) => {
      return {
        ...prevData,
        width: onHover
          ? spanWidth + default_tag_padding_x * 2
          : containerWidth + default_tag_padding_x * 2,
        height: spanHeight + default_tag_padding_y * 2,
        left: `calc(0% + ${default_tag_padding_x}px)`,
        transform: "translate(0%, -50%)",
        moreOptionLabel: onHover ? false : spanWidth > containerWidth,
      };
    });
  }, [spanRef, containerRef, onHover]);

  return (
    <div
      ref={containerRef}
      style={{
        transition: "width 0.12s cubic-bezier(0.32, 0.96, 0.32, 1.08)",

        /* { Tag Position } ------------------------ */
        position: "absolute",
        top: 0,
        left: 0,

        /* { Tag Size } ---------------------------- */
        width: tagStyle.width,
        height: tagStyle.height,

        /* { Tag Styling } ------------------------- */
        borderRadius: 7,
        display: "inline-block",
        backgroundColor: tagStyle.backgroundColor,
        overflow: "hidden",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <span
        ref={spanRef}
        style={{
          /* { Tag Position } ---------------------- */
          position: "absolute",
          top: "50%",
          left: tagStyle.left,
          transform: tagStyle.transform,

          /* { Font Styling } ---------------------- */
          fontFamily: "monospace",
          fontSize: 11,

          /* { Tag Styling } ----------------------- */
          color: tagStyle.color,
          userSelect: "none",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        {label}
      </span>
      <span
        style={{
          /* { Tag Position } --------------------- */
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translate(0%, -50%)",

          maxWidth: tagStyle.moreOptionLabel ? "none" : 0,

          /* { Font Styling } ---------------------- */
          fontFamily: "monospace",
          fontSize: 11,

          /* { Tag Styling } ----------------------- */
          padding: "0px 4px",
          color: tagStyle.color,
          backgroundColor: tagStyle.backgroundColor,
          userSelect: "none",
          whiteSpace: "nowrap",
          display: tagStyle.moreOptionLabel ? "inline-block" : "none",
        }}
      >
        {"..."}
      </span>
    </div>
  );
};
const KeyTag = ({ label }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#4A4A4A",
        color: "#CCCCCC",
      }}
    />
  );
};
const FileTag = ({ label }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#8C8C8C",
        color: "#181818",
      }}
    />
  );
};
const StringTag = ({ label }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#4A4A4A",
        color: "#8C8C8C",
      }}
    />
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
      case "string":
        return <StringTag {...FAKE_TAG_DATA} />;
      default:
        return null;
    }
  };

  return <TestingWrapper>{render_tag()}</TestingWrapper>;
};

export default Tag;
