import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootEventListener from "./DATA_MANAGERs/root_event_listener/root_event_listener";

import TerminalComponent from "./DEMO/terminal/terminal_component";

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
        <Route path="/terminal" element={<TerminalComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
