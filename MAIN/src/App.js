import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootEventListener from "./DATA_MANAGERs/root_event_listener/root_event_listener";
import ChatPageDemo from "./DEMO/chat/chat_page_demo";
import ZshThemeTerminal from "./DEMO/react_syntax_highlighter/react_syntax_highlighter";

import "./App.css";

function App() {
  return (
    <Router>
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300&display=swap"
        rel="stylesheet"
      ></link>
      <Routes>
        <Route path="/" element={<RootEventListener />} />
        <Route path="/chat" element={<ChatPageDemo />} />
        <Route path="/terminal" element={<ZshThemeTerminal />} />
      </Routes>
    </Router>
  );
}

export default App;
