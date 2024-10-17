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
          top: 5,
          right: 5,
          left: 5,

          height: default_font_size * 2.3,

          opacity: 1,
          borderRadius: `${default_border_radius - 4}px ${
            default_border_radius - 4
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
            top: "50%",

            transform: "translateY(-55%)",
            left: 8,

            fontSize: `${default_font_size + 1}px`,
            color: `rgb(${R + default_font_color_offset}, ${
              G + default_font_color_offset
            }, ${B + default_font_color_offset})`,
          }}
        >
          {language}
        </span>
        <div
          style={{
            position: "absolute",
            top: 1,
            right: 1,

            width: 28,
            padding: `${default_font_size}px`,
            border: `1px solid rgba(${R + default_forground_color_offset}, ${
              G + default_forground_color_offset
            }, ${B + default_forground_color_offset} , 0)`,
            borderRadius: `${default_border_radius - 4}px`,
          }}
        >
          <Icon
            src="copy"
            style={{
              position: "absolute",
              top: "50%",
              left: 4,
              transform: "translateY(-50%)",
              PointerEvents: "none",
              userSelect: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              right: 4,
              transform: "translateY(-55%)",

              fontSize: `${default_font_size}px`,
              color: `rgb(${R + default_font_color_offset}, ${
                G + default_font_color_offset
              }, ${B + default_font_color_offset})`,
              PointerEvents: "none",
              userSelect: "none",
            }}
          >
            copy
          </span>
        </div>
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
          backgroundColor: `rgb(${R - 8}, ${G - 8}, ${B - 8})`,
          paddingTop: 32,
          borderRadius: default_border_radius,
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
const HTML = ({ children }) => {
  return <div dangerouslySetInnerHTML={{ __html: children }} />;
};

const Span = ({ children }) => {
  const [processedContent, setProcessedContent] = useState(children);

  useEffect(() => {
    const extract_CODE = (raw_content) => {
      const find_first_code_block = (raw_content) => {
        const start_code_block = "```";
        const end_code_block = "```";
        const start_code_block_index = raw_content.indexOf(start_code_block);

        const sliced_content = raw_content.slice(start_code_block_index + 3);

        const end_code_block_index =
          sliced_content.indexOf(end_code_block) + start_code_block_index + 3;
        if (start_code_block_index === -1) return null;
        if (end_code_block_index === -1) return null;
        if (end_code_block_index < start_code_block_index) return null;

        return raw_content.slice(
          start_code_block_index,
          end_code_block_index + end_code_block.length
        );
      };
      const process_code_block = (code_block) => {
        const language = code_block.slice(3, code_block.indexOf("\n")).trim();
        const last_line_index = code_block.lastIndexOf("\n");
        const content = code_block.slice(
          code_block.indexOf("\n") + 1,
          last_line_index
        );
        return { language, content };
      };

      let unprocessed_content = raw_content;
      let processed_content = [];

      while (find_first_code_block(unprocessed_content) !== null) {
        const code_block = find_first_code_block(unprocessed_content);

        const start_index = unprocessed_content.indexOf(code_block);
        const end_index = start_index + code_block.length;

        const pre_content = unprocessed_content.slice(0, start_index);
        const post_content = unprocessed_content.slice(end_index);
        const code_content = unprocessed_content.slice(start_index, end_index);

        if (pre_content.length > 0) {
          processed_content.push({ type: "RAW", content: pre_content });
        }
        const processed_code_block = process_code_block(code_content);
        processed_content.push({
          type: "CODE",
          language: processed_code_block.language,
          content: processed_code_block.content,
        });

        unprocessed_content = post_content;
      }
      if (unprocessed_content.length > 0) {
        processed_content.push({ type: "RAW", content: unprocessed_content });
      }
      return processed_content;
    };
    const extract_HTML = (raw_content) => {
      const find_first_HTML_tag = (raw_content) => {
        const start_tag_open_index = raw_content.indexOf("<");
        const start_tag_close_index = raw_content.indexOf(">");
        if (start_tag_open_index === -1) return null;
        if (start_tag_close_index < start_tag_open_index) return null;
        return raw_content.slice(
          start_tag_open_index,
          start_tag_close_index + 1
        );
      };

      let unprocessed_content = raw_content;
      let processed_content = [];

      while (find_first_HTML_tag(unprocessed_content) !== null) {
        const start_tag = find_first_HTML_tag(unprocessed_content);
        const end_tag = start_tag.replace("<", "</");

        const start_index = unprocessed_content.indexOf(start_tag);
        const end_index = unprocessed_content.indexOf(end_tag);

        const pre_content = unprocessed_content.slice(0, start_index);
        const post_content = unprocessed_content.slice(
          end_index + end_tag.length
        );
        const html_content = unprocessed_content.slice(
          start_index,
          end_index + end_tag.length
        );
        if (pre_content.length > 0) {
          processed_content.push({ type: "RAW", content: pre_content });
        }
        processed_content.push({ type: "HTML", content: html_content });
        unprocessed_content = post_content;
      }
      if (unprocessed_content.length > 0) {
        processed_content.push({ type: "RAW", content: unprocessed_content });
      }
      return processed_content;
    };
    const extrace_LaTeX = (raw_content) => {
      const find_first_LaTeX = (raw_content) => {
        const start_LaTeX = "$";
        const end_LaTeX = "$";
        const start_LaTeX_index = raw_content.indexOf(start_LaTeX);
        const sliced_content = raw_content.slice(start_LaTeX_index + 1);
        const end_LaTeX_index =
          sliced_content.indexOf(end_LaTeX) + start_LaTeX_index + 1;
        if (start_LaTeX_index === -1) return null;
        if (end_LaTeX_index === -1) return null;
        if (end_LaTeX_index < start_LaTeX_index) return null;
        return raw_content.slice(
          start_LaTeX_index,
          end_LaTeX_index + end_LaTeX.length
        );
      };

      let unprocessed_content = raw_content;
      let processed_content = [];

      while (find_first_LaTeX(unprocessed_content) !== null) {
        const LaTeX = find_first_LaTeX(unprocessed_content);
        const start_index = unprocessed_content.indexOf(LaTeX);
        const end_index = start_index + LaTeX.length;

        const pre_content = unprocessed_content.slice(0, start_index);
        const post_content = unprocessed_content.slice(end_index);
        const LaTeX_content = unprocessed_content.slice(start_index, end_index);

        if (pre_content.length > 0) {
          processed_content.push({ type: "RAW", content: pre_content });
        }
        processed_content.push({ type: "LaTeX", content: LaTeX_content });
        unprocessed_content = post_content;
      }
      if (unprocessed_content.length > 0) {
        processed_content.push({ type: "RAW", content: unprocessed_content });
      }
      return processed_content;
    };
    const process_content = (raw_content) => {
      const extract_and_merge = (raw_content) => {
        const apply_extract_function = (
          processing_content,
          extract_function
        ) => {
          for (let i = 0; i < processing_content.length; i++) {
            if (processing_content[i].type === "RAW") {
              const processed_sub_content = extract_function(
                processing_content[i].content
              );
              processing_content.splice(i, 1, ...processed_sub_content);
            }
          }
          return processing_content;
        };
        let processed_content = [];
        processed_content = extract_CODE(raw_content);
        processed_content = apply_extract_function(
          processed_content,
          extract_HTML
        );
        processed_content = apply_extract_function(
          processed_content,
          extrace_LaTeX
        );
        return processed_content;
      };
      let processed_content = extract_and_merge(raw_content);
      for (let i = 0; i < processed_content.length; i++) {
        if (processed_content[i].type === "HTML") {
          processed_content[i].component = (
            <div key={i} style={{ display: "block" }}>
              <HTML>{processed_content[i].content}</HTML>
            </div>
          );
        } else if (processed_content[i].type === "CODE") {
          processed_content[i].component = (
            <div key={i} style={{ display: "block" }}>
              <CODE language={processed_content[i].language}>
                {processed_content[i].content}
              </CODE>
            </div>
          );
        } else if (processed_content[i].type === "LaTeX") {
          processed_content[i].component = (
            <div key={i} style={{ display: "inline-block" }}>
              <LaTeX>{processed_content[i].content}</LaTeX>
            </div>
          );
        } else {
          processed_content[i].component = (
            <div key={i} style={{ display: "inline-block" }}>
              <MD>{processed_content[i].content}</MD>
            </div>
          );
        }
      }
      return processed_content.map((content) => content.component);
    };
    setProcessedContent(process_content(children));
  }, [children]);

  return (
    <div
      style={{
        position: "relative",

        left: 0,
        right: 0,

        /* { style } --------------------------------------------------------------------- */
        padding: `${default_font_size}px`,
        borderRadius: `${default_border_radius}px`,
        backgroundColor: `rgb(${R + default_forground_color_offset}, ${
          G + default_forground_color_offset
        }, ${B + default_forground_color_offset})`,
        color: `rgb(${R + default_font_color_offset}, ${
          G + default_font_color_offset
        }, ${B + default_font_color_offset})`,

        overflow: "hidden",
      }}
    >
      {processedContent}
    </div>
  );
};

export default Span;
