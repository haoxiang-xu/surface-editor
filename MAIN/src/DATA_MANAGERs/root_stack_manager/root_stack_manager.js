import React, { useState, useEffect } from "react";
import { RootStackContexts } from "./root_stack_contexts";

const FAKE_STACK_STRUCTURE = {
  root: {
    type: "horizontal_stack",
    sub_items: [
      "surface_explorer_0001",
      "monaco_editor_0002",
      "monaco_editor_0003",
    ],
  },
  surface_explorer_0001: {
    type: "surface_explorer",
  },
  monaco_editor_0002: {
    type: "monaco_editor",
  },
  monaco_editor_0003: {
    type: "monaco_editor",
  },
};

const RootStackManager = ({ children }) => {
  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);

  return (
    <RootStackContexts.Provider value={{ stackStructure, setStackStructure }}>
      {children}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
