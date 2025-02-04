import React, { useEffect, useState } from "react";
import ollama from "./ollama.png";
import Chat from "./chat";

const R = 30;
const G = 30;
const B = 30;

const Ollama = ({}) => {
  const [messages, setMessages] = useState([]);
  const [sectionStarted, setSectionStarted] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setSectionStarted(true);
    }
  }, [messages]);

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
      <img
        src={ollama}
        alt="ollama"
        style={{
          transition: "all 0.4s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
          transform: "translate(-50%, -50%)",
          position: "fixed",

          bottom: sectionStarted ? "-3px" : "12px",
          left: "50%",

          width: 72,

          padding: 8,
          borderRadius: 8,
          opacity: sectionStarted ? 0.08 : 0.32,
        }}
      />
      <span
        style={{
          transition: "all 0.5s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
          position: "absolute",
          transform: "translate(-50%, -50%)",

          top: "calc(50% - 2px)",
          left: "50%",
          fontSize: 32,
          color: sectionStarted ? `rgba(255, 255, 255, 0)` : `rgba(255, 255, 255, 0.32)`,
        }}
      >
        power by Ollama
      </span>
      <div
        className="chat-section-wrapper"
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "calc(50% + 2px)",
          left: "50%",

          height: "100%",
          width: "45%",
          minWidth: 512,
        }}
      >
        <Chat messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default Ollama;
