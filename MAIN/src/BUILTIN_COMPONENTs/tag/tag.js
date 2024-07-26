import React, { useState, useRef, useEffect } from "react";

const default_max_tag_width = 128;
const default_tag_padding_x = 6;
const default_tag_padding_y = 3;

const default_tag_font_size = 11;

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
        right: style.right,
        left: style.left,
        top: style.top,
        bottom: style.bottom,
        transform: style.transform,

        /* { Tag Size } ---------------------------- */
        width: tagStyle.width,
        height: tagStyle.height,

        /* { Tag Styling } ------------------------- */
        borderRadius: style.borderRadius || 7,
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
          fontSize: tagStyle.fontSize || default_tag_font_size,

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
          fontSize: tagStyle.fontSize || default_tag_font_size,

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
const ShortCutTag = ({ label, style }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        color: "rgba(255, 255, 255, 0.16)",
        fontSize: style.fontSize || default_tag_font_size,
        left: style.left,
        right: style.right,
        top: style.top,
        bottom: style.bottom,
        transform: style.transform || 'none',
        borderRadius: style.borderRadius || `none`,
      }}
    />
  );
};
const KeyTag = ({ label, style }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#4A4A4A",
        color: "#CCCCCC",
        fontSize: style.fontSize || default_tag_font_size,
        left: style.left || 'none',
        right: style.right || 'none',
        top: style.top || 'none',
        bottom: style.bottom || 'none',
        transform: style.transform || 'none',
        borderRadius: style.borderRadius || `none`,
      }}
    />
  );
};
const FileTag = ({ label, style }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#8C8C8C",
        color: "#181818",
        fontSize: style.fontSize || default_tag_font_size,
        left: style.left || 'none',
        right: style.right || 'none',
        top: style.top || 'none',
        bottom: style.bottom || 'none',
        transform: style.transform || 'none',
        borderRadius: style.borderRadius || `none`,
      }}
    />
  );
};
const StringTag = ({ label, style }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#4A4A4A",
        color: "#8C8C8C",
        fontSize: style.fontSize || default_tag_font_size,
        left: style.left || 'none',
        right: style.right || 'none',
        top: style.top || 'none',
        bottom: style.bottom || 'none',
        transform: style.transform || 'none',
        borderRadius: style.borderRadius || `none`,
      }}
    />
  );
};
const CommandTag = ({ label, style }) => {
  return (
    <CustomizedTag
      label={label}
      style={{
        backgroundColor: "#EF6C00",
        color: "#181818",
        fontSize: style.fontSize || default_tag_font_size,
        left: style.left || 'none',
        right: style.right || 'none',
        top: style.top || 'none',
        bottom: style.bottom || 'none',
        transform: style.transform || 'none',
        borderRadius: style.borderRadius || `none`,
      }}
    />
  );
};
/* { Tag types } ================================================================================= */

const Tag = ({ config }) => {
  const render_tag = () => {
    switch (config.type) {
      case "shortcut":
        return <ShortCutTag {...config} />;
      case "key":
        return <KeyTag {...config} />;
      case "file":
        return <FileTag {...config} />;
      case "string":
        return <StringTag {...config} />;
      case "command":
        return <CommandTag {...config} />;
      default:
        return null;
    }
  };
  return render_tag();
};

export default Tag;
