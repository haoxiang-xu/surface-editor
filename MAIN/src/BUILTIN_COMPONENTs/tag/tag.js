import React, { useState, useRef, useEffect } from "react";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import { ICON_MANAGER } from "../../ICONs/icon_manager";

/* { ICONs } ------------------------------------------------------------------------------------------------- */
let FILE_TYPE_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  FILE_TYPE_ICON_MANAGER = ICON_MANAGER().FILE_TYPE_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
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
/* { ICONs } ------------------------------------------------------------------------------------------------- */

const default_max_tag_width = 128;
const default_tag_padding_x = 6;
const default_tag_padding_y = 3;

const default_tag_font_size = 12;
const default_border_radius = 6;

const default_tag_layer = 8;
const more_option_label_font_size = 12;

/* { Tag types } ================================================================================= */
const CustomizedTag = ({
  reference,
  label,
  label_on_change,
  label_on_submit,
  style,
  icon,
}) => {
  const spanRef = useRef(null);
  const inputRef = useRef(null);
  const moreOptionLabelRef = useRef(null);

  const [tagStyle, setTagStyle] = useState(style);
  const [tagMaxWidth, setTagMaxWidth] = useState(style.maxWidth);
  const [inputMode, setInputMode] = useState(style.inputMode);
  const [onHover, setOnHover] = useState(null);

  useEffect(() => {
    if (!spanRef.current) return;
    const spanWidth = spanRef.current.offsetWidth;
    const spanHeight = spanRef.current.offsetHeight;
    let inputHeight = 0;
    if (style.inputMode && inputRef.current) {
      inputHeight = inputRef.current.offsetHeight;
    }
    setTagMaxWidth(style.maxWidth);
    let containerWidth = 0;
    if (style.inputMode) {
      containerWidth = tagMaxWidth;
    } else if (style.fullSizeMode) {
      containerWidth = spanWidth;
    } else {
      containerWidth = Math.min(spanWidth, tagMaxWidth);
    }
    const padding_x = style.padding_x;
    const padding_y = style.padding_y;

    let width = padding_x * 2;
    let left = padding_x;
    if (style.inputMode) {
      width += containerWidth;
    } else if (style.fullSizeMode) {
      width += spanWidth;
    } else {
      width += containerWidth;
    }
    if (icon) {
      width += 16 + 4;
      left += 16 + 4;
    }
    if (style.inputMode !== inputMode) {
      setInputMode(style.inputMode);
    }
    setTagStyle((prevData) => {
      return {
        ...prevData,
        width: width,
        height: style.inputMode ? inputHeight : spanHeight + padding_y * 2,
        left: `calc(0% + ${left}px)`,
        transform: "translate(0%, -50%)",
        border: style.border,
        backgroundColor: style.backgroundColor,
        icon_transform: style.icon_transform,
        moreOptionLabel: style.fullSizeMode
          ? false
          : spanWidth > tagMaxWidth &&
            tagMaxWidth > more_option_label_font_size,
        fullSizeMode: style.fullSizeMode,
        transparentMode: style.transparentMode,
        inputMode: style.inputMode,
      };
    });
  }, [spanRef, onHover, style]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();

      const dot_position = label.lastIndexOf(".");
      if (dot_position !== -1) {
        inputRef.current.setSelectionRange(0, dot_position);
      } else {
        inputRef.current.setSelectionRange(0, label.length);
      }
    }
  }, [inputMode]);
  return (
    <div
      ref={reference}
      style={{
        transition: "width 0.12s cubic-bezier(0.32, 0.96, 0.32, 1.08)",

        /* { Tag Position } ------------------------ */
        position: style.fullSizeMode ? "fixed" : "absolute",
        right: style.right,
        left: style.left,
        top: style.top,
        bottom: style.bottom,
        transform: style.transform,
        zIndex: style.fullSizeMode ? default_tag_layer : 0,

        /* { Tag Size } ---------------------------- */
        width: tagStyle.width,
        height: tagStyle.height,

        /* { Tag Styling } ------------------------- */
        borderRadius: style.borderRadius || 7,
        display: "inline-block",
        backgroundColor: style.transparentMode
          ? style.fullSizeMode
            ? tagStyle.backgroundColor
            : "transparent"
          : tagStyle.backgroundColor,
        overflow: "hidden",
        opacity: tagStyle.opacity !== undefined ? tagStyle.opacity : 1,
        boxShadow: tagStyle.boxShadow || "none",
        border: tagStyle.border || "none",
        backdropFilter: tagStyle.backdropFilter || "none",
        pointerEvents: inputMode? "auto" : "none",
      }}
      onMouseEnter={(event) => {
        setOnHover(true);
      }}
      onMouseLeave={(event) => {
        setOnHover(false);
      }}
    >
      {icon ? (
        <img
          src={icon}
          style={{
            transition: "transform 0.12s cubic-bezier(0.32, 0.96, 0.32, 1.08)",
            position: "absolute",
            transform: tagStyle.icon_transform
              ? `translate(0%, -50%) ${tagStyle.icon_transform}`
              : `translate(0%, -50%)`,
            top: "50%",
            left: style.padding_x || default_tag_padding_x,

            width: 16,
            height: 16,

            borderRadius: 2,
            load: "lazy",
          }}
        />
      ) : null}
      <span
        ref={spanRef}
        style={{
          /* { Tag Position } ---------------------- */
          position: "absolute",
          top: "50%",
          left: tagStyle.left,
          transform: tagStyle.transform,

          /* { Font Styling } ---------------------- */
          fontSize: tagStyle.fontSize,

          /* { Tag Styling } ----------------------- */
          color: tagStyle.color,
          userSelect: "none",
          whiteSpace: "nowrap",
          display: "inline-block",
          opacity: tagStyle.inputMode ? 0 : 1,
        }}
      >
        {label}
      </span>
      {tagStyle.inputMode ? (
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(event) => {
            if (label_on_change) {
              label_on_change(event.target.value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              inputRef.current.blur();
              label_on_submit();
            }
          }}
          style={{
            /* { Input Position } ---------------------- */
            position: "absolute",
            top: "50%",
            left: tagStyle.left,
            right: tagStyle.right,
            transform: tagStyle.transform,

            /* { Font Styling } ---------------------- */
            padding: `${tagStyle.padding_y}px ${0}px`,
            font: "inherit",
            fontSize: tagStyle.fontSize,
            color: tagStyle.color,
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      ) : (
        <span
          ref={moreOptionLabelRef}
          style={{
            /* { Tag Position } --------------------- */
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translate(0%, -50%)",

            maxWidth: tagStyle.moreOptionLabel ? "none" : 0,

            /* { Font Styling } ---------------------- */
            fontSize: tagStyle.fontSize,

            /* { Tag Styling } ----------------------- */
            padding: `${tagStyle.fontSize}px 0px`,
            color: tagStyle.color,
            backgroundColor: tagStyle.backgroundColor,
            userSelect: "none",
            whiteSpace: "nowrap",
            display: tagStyle.moreOptionLabel ? "inline-block" : "none",
          }}
        >
          {"..."}
        </span>
      )}
    </div>
  );
};
const ShortCutTag = ({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };
    processed_config.style.color = "rgba(255, 255, 255, 0.32)";
    processed_config.style.padding_x = 8;
    processed_config.style.padding_y = 0;
    return processed_config;
  };
  return <CustomizedTag {...process_tag_config(config)} />;
};
const KeyTag = ({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };
    processed_config.style.backgroundColor = "#4A4A4A";
    processed_config.style.color = "#CCCCCC";
    return processed_config;
  };
  return <CustomizedTag {...process_tag_config(config)} />;
};
const FileTag = ({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };

    if (config.style.backgroundColor === undefined) {
      processed_config.style.backgroundColor = "#323232";
    }
    if (config.style.color === undefined) {
      processed_config.style.color = "#CCCCCC";
    }
    if (config.style.padding_x === undefined) {
      processed_config.style.padding_x = 6;
    }
    if (config.style.padding_y === undefined) {
      processed_config.style.padding_y = 6;
    }
    if (config.style.borderRadius === undefined) {
      processed_config.style.borderRadius = 6;
    }
    if (config.style.boxShadow === undefined) {
      processed_config.style.boxShadow = "0px 4px 16px rgba(0, 0, 0, 0.32)";
    }
    if (config.icon === undefined || config.icon === null) {
      processed_config.icon =
        FILE_TYPE_ICON_MANAGER[config.label.split(".").pop()]?.ICON16;
    }
    processed_config.style.pointerEvents = "none";
    return processed_config;
  };

  return <CustomizedTag {...process_tag_config(config)} />;
};
const FolderTag = ({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };

    if (config.style.backgroundColor === undefined) {
      processed_config.style.backgroundColor = "#323232";
    }
    if (config.style.color === undefined) {
      processed_config.style.color = "#CCCCCC";
    }
    if (config.style.padding_x === undefined) {
      processed_config.style.padding_x = 6;
    }
    if (config.style.padding_y === undefined) {
      processed_config.style.padding_y = 6;
    }
    if (config.style.borderRadius === undefined) {
      processed_config.style.borderRadius = 6;
    }
    if (config.style.boxShadow === undefined) {
      processed_config.style.boxShadow = "0px 4px 16px rgba(0, 0, 0, 0.32)";
    }
    if (config.style.isExpanded === undefined) {
      processed_config.style.isExpanded = false;
    }
    if (config.icon === undefined || config.icon === null) {
      processed_config.icon = SYSTEM_ICON_MANAGER.arrow.ICON16;
    }
    processed_config.style.icon_transform = config.style.isExpanded
      ? "rotate(90deg)"
      : "rotate(0deg)";
    processed_config.style.pointerEvents = "none";
    return processed_config;
  };

  return <CustomizedTag {...process_tag_config(config)} />;
};
const StringTag = ({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };
    processed_config.style.backgroundColor = "#4A4A4A";
    processed_config.style.color = "#8C8C8C";
    return processed_config;
  };

  return <CustomizedTag {...process_tag_config(config)} />;
};
const CommandTag = ({ config }) => {
  return <CustomizedTag {...config} />;
};
/* { Tag types } ================================================================================= */

const Tag = ({ config }) => {
  const process_tag_config = (config) => {
    const reference = config.reference || null;
    const type = config.type || "default";
    const label = config.label || "";
    const label_on_change = config.label_on_change || null;
    const label_on_submit = config.label_on_submit || null;
    const icon = config.icon || null;
    let style = {};

    if (config.style) {
      style = config.style;
      if (config.style.fontSize === undefined) {
        style.fontSize = default_tag_font_size;
      }
      if (config.style.left === undefined) {
        style.left = "none";
      }
      if (config.style.right === undefined) {
        style.right = "none";
      }
      if (config.style.top === undefined) {
        style.top = "none";
      }
      if (config.style.bottom === undefined) {
        style.bottom = "none";
      }
      if (config.style.transform === undefined) {
        style.transform = "none";
      }
      if (config.style.borderRadius === undefined) {
        style.borderRadius = default_border_radius;
      }
      if (config.style.maxWidth === undefined) {
        style.maxWidth = default_max_tag_width;
      }
      if (config.style.fullSizeMode === undefined) {
        style.fullSizeMode = false;
      }
      if (config.style.transparentMode === undefined) {
        style.transparentMode = false;
      }
      if (config.style.inputMode === undefined) {
        style.inputMode = false;
      }
    } else {
      style = {
        fontSize: default_tag_font_size,
        right: "none",
        left: "none",
        top: "none",
        bottom: "none",
        transform: "none",
        borderRadius: default_border_radius,
        maxWidth: default_max_tag_width,
        fullSizeMode: false,
        transparentMode: false,
        inputMode: false,
      };
    }
    return {
      reference,
      type,
      label,
      label_on_change,
      label_on_submit,
      icon,
      style,
    };
  };
  const render_tag = () => {
    switch (config.type) {
      case "shortcut":
        return <ShortCutTag config={process_tag_config(config)} />;
      case "key":
        return <KeyTag config={process_tag_config(config)} />;
      case "file":
        return <FileTag config={process_tag_config(config)} />;
      case "folder":
        return <FolderTag config={process_tag_config(config)} />;
      case "string":
        return <StringTag config={process_tag_config(config)} />;
      case "command":
        return <CommandTag config={process_tag_config(config)} />;
      default:
        return null;
    }
  };
  return render_tag();
};

export default Tag;
