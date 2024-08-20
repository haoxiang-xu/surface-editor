import React, { useState, useContext, useEffect } from "react";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootStackContexts } from "../../DATA_MANAGERs/root_stack_manager/root_stack_contexts";
import { StackStructureContexts } from "./stack_structure_contexts";
/* { import contexts } ---------------------------------------------------------------------- */

const FAKE_STACK_STRUCTURE = {
  root: {
    sub_items: ["1"],
  },
  "1" : {
    type: "test",
    sub_items: ["2", "3"],
  },
  "2" : {
    type: "test",
    sub_items: ["4", "5"],
  },
  "3" : {
    type: "test",
    sub_items: [],
  },
  "4" : {
    type: "test",
    sub_items: [],
  },
  "5" : {
    type: "test",
    sub_items: [],
  },
};

const StackStructure = () => {
  return (
    <div>adsaw</div>
  )
};

export default StackStructure;
