import React, { useState, useContext } from "react";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootStackContexts } from "../../DATA_MANAGERs/root_stack_manager/root_stack_contexts";
/* { import contexts } ---------------------------------------------------------------------- */

const TestingWrapper = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: "#1E1E1E",
      }}
    >
      {children}
    </div>
  );
};

/* { Stack Structure } ====================================================================== */
const HorizontalStack = ({ sub_items }) => {};

const StackStructure = () => {
  const { stackStructure, setStackStructure } =
    React.useContext(RootStackContexts);
  const get_sub_items_by_tag = (unique_tag) => {
    const sub_items = stackStructure[unique_tag].sub_items;
    if (!sub_items) return [];
    return sub_items;
  };
  const get_type_by_tag = (unique_tag) => {
    const type = stackStructure[unique_tag].type;
    if (!type) return "key";
    return type;
  };
  const render_stack_component_by_tag = (unique_tag) => {
    const type = get_type_by_tag(unique_tag);
    switch (type) {
      case "horizontal_stack":
        return <HorizontalStack sub_items={get_sub_items_by_tag(unique_tag)} />;
      default:
        return <div>{unique_tag}</div>;
    }
  };

  return (
    <TestingWrapper>{render_stack_component_by_tag("root")}</TestingWrapper>
  );
};

export default StackStructure;
