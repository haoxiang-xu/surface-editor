import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tag from "./BUILTIN_COMPONENTs/tag/tag";
import Home from "./HOME/home";

import "./App.css";

function App() {
  return (
    <Router>
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300&display=swap"
        rel="stylesheet"
      ></link>
      <Routes>
        <Route path="/tag" element={<Tag />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
