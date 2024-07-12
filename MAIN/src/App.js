import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBox from "./COMPONENTs/chatBox/chatBox";
import Home from "./HOME/home";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/explorer" element={<Home />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
