import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tag from "./DEMO/tag/tag";
import Home from "./HOME/home";

import StackStructure from "./DEMO/stack_structure/stack_structure";
import RootStackManager from "./DATA_MANAGERs/root_stack_manager/root_stack_manager";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/stack"
          element={
            <RootStackManager>
              <StackStructure />
            </RootStackManager>
          }
        />
        <Route path="/tag" element={<Tag />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
