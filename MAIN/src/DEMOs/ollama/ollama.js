import React, { useEffect, useState } from "react";
import Chat from "./chat";

const R = 30;
const G = 30;
const B = 30;

const Ollama = ({}) => {
  const [messages, setMessages] = useState([]);

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
      <div
        className="chat-section-wrapper"
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",

          height: "100%",
          width: "36%",
        }}
      >
        <Chat messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default Ollama;
