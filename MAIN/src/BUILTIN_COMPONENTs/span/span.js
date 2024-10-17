import React, { useState, useEffect, useRef } from "react";
/* { import external render libraries } ------------------------------------------------- */
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import Tag from "../../BUILTIN_COMPONENTs/tag/tag";
import { CodeBlock, dracula } from "react-code-blocks";
import ReactShowdown from "react-showdown";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

const R = 30;
const G = 30;
const B = 30;

const default_forground_color_offset = 12;
const default_front_object_color_offset = 50;
const default_font_color_offset = 128;
const default_font_size = 12;
const default_border_radius = 7;
const default_tag_max_Width = 128;

const CODE = ({ language, children }) => {
  return (
    <div
      style={{
        position: "relative",
        marginTop: default_font_size,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 8,

          width: 36,
          padding: `${default_font_size}px`,
          borderRadius: `${default_border_radius - 4}px`,
          backgroundColor: `rgb(${R}, ${G}, ${B})`,
        }}
      >
        <Icon
          src="copy"
          style={{
            position: "absolute",
            top: "50%",
            left: 4,
            transform: "translateY(-50%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            right: 4,
            transform: "translateY(-55%)",

            fontSize: `${default_font_size + 3}px`,
            color: `rgb(${R + default_font_color_offset}, ${
              G + default_font_color_offset
            }, ${B + default_font_color_offset})`,
          }}
        >
          copy
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          left: 5,

          height: default_font_size * 2.8,

          opacity: 0.72,
          borderRadius: `${default_border_radius - 3}px ${
            default_border_radius - 3
          }px 0 0`,
          backgroundColor: `rgb(${R + default_forground_color_offset / 2}, ${
            G + default_forground_color_offset / 2
          }, ${B + default_forground_color_offset / 2})`,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.32)`,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 6,
            left: 12,

            fontSize: `${default_font_size + 3}px`,
            color: `rgb(${R + default_font_color_offset}, ${
              G + default_font_color_offset
            }, ${B + default_font_color_offset})`,
          }}
        >
          {language}
        </span>
      </div>
      <CodeBlock
        text={children}
        language={language}
        showLineNumbers
        theme={dracula}
        wrapLines={false}
        codeBlock
        customStyle={{
          fontSize: `${default_font_size}px`,
          backgroundColor: `rgb(${R}, ${G}, ${B})`,
          paddingTop: 32,
          borderRadius: 7,
          overflowX: "auto",
          maxWidth: "100%",
        }}
      />
    </div>
  );
};
const MD = ({ children }) => {
  return <ReactShowdown markdown={children} />;
};
const TAG = ({ children }) => {
  const tagRef = useRef();

  return (
    <div
      style={{
        position: "relative",

        width: default_tag_max_Width,

        display: "inline-block",
        height: default_font_size,
        fontSize: `${default_font_size}px`,
        padding: `${default_font_size / 2}px ${default_font_size}px ${
          default_font_size / 2
        }px ${default_font_size}px`,
      }}
    >
      <Tag
        config={{
          reference: tagRef,
          type: "file",
          label: children,
          style: {
            maxWidth: default_tag_max_Width,
          },
        }}
      />
    </div>
  );
};
const LaTeX = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        height: default_font_size,
        fontSize: `${default_font_size}px`,
      }}
    >
      <Latex>{children}</Latex>
    </div>
  );
};
const TXT = ({ children }) => {
  return (
    <span
      style={{
        fontSize: `${default_font_size}px`,
      }}
    >
      {children}
    </span>
  );
};

const Span = ({ children }) => {
  const [processedContent, setProcessedContent] = useState(children);

  useEffect(() => {
    const processedContent = (raw_content) => {
      return raw_content;
    };
    setProcessedContent(processedContent(children));
  }, [children]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",

        width: "50%",

        transform: "translate(-50%, -50%)",

        /* { style } --------------------------------------------------------------------- */
        padding: `${default_font_size}px`,
        borderRadius: `${default_border_radius + 8}px`,
        backgroundColor: `rgb(${R + default_forground_color_offset}, ${
          G + default_forground_color_offset
        }, ${B + default_forground_color_offset})`,
        color: `rgb(${R + default_font_color_offset}, ${
          G + default_font_color_offset
        }, ${B + default_font_color_offset})`,
      }}
    >
      <TXT>{processedContent}</TXT>
    </div>
  );
};

export default Span;
