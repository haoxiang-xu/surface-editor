import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tag from "./BUILTIN_COMPONENTs/tag/tag";
import RootEventListener from "./DATA_MANAGERs/root_event_listener/root_event_listener";

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
      </Routes>
    </Router>
  );
}

export default App;
