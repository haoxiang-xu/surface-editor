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
    type: "test_container",
    width: 128,
    min_width: 50,
  },
  monaco_editor_0002: {
    type: "test_container",
    width: 256,
    min_width: 50,
  },
  monaco_editor_0003: {
    type: "test_container",
    width: 512,
    min_width: 50,
  },
};

const RootStackManager = ({ children }) => {
  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);

  const access_sub_items_by_tag = (unique_tag) => {
    const sub_items = stackStructure[unique_tag].sub_items;
    if (!sub_items) return [];
    return sub_items;
  };
  const access_type_by_tag = (unique_tag) => {
    const type = stackStructure[unique_tag].type;
    if (!type) return null;
    return type;
  };
  const access_width_by_tag = (unique_tag) => {
    const width = stackStructure[unique_tag].width;
    if (!width) return "100%";
    return width;
  };
  const update_width_by_tag = (unique_tag, width) => {
    setStackStructure((prevData) => {
      return {
        ...prevData,
        [unique_tag]: {
          ...prevData[unique_tag],
          width: width,
        },
      };
    });
  };
  const access_min_width_by_tag = (unique_tag) => {
    const min_width = stackStructure[unique_tag].min_width;
    if (!min_width) return 0;
    return min_width;
  };

  return (
    <RootStackContexts.Provider
      value={{
        stackStructure,
        setStackStructure,
        access_sub_items_by_tag,
        access_type_by_tag,
        access_width_by_tag,
        update_width_by_tag,
        access_min_width_by_tag,
      }}
    >
      {children}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
