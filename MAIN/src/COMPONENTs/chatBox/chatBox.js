import React, { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "./inputBar.css";
import { ICON_MANAGER } from "../../ICONs/icon_manager";

/* Load ICON manager --------------------------------------------------------------------------------- */
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
/* Load ICON manager --------------------------------------------------------------------------------- */

const InputBar = ({ sendMessage, chatBoxHeight }) => {
  const [input, setInput] = useState("");
  const editorRef = useRef();
  const [placeholderClassName, setPlaceholderClassName] = useState(
    "input_bar_component_placeholder_showed0724"
  );
  const [emptyInputOnClicked, setEmptyInputOnClicked] = useState(false);
  const [maxRows, setMaxRows] = useState(1);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    if (input === "") {
      setPlaceholderClassName("input_bar_component_placeholder_showed0724");
    } else {
      setPlaceholderClassName("input_bar_component_placeholder_hided0724");
    }
    const isTextareaScrollable = () => {
      if (editorRef.current) {
        if (chatBoxHeight) {
          setIsScrollable(
            editorRef.current.scrollHeight > chatBoxHeight * 0.64
          );
        } else {
          setIsScrollable(
            editorRef.current.scrollHeight > window.innerHeight * 0.64
          );
        }
      }
    };
    isTextareaScrollable();
  }, [input]);
  useEffect(() => {
    const calculateMaxRows = () => {
      let calculatedMaxRows = Math.floor((window.innerHeight * 0.64) / 18);
      if (chatBoxHeight) {
        calculatedMaxRows = Math.floor((chatBoxHeight * 0.64) / 18);
      }
      setMaxRows(calculatedMaxRows);
    };
    calculateMaxRows();
    window.addEventListener("resize", calculateMaxRows);

    return () => {
      window.removeEventListener("resize", calculateMaxRows);
    };
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleSendMessage = (message) => {
    if (input !== "") {
      setInput("");
      if (sendMessage) {
        console.log("[MESSAGE SENT: ", message, " ]");
        return () => {
          sendMessage(message);
        };
      } else {
        console.log("[ERROR: NO sendMessage FUNCTION PASSED TO INPUTBAR]");
        return () => {};
      }
    } else {
      console.log("[ERROR: EMPTY MESSAGE]");
      emptyInputOnClick();
      return () => {};
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = editorRef.current;
      const currentValue = editorRef.current.value;
      const indentation = "   ";
      const newValue =
        currentValue.substring(0, selectionStart) +
        indentation +
        currentValue.substring(selectionEnd);

      editorRef.current.value = newValue;
      editorRef.current.setSelectionRange(
        selectionStart + indentation.length,
        selectionStart + indentation.length
      );
    }
  };
  const emptyInputOnClick = () => {
    if (input === "") {
      setEmptyInputOnClicked(true);
      setTimeout(() => {
        setEmptyInputOnClicked(false);
      }, 400);
    }
  };

  return (
    <div className="input_bar_component_container0724">
      <TextareaAutosize
        className={
          emptyInputOnClicked
            ? "input_bar_component_textarea_autosize_shake0724"
            : "input_bar_component_textarea_autosize0724"
        }
        ref={editorRef}
        value={input}
        minRows={1}
        maxRows={maxRows}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          color: "#CCCCCC",
          textAlign: "left",
          backgroundColor: "#323232",
          padding: "6px",
          fontSize: "13px",
          fontFamily: "Consolas, monaco, monospace",
          borderRadius: "5px",
          opacity: "1",
          boxShadow: "0px 2px 16px 2px rgba(0,0,0,0.16)",
          overflowY: isScrollable ? "scroll" : "hidden",
        }}
      ></TextareaAutosize>
      <img
        src={SYSTEM_ICON_MANAGER.rightArrow.ICON512}
        className="input_bar_component_send_button0724"
        onClick={() => handleSendMessage(input)}
      />
      <span
        className={
          emptyInputOnClicked
            ? "input_bar_component_placeholder_shake0724"
            : placeholderClassName
        }
      >
        #ASK COPILOT
      </span>
    </div>
  );
};
const TextBoxes = ({ messages }) => {
  const containerRef = useRef();
  const [lastVisibleItemIndex, setLastVisibleItemIndex] = useState(
    messages.length - 1
  );
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const items = containerRef.current.querySelectorAll(
        ".send_text_box_component_container0202, .reply_text_box_component_container0202"
      );

      let lastVisibleItem = null;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.clientHeight;

        if (itemBottom >= scrollTop && itemTop <= scrollTop + containerHeight) {
          lastVisibleItem = i;
        }
      }

      setLastVisibleItemIndex(lastVisibleItem);
    };
    containerRef.current.addEventListener("scroll", handleScroll);
    console.log(lastVisibleItemIndex);
    return () => {
      containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [
    containerRef.current?.scrollTop,
    containerRef.current?.clientHeight,
    Window.innerHeight,
    messages,
  ]);
  return (
    <div ref={containerRef} className="text_boxes_component_container0202">
      {messages.map((message, index) => {
        if (message.sender === "SELF") {
          return <SendTextBox key={index} text={message.context} />;
        } else {
          return <ReplyTextBox key={index} text={message.context} />;
        }
      })}
    </div>
  );
};
const SendTextBox = ({ text }) => {
  return (
    <div className="send_text_box_component_container0202">
      <p className="text_box_component_label">{text}</p>
    </div>
  );
};
const ReplyTextBox = ({ text }) => {
  return (
    <div className="reply_text_box_component_container0202">
      <p className="text_box_component_label">{text}</p>
    </div>
  );
};
const ChatBox = ({}) => {
  const [messages, setMessages] = useState([
    {
      sender: "SELF",
      context: "how to adjust the text so that each line width are equal",
    },
    {
      sender: "COPILOT",
      context:
        "To adjust the text within each .send_text_box_component_container0202 so that each line has equal width, you can use the display: flex; property along with the flex-direction: column; property to create a vertical flex container. Then, you can set width: 100%; on the text elements inside to make each line occupy the entire width. Here's how you can do it:",
    },
    {
      sender: "SELF",
      context: "I mean distribute text evenly between margins",
    },
    {
      sender: "COPILOT",
      context:
        "To distribute the text evenly between the margins while keeping the text right-aligned within each .send_text_box_component_container0202, you can use the text-align: justify; property along with text-align-last: right; for the last line. Here's how you can achieve that:",
    },
    {
      sender: "SELF",
      context: "how to adjust the text so that each line width are equal",
    },
    {
      sender: "COPILOT",
      context:
        "To adjust the text within each .send_text_box_component_container0202 so that each line has equal width, you can use the display: flex; property along with the flex-direction: column; property to create a vertical flex container. Then, you can set width: 100%; on the text elements inside to make each line occupy the entire width. Here's how you can do it:",
    },
    {
      sender: "SELF",
      context: "I mean distribute text evenly between margins",
    },
    {
      sender: "COPILOT",
      context:
        "To distribute the text evenly between the margins while keeping the text right-aligned within each .send_text_box_component_container0202, you can use the text-align: justify; property along with text-align-last: right; for the last line. Here's how you can achieve that:",
    },
  ]);
  const sendMessage = (message) => {
    console.log("[MESSAGE RECEIVED: ", message, " ]");
  };
  return (
    <div className="chat_box_component_container0202">
      <TextBoxes messages={messages} />
      <InputBar sendMessage={sendMessage} chatBoxHeight={128} />
    </div>
  );
};

export default ChatBox;
