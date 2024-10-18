import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const default_font_size = 14;

const R = 30;
const G = 30;
const B = 30;

const default_max_rows = 16;

const Input = ({ value, setValue, onSubmit, ...props }) => {
  const inputRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      setHeight(inputRef.current.clientHeight + 12);
    }
  }, [value, window.innerWidth, window.innerHeight]);

  return (
    <div
      style={{
        ...props.style,
        height: height,
        overflow: "hidden",
      }}
    >
      <TextareaAutosize
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        minRows={1}
        maxRows={default_max_rows}
        style={{
          position: "absolute",
          left: 6,
          bottom: 6,
          right: 32,

          color: "#CCCCCC",
          textAlign: "left",
          backgroundColor: `rgba(${R}, ${G}, ${B}, 0)`,
          padding: 8,
          fontSize: default_font_size,
          fontFamily: "inherit",
          borderRadius: 0,
          opacity: "1",
          outline: "none",
          border: "none",
          resize: "none",
        }}
      />
    </div>
  );
};

export default Input;
