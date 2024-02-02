import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./PAGEs/home/home";
import UploadFile from "./PAGEs/upload_file/uploadfile";
import CodeEditorPage from "./PAGEs/code_editor/code_editor";
import DevelopmentEditor from "./PAGEs/development_editor/development_editor";
import StackStructure from "./PAGEs/stack_structure/stack_structure";
import ChatBox from "./COMPONENTs/chatBox/chatBox";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/developmenteditor" element={<DevelopmentEditor />} />
        <Route path="/upload" element={<UploadFile />} />
        <Route path="/codeeditor" element={<CodeEditorPage />} />
        <Route path="/explorer" element={<Home />} />
        <Route path="/" element={<StackStructure />} />
        <Route path="/chat" element={<ChatBox />} />
      </Routes>
    </Router>
  );
}

export default App;
