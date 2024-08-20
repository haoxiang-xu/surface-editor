import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react";
import { STACK_COMPONENT_CONFIG } from "../../CONSTs/stackComponentConfig.js";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import { RootStackContexts } from "../../DATA_MANAGERs/root_stack_manager/root_stack_contexts";
import { StackStructureContexts } from "./stack_structure_contexts";
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

const StackFrame = ({ id, position, size }) => {
  const { stackStructure } = useContext(StackStructureContexts);
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,

        borderRadius: 8,
        backgroundColor: `rgb(${R}, ${G}, ${B})`,
        border: `1px solid rgba(${R + 12}, ${G + 12}, ${B + 12}, 1)`,
        boxSizing: "border-box",
      }}
    >
      <StackComponentContainer
        id={id}
        component_type={stackStructure[id].type}
        stack_structure_type={"horizontal_stack"}
        code_editor_container_ref_index={
          stackStructure[id].code_editor_container_ref_index
        }
        width={size.width}
      />
    </div>
  );
};
const StackResizer = ({ id, position, size, adjust_size }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x + size.width,
        top: position.y,
        width: default_component_padding * 2,
        height: size.height,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 4,
          height: 50,
          backgroundColor: `rgb(${R + 12}, ${G + 12}, ${B + 12})`,
          transform: "translate(-50%, -50%)",

          borderRadius: 2,
        }}
      ></div>
    </div>
  );
};
const HorizontalStack = ({ id, position, size }) => {
  const { stackStructure } = useContext(StackStructureContexts);
  const [subItemStructure, setSubItemStructure] = useState(null);
  const [subItemComponents, setSubItemComponents] = useState(null);

  useEffect(() => {
    const first_time_render = () => {
      const parent_position = { ...position };
      const parent_size = { ...size };

      const sub_items = stackStructure[id].sub_items;
      let new_sub_item_structure = {};
      let position_x = default_component_padding;
      let position_y = default_component_padding;
      let size_width =
        (parent_size.width -
          2 * default_component_padding -
          (sub_items.length - 1) * 2 * default_component_padding) /
        stackStructure[id].sub_items.length;
      let size_height = parent_size.height - 2 * default_component_padding;
      let index = 0;

      sub_items.forEach((sub_item_id) => {
        new_sub_item_structure[sub_item_id] = {
          index: index,
          type: stackStructure[sub_item_id].type,
          position: { x: position_x, y: position_y },
          size: { width: size_width, height: size_height },
        };
        index += 1;
        position_x += size_width + 2 * default_component_padding;
      });
      setSubItemStructure(new_sub_item_structure);
    };
    if (size.width > 0 && size.height > 0 && !subItemStructure) {
      first_time_render();
    }
  }, [stackStructure, position, size]);
  useEffect(() => {
    const render_sub_items = () => {
      let new_sub_item_components = {};
      Object.keys(subItemStructure).forEach((sub_item_id) => {
        switch (subItemStructure[sub_item_id].type) {
          case "horizontal_stack":
            new_sub_item_components[sub_item_id] = (
              <HorizontalStack
                key={sub_item_id}
                id={sub_item_id}
                position={subItemStructure[sub_item_id].position}
                size={subItemStructure[sub_item_id].size}
              />
            );
            break;
          default:
            new_sub_item_components[sub_item_id] = (
              <StackFrame
                key={sub_item_id}
                id={sub_item_id}
                position={subItemStructure[sub_item_id].position}
                size={subItemStructure[sub_item_id].size}
              />
            );
            if (
              subItemStructure[sub_item_id].index <
              stackStructure[id].sub_items.length - 1
            )
              new_sub_item_components[sub_item_id + "_resizer"] = (
                <StackResizer
                  key={sub_item_id + "_resizer"}
                  id={sub_item_id}
                  position={subItemStructure[sub_item_id].position}
                  size={subItemStructure[sub_item_id].size}
                  adjust_size={null}
                />
              );

            break;
        }
      });
      setSubItemComponents(new_sub_item_components);
    };
    if (!subItemStructure) return;
    render_sub_items();
  }, [subItemStructure]);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {subItemComponents
        ? Object.keys(subItemComponents).map((sub_item_id) => {
            return subItemComponents[sub_item_id];
          })
        : null}
    </div>
  );
};

const StackStructure = () => {
  const [rootPosition, setRootPosition] = useState({ x: 0, y: 0 });
  const [rootSize, setRootSize] = useState({ width: 0, height: 0 });

  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);

  useEffect(() => {
    const update_root_size_base_on_window_size = () => {
      setRootSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", update_root_size_base_on_window_size);
    update_root_size_base_on_window_size();

    return () => {
      window.removeEventListener(
        "resize",
        update_root_size_base_on_window_size
      );
    };
  }, []);

  return (
    <StackStructureContexts.Provider
      value={{
        stackStructure,
        setStackStructure,
      }}
    >
      <HorizontalStack
        id={stackStructure["root"].id}
        position={rootPosition}
        size={rootSize}
      />
    </StackStructureContexts.Provider>
  );
};

export default StackStructure;
