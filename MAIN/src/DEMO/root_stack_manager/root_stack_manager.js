import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react.js";
import { STACK_COMPONENT_CONFIG } from "../../CONSTs/stackComponentConfig.js";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts.js";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts.js";
import { RootStackContexts } from "./root_stack_contexts";
/* { import contexts } ---------------------------------------------------------------------- */

const FAKE_STACK_STRUCTURE = {
  root: {
    id: "root",
    type: "horizontal_stack",
    sub_items: ["surface_explorer_0004", "surface_explorer_0005"],
  },
  surface_explorer_0004: {
    id: "surface_explorer_0004",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0005: {
    id: "surface_explorer_0005",
    type: "surface_explorer",
    sub_items: [],
  },
};

const default_component_padding = 6;

const R = 30;
const G = 30;
const B = 30;

const StackComponentContainer = ({
  id,
  component_type,
  stack_structure_type,
  code_editor_container_ref_index,
  width,
}) => {
  //console.log("RDM/RCM/stack_frame/", id, new Date().getTime());
  const [StackFrameComponent, setStackFrameComponent] = useState(null);
  useEffect(() => {
    async function loadComponent() {
      const component_path = STACK_COMPONENT_CONFIG[component_type].path;
      const { default: LoadedComponent } = await import(
        `../../COMPONENTs/${component_path}`
      );
      setStackFrameComponent(() => LoadedComponent);
    }

    loadComponent();
  }, [component_type]);

  /* { mode } ================================================================================================= */
  const [mode, setMode] = useState(null);
  useEffect(() => {
    if (stack_structure_type === "horizontal_stack") {
      width <= 50
        ? setMode(stack_structure_type + "_vertical_mode")
        : setMode(stack_structure_type + "_horizontal_mode");
    }
  }, [width]);
  /* { mode } ================================================================================================= */

  /* { data } ------------------------------------------------------------------------------------------------- */
  const { access_storage_by_id, update_storage_by_id } =
    useContext(RootDataContexts);
  const [data, setData] = useCustomizedState(
    access_storage_by_id(id),
    compareJson
  );
  useEffect(() => {
    update_storage_by_id(String(id), data);
  }, [data]);
  /* { data } ------------------------------------------------------------------------------------------------- */

  /* { command } ============================================================================================== */
  const { cmd, pop_command_by_id, load_context_menu } =
    useContext(RootCommandContexts);
  const [command, setCommand] = useCustomizedState([], compareJson);
  useEffect(() => {
    if (cmd[id] && cmd[id].length > 0 && command.length === 0) {
      setCommand(cmd[id][0]);
    }
  }, [cmd]);
  useEffect(() => {
    if (command.length === 0) {
      pop_command_by_id(id);
    }
  }, [command]);
  const load_contextMenu = (e, contextStructure) => {
    load_context_menu(e, id, contextStructure);
  };
  const command_executed = () => {
    setCommand([]);
  };
  /* { command } ============================================================================================== */

  /* { drag and drop } ---------------------------------------------------------------------------------------- */
  const { item_on_drag, item_on_drop } = useContext(RootCommandContexts);
  /* { drag and drop } ---------------------------------------------------------------------------------------- */

  return (
    <>
      {StackFrameComponent ? (
        <StackFrameComponent
          id={id}
          width={width}
          mode={mode}
          command={command}
          setCommand={setCommand}
          load_contextMenu={load_contextMenu}
          command_executed={command_executed}
          data={data}
          setData={setData}
          item_on_drag={item_on_drag}
          item_on_drop={item_on_drop}
          code_editor_container_ref_index={code_editor_container_ref_index}
        />
      ) : null}
    </>
  );
};

const RootStackManager = () => {

};

export default RootStackManager;
