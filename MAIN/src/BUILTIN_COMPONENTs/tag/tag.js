import React, { useState, useRef, useEffect } from "react";
import { throttle } from "lodash";
/* { Import ICONs } ------------------------------------------------------------------------------------------ */
import Icon from "../icon/icon";
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
const default_border_radius = 4;

const default_tag_layer = 8;
const more_option_label_font_size = 12;

/* { Tag types } ================================================================================= */
const CustomizedTag = ({
  reference,
  type,
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

        top: style.top,
        left: `calc(0% + ${left}px)`,
        right: style.right,
        bottom: style.bottom,

        fontSize: style.fontSize,

        padding_x: padding_x,
        padding_y: padding_y,

        transform: "translate(0%, -50%)",
        border: style.border,
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        color: style.color,
        boxShadow: style.boxShadow,

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
  }, [style, tagMaxWidth]);
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
        pointerEvents: inputMode ? "auto" : "none",
      }}
    >
      <Icon
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
              label_on_submit(true);
            }
            if (event.key === "Escape") {
              inputRef.current.blur();
              label_on_submit(false);
            }
          }}
          onDragStart={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          style={{
            /* { Input Position } ---------------------- */
            position: "absolute",
            top: "50%",
            left: tagStyle.left,
            width:
              tagStyle.width -
              3 * (style.padding_x || default_tag_padding_x) -
              (icon ? 16 : 0),
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
            transition: "all 0.12s cubic-bezier(0.32, 1, 0.32, 1)",
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
      processed_config.style.color = "#C0C0C0";
    }
    if (config.style.padding_x === undefined) {
      processed_config.style.padding_x = 5;
    }
    if (config.style.padding_y === undefined) {
      processed_config.style.padding_y = 4;
    }
    if (config.style.boxShadow === undefined) {
      processed_config.style.boxShadow = "0px 4px 16px rgba(0, 0, 0, 0.32)";
    }
    if (config.icon === undefined || config.icon === null) {
      processed_config.icon =
        FILE_TYPE_ICON_MANAGER[config.label.split(".").pop()]?.ICON16;
      if (!config.style.noWidthLimitMode) {
        if (processed_config.icon !== undefined) {
          processed_config.style.maxWidth = config.style.maxWidth - 12;
        } else {
          processed_config.style.maxWidth = config.style.maxWidth - 2;
        }
      } else {
        processed_config.style.maxWidth = config.style.maxWidth;
      }
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
      processed_config.style.color = "#C0C0C0";
    }
    if (config.style.padding_x === undefined) {
      processed_config.style.padding_x = 5;
    }
    if (config.style.padding_y === undefined) {
      processed_config.style.padding_y = 4;
    }
    if (config.style.boxShadow === undefined) {
      processed_config.style.boxShadow = "0px 4px 16px rgba(0, 0, 0, 0.32)";
    }
    if (config.style.isExpanded === undefined) {
      processed_config.style.isExpanded = false;
    }
    if (config.icon === undefined || config.icon === null) {
      processed_config.icon = "arrow";
    }
    if (!config.style.noWidthLimitMode) {
      processed_config.style.maxWidth = config.style.maxWidth - 12;
    } else {
      processed_config.style.maxWidth = config.style.maxWidth;
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

const compareConfig = (prev, next) => {
  const prev_config = { ...prev.config };
  const next_config = { ...next.config };

  if (prev_config.style.maxWidth !== next_config.style.maxWidth) {
    return false;
  }
  if (prev_config.style.fullSizeMode !== next_config.style.fullSizeMode) {
    return false;
  }
  if (prev_config.style.transparentMode !== next_config.style.transparentMode) {
    return false;
  }
  if (prev_config.style.inputMode !== next_config.style.inputMode) {
    return false;
  }
  if (
    prev_config.style.noWidthLimitMode !== next_config.style.noWidthLimitMode
  ) {
    return false;
  }
  return true;
};

const Tag = React.memo(({ config }) => {
  const process_tag_config = (config) => {
    let processed_config = { ...config };

    const reference = processed_config.reference || null;
    const type = processed_config.type || "default";
    const label = processed_config.label || "";
    const label_on_change = processed_config.label_on_change || null;
    const label_on_submit = processed_config.label_on_submit || null;
    const icon = processed_config.icon || null;
    let style = {};

    if (processed_config.style) {
      style = processed_config.style;
      if (processed_config.style.fontSize === undefined) {
        style.fontSize = default_tag_font_size;
      }
      if (processed_config.style.left === undefined) {
        style.left = "none";
      }
      if (processed_config.style.right === undefined) {
        style.right = "none";
      }
      if (processed_config.style.top === undefined) {
        style.top = "none";
      }
      if (processed_config.style.bottom === undefined) {
        style.bottom = "none";
      }
      if (processed_config.style.transform === undefined) {
        style.transform = "none";
      }
      if (processed_config.style.borderRadius === undefined) {
        style.borderRadius = default_border_radius;
      }
      if (processed_config.style.maxWidth === undefined) {
        style.maxWidth = default_max_tag_width;
      }
      if (processed_config.style.fullSizeMode === undefined) {
        style.fullSizeMode = false;
      }
      if (processed_config.style.transparentMode === undefined) {
        style.transparentMode = false;
      }
      if (processed_config.style.inputMode === undefined) {
        style.inputMode = false;
      }
      if (processed_config.style.noWidthLimitMode === undefined) {
        style.noWidthLimitMode = false;
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
        noWidthLimitMode: false,
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
  const render_tag = throttle(() => {
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
  }, 100);
  return render_tag();
}, compareConfig);

export default Tag;
