import React, { useState, useContext, useEffect } from "react";
import { RootStylingContexts } from "./root_styling_contexts";

const RootStylingManager = ({ children }) => {
  const [globalR, setGlobalR] = useState(30);
  const [globalG, setGlobalG] = useState(30);
  const [globalB, setGlobalB] = useState(30);

  return (
    <RootStylingContexts.Provider
      value={{ globalR, setGlobalR, globalG, setGlobalG, globalB, setGlobalB }}
    >
      {children}
    </RootStylingContexts.Provider>
  );
};

export default RootStylingManager;
