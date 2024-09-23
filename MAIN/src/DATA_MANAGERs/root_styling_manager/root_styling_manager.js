import React, { useState, useContext } from "react";
import { RootStylingContexts } from "./root_styling_contexts";

const RootStylingManager = ({ children }) => {
  const [panel, setPanel] = useState();

  return (
    <RootStylingContexts.Provider value={{}}>
      {children}
    </RootStylingContexts.Provider>
  );
};