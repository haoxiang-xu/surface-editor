import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootEventListener from "./DATA_MANAGERs/root_event_listener/root_event_listener";
import ChatPageDemo from "./DEMOs/chat/chat_page_demo";
import InputDemo from "./BUILTIN_COMPONENTs/input/input_demo";
import NewStackDesign from "./DEMOs/new_stack_design/new_stack_design";

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
        <Route path="/input" element={<InputDemo />} />
        <Route path="/new-stack-design" element={<NewStackDesign />} />
      </Routes>
    </Router>
  );
}

export default App;
