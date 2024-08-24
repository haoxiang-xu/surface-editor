import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  memo,
} from "react";
import { throttle } from "lodash";
import {
  useCustomizedState,
  compareJson,
} from "../../BUILTIN_COMPONENTs/customized_react/customized_react.js";
import { STACK_COMPONENT_CONFIG } from "../../CONSTs/stackComponentConfig.js";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts.js";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts.js";
import { RootStackContexts } from "./root_stack_contexts";

/* {} */
import { globalDragAndDropContexts } from "../../CONTEXTs/globalDragAndDropContexts";
import { stackStructureDragAndDropContexts } from "../../CONTEXTs/stackStructureDragAndDropContexts";
/* { import contexts } ---------------------------------------------------------------------- */

const TESTING_STACK_STRUCTURE_1 = {
  root: {
    id: "root",
    type: "horizontal_stack",
    sub_items: [
      "surface_explorer_0001",
      "surface_explorer_0002",
      "vertical_stack_0001",
      "surface_explorer_0003",
      "surface_explorer_0004",
      "surface_explorer_0005",
    ],
  },
  surface_explorer_0001: {
    id: "surface_explorer_0001",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0002: {
    id: "surface_explorer_0002",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0003: {
    id: "surface_explorer_0003",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0004: {
    id: "surface_explorer_0004",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0005: {
    id: "surface_explorer_0005",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  vertical_stack_0001: {
    id: "vertical_stack_0001",
    type: "vertical_stack",
    parent_id: "root",
    sub_items: [
      "surface_explorer_0006",
      "surface_explorer_0007",
      "horizontal_stack_0001",
      "surface_explorer_0008",
      "surface_explorer_0009",
    ],
  },
  surface_explorer_0006: {
    id: "surface_explorer_0006",
    type: "surface_explorer",
    parent_id: "vertical_stack_0001",
    sub_items: [],
  },
  surface_explorer_0007: {
    id: "surface_explorer_0007",
    type: "surface_explorer",
    parent_id: "vertical_stack_0001",
    sub_items: [],
  },
  surface_explorer_0008: {
    id: "surface_explorer_0008",
    type: "surface_explorer",
    parent_id: "vertical_stack_0001",
    sub_items: [],
  },
  surface_explorer_0009: {
    id: "surface_explorer_0009",
    type: "surface_explorer",
    parent_id: "vertical_stack_0001",
    sub_items: [],
  },
  horizontal_stack_0001: {
    id: "horizontal_stack_0001",
    parent_id: "vertical_stack_0001",
    type: "horizontal_stack",
    sub_items: [
      "surface_explorer_0014",
      "surface_explorer_0015",
      "surface_explorer_0016",
      "vertical_stack_0002",
    ],
  },
  surface_explorer_0014: {
    id: "surface_explorer_0014",
    parent_id: "horizontal_stack_0001",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0015: {
    id: "surface_explorer_0015",
    parent_id: "horizontal_stack_0001",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0016: {
    id: "surface_explorer_0016",
    parent_id: "horizontal_stack_0001",
    type: "surface_explorer",
    sub_items: [],
  },
  vertical_stack_0002: {
    id: "vertical_stack_0002",
    type: "vertical_stack",
    parent_id: "horizontal_stack_0001",
    sub_items: [
      "surface_explorer_0010",
      "surface_explorer_0011",
      "surface_explorer_0012",
      "surface_explorer_0013",
    ],
  },
  surface_explorer_0010: {
    id: "surface_explorer_0010",
    parent_id: "vertical_stack_0002",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0011: {
    id: "surface_explorer_0011",
    parent_id: "vertical_stack_0002",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0012: {
    id: "surface_explorer_0012",
    parent_id: "vertical_stack_0002",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0013: {
    id: "surface_explorer_0013",
    parent_id: "vertical_stack_0002",
    type: "surface_explorer",
    sub_items: [],
  },
};
const TESTING_STACK_STRUCTURE_2 = {
  root: {
    id: "root",
    type: "horizontal_stack",
    sub_items: ["surface_explorer_0001", "vertical_stack_0001", "test_0001"],
  },
  surface_explorer_0001: {
    id: "surface_explorer_0001",
    parent_id: "root",
    type: "surface_explorer",
    sub_items: [],
  },
  vertical_stack_0001: {
    id: "vertical_stack_0001",
    parent_id: "root",
    type: "vertical_stack",
    sub_items: ["horizontal_stack_0001", "test_0002"],
  },
  test_0001: {
    id: "test_0001",
    parent_id: "root",
    type: "test",
    sub_items: [],
  },
  test_0002: {
    id: "test_0002",
    parent_id: "vertical_stack_0001",
    type: "test",
    sub_items: [],
  },
  horizontal_stack_0001: {
    id: "horizontal_stack_0001",
    parent_id: "vertical_stack_0001",
    type: "horizontal_stack",
    sub_items: ["monaco_editor_0002", "monaco_editor_0003"],
  },
  monaco_editor_0002: {
    id: "monaco_editor_0002",
    parent_id: "horizontal_stack_0001",
    type: "monaco_editor",
    code_editor_container_ref_index: 1,
    sub_items: [],
  },
  monaco_editor_0003: {
    id: "monaco_editor_0003",
    parent_id: "horizontal_stack_0001",
    type: "monaco_editor",
    code_editor_container_ref_index: 2,
    sub_items: [],
  },
};

const default_component_padding = 8;
const default_component_border_radius = 8;
const default_resizer_size = 8;
const default_resizer_layer = 12;

const R = 30;
const G = 30;
const B = 30;

const MIN = 60;

const TOP = 36;
const RIGHT = default_component_padding;
const BOTTOM = default_component_padding;
const LEFT = default_component_padding;

const StackComponentContainer = React.memo(({
  id,
  component_type,
  stack_structure_type,
  code_editor_container_ref_index,
  width,
}) => {
  /* Children Item Drag and Drop  ============================================================================================================================================ */
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [dragCommand, setDragCommand] = useState(null);
  /* Children Item Drag and Drop ----------------------------------------------------------------- */
  /* Stack Container Drag and Drop ------------------------------------------------------------ */
  const [onDragIndex, setOnDragIndex] = useState(-1);
  const [onDropIndex, setOnDropIndex] = useState(-1);

  const onStackItemDragStart = (e, index) => {
    unload_context_menu();
    e.dataTransfer.setDragImage(GHOST_IMAGE, 0, 0);

    setOnDragIndex(index);
  };
  const onStackItemDragEnd = (e) => {
    let fromIndex = -1;
    let toIndex = -1;
    const editedStacks = [...stacks];
    const dragedItems = editedStacks.splice(onDragIndex, 2);
    fromIndex = onDragIndex;

    if (onDropIndex !== -1 && onDropIndex === stacks.length - 1) {
      toIndex = onDropIndex - 2;
    } else if (onDropIndex !== -1 && onDropIndex % 2 === 0) {
      if (onDragIndex < onDropIndex) {
        toIndex = onDropIndex - 2;
      } else {
        toIndex = onDropIndex;
      }
    } else if (onDropIndex !== -1 && onDropIndex % 2 === 1) {
      if (onDragIndex < onDropIndex) {
        toIndex = onDropIndex - 1;
      } else {
        toIndex = onDropIndex + 1;
      }
    }

    if (onDropIndex !== -1) {
      updateStackStructureContainerIndex(
        parseInt(fromIndex / 2),
        parseInt(toIndex / 2)
      );
      editedStacks.splice(toIndex, 0, ...dragedItems);
      setStacks(editedStacks);
    }
    setOnDragIndex(-1);
    setOnDropIndex(-1);
  };
  /* Stack Container Drag and Drop ============================================================================================================================================ */

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
    } else {
      width <= 50
        ? setMode("horizontal_stack_vertical_mode")
        : setMode("horizontal_stack_horizontal_mode");
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
    <stackStructureDragAndDropContexts.Provider
      value={{
        onDropIndex,
        setOnDropIndex,
        onDragIndex,
        setOnDragIndex,
        onStackItemDragStart,
        onStackItemDragEnd,
      }}
    >
      <globalDragAndDropContexts.Provider
        value={{
          draggedItem,
          setDraggedItem,
          draggedOverItem,
          setDraggedOverItem,
          dragCommand,
          setDragCommand,
        }}
      >
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
      </globalDragAndDropContexts.Provider>
    </stackStructureDragAndDropContexts.Provider>
  );
});
const StackTestingContainer = ({ id }) => {
  return (
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        color: "white",
        fontSize: 36,
        userSelect: "none",

        opacity: 0.16,
      }}
    >
      {id.slice(-2)}
    </span>
  );
};

const StackFrameResizer = ({ id, index, stack_structure_type }) => {
  const {
    stackStructure,
    adjust_horizontal_sub_item_filter,
    adjust_vertical_sub_item_filter,
    apply_filter,
    onFrameResize,
    setOnFrameResize,
  } = useContext(RootStackContexts);

  const [onHover, setOnHover] = useState(false);
  const [onPause, setOnPause] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [zIndex, setZIndex] = useState(null);
  const [previousMousePosition, setPerviousMousePosition] = useState(null);
  const [currentMousePosition, setCurrentMousePosition] = useState(null);

  const [resizerSize, setResizerSize] = useState(
    MIN - default_resizer_size * 2
  );
  const [resizerColor, setResizerColor] = useState(
    `rgba(${R + 16}, ${G + 16}, ${B + 16}, 1)`
  );
  const [borderRadius, setBorderRadius] = useState(
    default_component_border_radius
  );
  const handle_mouse_up = (event) => {
    window.removeEventListener("mouseup", handle_mouse_up);
    window.removeEventListener("mousemove", handle_mouse_move);
    document.body.style.cursor = "default";
    setPerviousMousePosition(null);
    setCurrentMousePosition(null);
    setOnClick(false);
    setOnFrameResize(false);
  };
  const handle_mouse_move = throttle((event) => {
    setCurrentMousePosition({ x: event.clientX, y: event.clientY });
  }, 5);
  const handle_mouse_down = (event) => {
    setPerviousMousePosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("mouseup", handle_mouse_up);
    window.addEventListener("mousemove", handle_mouse_move);
    if (stack_structure_type === "horizontal_stack") {
      document.body.style.cursor = "ew-resize";
    } else {
      document.body.style.cursor = "ns-resize";
    }
    setOnClick(true);
    setOnFrameResize(true);
  };
  useEffect(() => {
    if (!onClick) {
      apply_filter();
    }
    if (!currentMousePosition || !previousMousePosition) return;
    if (stack_structure_type === "horizontal_stack") {
      adjust_horizontal_sub_item_filter(
        stackStructure[id].parent_id,
        index,
        currentMousePosition.x - previousMousePosition.x
      );
    } else {
      adjust_vertical_sub_item_filter(
        stackStructure[id].parent_id,
        index,
        currentMousePosition.y - previousMousePosition.y
      );
    }
  }, [currentMousePosition, previousMousePosition, onClick]);

  useEffect(() => {
    if (onClick && onFrameResize) {
      setResizerSize(`calc(100% - ${default_resizer_size * 2}px)`);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${67}, ${105}, ${180}, 1)`);
      setZIndex(default_component_border_radius);
      return;
    }
    if (onFrameResize) {
      setResizerSize(MIN - default_resizer_size * 2);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${R + 16}, ${G + 16}, ${B + 16}, 1)`);
      setZIndex(null);
      return;
    }
    if (onHover && onPause) {
      setResizerSize(`calc(100% - ${default_resizer_size * 2}px)`);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${67}, ${105}, ${180}, 1)`);
      setZIndex(default_component_border_radius);
      return;
    }
    setResizerSize(MIN - default_resizer_size * 2);
    setBorderRadius(default_component_border_radius);
    setResizerColor(`rgba(${R + 16}, ${G + 16}, ${B + 16}, 1)`);
    setZIndex(null);
  }, [onHover, onPause, onClick]);

  switch (stack_structure_type) {
    case "horizontal_stack":
      return (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: default_resizer_size,
            height: "100%",

            cursor: "ew-resize",
            zIndex: zIndex,
          }}
          onMouseEnter={() => {
            setOnHover(true);
            setOnPause(true);
          }}
          onMouseLeave={() => {
            setOnHover(false);
            setOnPause(false);
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            handle_mouse_down(event);
          }}
        >
          <div
            style={{
              transition: "height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
              position: "absolute",
              right: "50%",
              top: "50%",
              transform: "translate(50%, -50%)",
              width: default_resizer_size / 2,
              height: resizerSize,

              borderRadius: borderRadius,
              cursor: "ew-resize",
              backgroundColor: resizerColor,
              userSelect: "none",
              pointerEvents: "none",
            }}
          ></div>
        </div>
      );
    case "vertical_stack":
      return (
        <div
          draggable="false"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,

            width: "100%",
            height: default_resizer_size,

            cursor: "ns-resize",
            zIndex: zIndex,
          }}
          onMouseEnter={() => {
            setOnHover(true);
            setOnPause(true);
          }}
          onMouseLeave={() => {
            setOnHover(false);
            setOnPause(false);
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            setPerviousMousePosition({ x: event.clientX, y: event.clientY });
            handle_mouse_down(event);
          }}
        >
          <div
            draggable="false"
            style={{
              transition: "width 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
              position: "absolute",
              right: "50%",
              top: "50%",
              transform: "translate(50%, -50%)",
              width: resizerSize,
              height: default_resizer_size / 2,

              borderRadius: borderRadius,
              cursor: "ns-resize",
              backgroundColor: resizerColor,
              userSelect: "none",
            }}
            onMouseEnter={() => {
              setOnHover(true);
              setOnPause(true);
            }}
          ></div>
        </div>
      );
    default:
      return null;
  }
};
const StackFrame = ({
  id,
  index,
  parent_stack_type,
  parent_rerendered,
  end,
}) => {
  const { stackStructure, containers, filters, onFrameResize } =
    useContext(RootStackContexts);
  const [style, setStyle] = useState({
    transition:
      "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
  });
  useEffect(() => {
    if (onFrameResize) {
      setStyle({
        transition: "none",
      });
    } else {
      setStyle({
        transition:
          "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
      });
    }
  }, [onFrameResize]);
  return (
    <div
      style={{
        transition: style.transition,
        position: "absolute",
        top: filters[id] ? filters[id].position.y : containers[id].position.y,
        left: filters[id] ? filters[id].position.x : containers[id].position.x,
        width: filters[id]
          ? filters[id].size.width + default_resizer_size / 2
          : containers[id].size.width + default_resizer_size / 2,
        height: filters[id]
          ? filters[id].size.height + default_resizer_size / 2
          : containers[id].size.height + default_resizer_size / 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: default_resizer_size / 2,
          left: default_resizer_size / 2,
          bottom: default_resizer_size,
          right: default_resizer_size,

          border: `1px solid rgba(${R + 8}, ${G + 8}, ${B + 8}, 1)`,
          backgroundColor: `rgba(${R}, ${G}, ${B}, 1)`,
          boxShadow: "0px 0px 4px 2px rgba(0,0,0,0.16)",
          borderRadius: default_component_border_radius,
          overflow: "hidden",
        }}
      >
        {stackStructure[id].type === "test" ? (
          <StackTestingContainer id={id} />
        ) : (
          <StackComponentContainer
            id={id}
            width={containers[id].size.width}
            component_type={stackStructure[id].type}
            code_editor_container_ref_index={1}
          />
        )}
      </div>
      {end ? null : (
        <StackFrameResizer
          id={id}
          index={index}
          stack_structure_type={parent_stack_type}
        />
      )}
    </div>
  );
};
const VerticalStack = ({
  id,
  index,
  parent_stack_type,
  parent_rerendered,
  end,
}) => {
  const {
    stackStructure,
    containers,
    filters,
    calculate_vertical_intial_position_and_size,
    calculate_vertical_position_and_size,
    onFrameResize,
  } = useContext(RootStackContexts);
  const [style, setStyle] = useState({
    transition:
      "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
  });
  useEffect(() => {
    if (onFrameResize) {
      setStyle({
        transition: "none",
      });
    } else {
      setStyle({
        transition:
          "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
      });
    }
  }, [onFrameResize]);
  const [rerendered, setRerendered] = useState(0);

  useEffect(() => {
    if (rerendered === 0) {
      calculate_vertical_intial_position_and_size(id);
    } else {
      calculate_vertical_position_and_size(id);
    }
    setRerendered((prev) => prev + 1);
  }, [parent_rerendered]);

  return (
    <div
      style={{
        transition: style.transition,
        position: "absolute",
        top: filters[id] ? filters[id].position.y : containers[id].position.y,
        left: filters[id] ? filters[id].position.x : containers[id].position.x,
        width: filters[id]
          ? filters[id].size.width + default_resizer_size / 2
          : containers[id].size.width + default_resizer_size / 2,
        height: filters[id]
          ? filters[id].size.height + default_resizer_size / 2
          : containers[id].size.height + default_resizer_size / 2,
        

        overflow: "hidden",
      }}
    >
      {rerendered > 0
        ? stackStructure[id].sub_items.map((sub_item_id, index) => {
            switch (stackStructure[sub_item_id].type) {
              case "horizontal_stack":
                return (
                  <HorizontalStack
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
              case "vertical_stack":
                return (
                  <VerticalStack
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
              default:
                return (
                  <StackFrame
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
            }
          })
        : null}
      {end ? null : (
        <StackFrameResizer
          id={id}
          index={index}
          stack_structure_type={parent_stack_type}
        />
      )}
    </div>
  );
};
const HorizontalStack = ({
  id,
  index,
  parent_stack_type,
  parent_rerendered,
  end,
}) => {
  const {
    stackStructure,
    containers,
    filters,
    calculate_horizontal_intial_position_and_size,
    calculate_horizontal_position_and_size,
    onFrameResize,
  } = useContext(RootStackContexts);
  const [style, setStyle] = useState({
    transition:
      "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
  });
  useEffect(() => {
    if (onFrameResize) {
      setStyle({
        transition: "none",
      });
    } else {
      setStyle({
        transition:
          "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
      });
    }
  }, [onFrameResize]);
  const [rerendered, setRerendered] = useState(0);

  useEffect(() => {
    if (rerendered === 0) {
      calculate_horizontal_intial_position_and_size(id);
    } else {
      calculate_horizontal_position_and_size(id);
    }
    setRerendered((prev) => prev + 1);
  }, [parent_rerendered]);

  return (
    <div
      style={{
        transition: style.transition,
        position: "absolute",
        top: filters[id] ? filters[id].position.y : containers[id].position.y,
        left: filters[id] ? filters[id].position.x : containers[id].position.x,
        width: filters[id]
          ? filters[id].size.width + default_resizer_size / 2
          : containers[id].size.width + default_resizer_size / 2,
        height: filters[id]
          ? filters[id].size.height + default_resizer_size / 2
          : containers[id].size.height + default_resizer_size / 2,
        overflow: "hidden",
      }}
    >
      {rerendered > 0
        ? stackStructure[id].sub_items.map((sub_item_id, index) => {
            switch (stackStructure[sub_item_id].type) {
              case "horizontal_stack":
                return (
                  <HorizontalStack
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
              case "vertical_stack":
                return (
                  <VerticalStack
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
              default:
                return (
                  <StackFrame
                    key={sub_item_id}
                    id={sub_item_id}
                    index={index}
                    parent_rerendered={rerendered}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                  />
                );
            }
          })
        : null}
      {end ? null : (
        <StackFrameResizer
          id={id}
          index={index}
          stack_structure_type={parent_stack_type}
        />
      )}
    </div>
  );
};

const RootStackManager = () => {
  const [stackStructure, setStackStructure] = useState(
    TESTING_STACK_STRUCTURE_2
  );
  const [rootContainer, setRootContainer] = useState(null);

  const [containers, setContainers] = useCustomizedState({}, compareJson);
  const [filters, setFilters] = useCustomizedState({}, compareJson);

  const [rerendered, setRerendered] = useState(0);

  /* { State } ------ */
  const [onFrameResize, setOnFrameResize] = useState(false);
  /* { State } ------ */

  const calculate_horizontal_intial_position_and_size = useCallback(
    (parent_container_id) => {
      const adjusted_containers = { ...containers };
      const parent_container = adjusted_containers[parent_container_id];

      const sub_container_width = parseInt(
        parent_container.size.width /
          stackStructure[parent_container_id].sub_items.length
      );
      const sub_container_height = parent_container.size.height;

      let sub_container_x = 0;
      const sub_container_y = 0;

      let cutoff_width = parent_container.size.width;

      for (
        let i = 0;
        i < stackStructure[parent_container_id].sub_items.length;
        i++
      ) {
        if (i === stackStructure[parent_container_id].sub_items.length - 1) {
          adjusted_containers[
            stackStructure[parent_container_id].sub_items[i]
          ] = {
            position: { x: sub_container_x, y: sub_container_y },
            size: { width: cutoff_width, height: sub_container_height },
          };
        } else {
          adjusted_containers[
            stackStructure[parent_container_id].sub_items[i]
          ] = {
            position: { x: sub_container_x, y: sub_container_y },
            size: { width: sub_container_width, height: sub_container_height },
          };
        }
        sub_container_x += sub_container_width;
        cutoff_width -= sub_container_width;
      }
      setContainers(adjusted_containers);
    },
    [stackStructure, containers, filters]
  );
  const calculate_horizontal_position_and_size = useCallback(
    (parent_container_id) => {
      let adjusted_containers = { ...containers };
      const parent_container = adjusted_containers[parent_container_id];

      const last_sub_container_id =
        stackStructure[parent_container_id].sub_items[
          stackStructure[parent_container_id].sub_items.length - 1
        ];
      const pervious_parent_width =
        adjusted_containers[last_sub_container_id].position.x +
        adjusted_containers[last_sub_container_id].size.width;

      for (
        let i = 0;
        i < stackStructure[parent_container_id].sub_items.length;
        i++
      ) {
        const sub_container_id =
          stackStructure[parent_container_id].sub_items[i];
        if (adjusted_containers[sub_container_id]) {
          adjusted_containers[sub_container_id].size.height =
            parent_container.size.height;
        }
      }

      if (pervious_parent_width === parent_container.size.width) {
        /* { | } ==================================================================================================================== */
        return;
      } else if (pervious_parent_width < parent_container.size.width) {
        /* { -> } =================================================================================================================== */
        let cutoff_width = parent_container.size.width;
        for (
          let i = stackStructure[parent_container_id].sub_items.length - 1;
          i >= 0;
          i--
        ) {
          const sub_container_id =
            stackStructure[parent_container_id].sub_items[i];
          const next_sub_container_id =
            stackStructure[parent_container_id].sub_items[i + 1];
          const prev_sub_container_id =
            stackStructure[parent_container_id].sub_items[i - 1];

          if (
            !next_sub_container_id &&
            pervious_parent_width <
              stackStructure[parent_container_id].sub_items.length * MIN
          ) {
            /* { | -> [] } =========================================================================================================== */
            adjusted_containers[sub_container_id].size.width = Math.max(
              cutoff_width -
                (stackStructure[parent_container_id].sub_items.length - 1) *
                  MIN,
              MIN
            );
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            adjusted_containers[sub_container_id].position.x =
              cutoff_width - adjusted_containers[sub_container_id].size.width;

            cutoff_width -= adjusted_containers[sub_container_id].size.width;
            if (cutoff_width <= MIN) {
              break;
            }
          } else if (
            next_sub_container_id &&
            pervious_parent_width <
              stackStructure[parent_container_id].sub_items.length * MIN
          ) {
            /* { | -> | } =========================================================================================================== */
            adjusted_containers[sub_container_id].size.width = MIN;
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            adjusted_containers[sub_container_id].position.x =
              cutoff_width - adjusted_containers[sub_container_id].size.width;

            cutoff_width -= adjusted_containers[sub_container_id].size.width;

            if (cutoff_width <= MIN) {
              break;
            }
          } else {
            /* { OK -> [] } ========================================================================================================= */
            adjusted_containers[sub_container_id].size.width = Math.max(
              cutoff_width - adjusted_containers[sub_container_id].position.x,
              MIN
            );
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            cutoff_width -= adjusted_containers[sub_container_id].size.width;
            break;
          }
        }
      } else {
        /* { <- } =================================================================================================================== */
        let cutoff_width = parent_container.size.width;
        for (
          let i = stackStructure[parent_container_id].sub_items.length - 1;
          i >= 0;
          i--
        ) {
          const sub_container_id =
            stackStructure[parent_container_id].sub_items[i];
          const prev_sub_container_id =
            stackStructure[parent_container_id].sub_items[i - 1];

          if (
            /* { | <- } ============================================================================+================================ */
            !prev_sub_container_id
          ) {
            adjusted_containers[sub_container_id].size.width = Math.max(
              cutoff_width - adjusted_containers[sub_container_id].position.x,
              MIN
            );
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            adjusted_containers[sub_container_id].position.x = 0;
            adjusted_containers[sub_container_id].position.y = 0;

            cutoff_width -= adjusted_containers[sub_container_id].size.width;
          } else if (
            /* { MIN <- } ============================================================================+============================== */
            prev_sub_container_id &&
            adjusted_containers[prev_sub_container_id].size.width === MIN
          ) {
            adjusted_containers[sub_container_id].size.width = Math.max(
              cutoff_width - adjusted_containers[sub_container_id].position.x,
              MIN
            );
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            adjusted_containers[sub_container_id].position.x = Math.max(
              cutoff_width - adjusted_containers[sub_container_id].size.width,
              0
            );
            adjusted_containers[sub_container_id].position.y = 0;

            cutoff_width -= adjusted_containers[sub_container_id].size.width;
          } else if (
            /* { OK <- } ============================================================================================================ */
            prev_sub_container_id
          ) {
            adjusted_containers[sub_container_id].size.width = Math.max(
              cutoff_width - adjusted_containers[sub_container_id].position.x,
              MIN
            );
            adjusted_containers[sub_container_id].size.height =
              parent_container.size.height;
            adjusted_containers[sub_container_id].position.x =
              cutoff_width - adjusted_containers[sub_container_id].size.width;
            adjusted_containers[sub_container_id].position.y = 0;

            cutoff_width -= adjusted_containers[sub_container_id].size.width;

            if (adjusted_containers[sub_container_id].size.width !== MIN) {
              break;
            }
          }
        }
      }
      setContainers(adjusted_containers);
    },
    [stackStructure, containers, filters]
  );
  const adjust_horizontal_sub_item_filter = useCallback(
    (parent_id, sub_item_index, difference) => {
      let adjusted_filters = { ...filters };
      const applying_containers = { ...containers };

      const sub_container_id =
        stackStructure[parent_id].sub_items[sub_item_index];
      const next_sub_container_id =
        stackStructure[parent_id].sub_items[sub_item_index + 1];

      const max_width =
        applying_containers[sub_container_id].size.width +
        applying_containers[next_sub_container_id].size.width -
        MIN;

      adjusted_filters[sub_container_id] = {
        size: {
          width: Math.min(
            Math.max(
              applying_containers[sub_container_id].size.width + difference,
              MIN
            ),
            max_width
          ),
          height: applying_containers[sub_container_id].size.height,
        },
        position: {
          x: applying_containers[sub_container_id].position.x,
          y: 0,
        },
      };
      adjusted_filters[next_sub_container_id] = {
        size: {
          width: Math.min(
            Math.max(
              applying_containers[next_sub_container_id].size.width -
                difference,
              MIN
            ),
            max_width
          ),
          height: applying_containers[next_sub_container_id].size.height,
        },
        position: {
          x: Math.min(
            Math.max(
              applying_containers[sub_container_id].position.x + MIN,
              applying_containers[next_sub_container_id].position.x + difference
            ),
            applying_containers[sub_container_id].position.x + max_width
          ),
          y: 0,
        },
      };
      setFilters(adjusted_filters);
    },
    [stackStructure, containers, filters]
  );

  const calculate_vertical_intial_position_and_size = useCallback(
    (parent_container_id) => {
      const adjusted_containers = { ...containers };
      const parent_container = adjusted_containers[parent_container_id];

      const sub_container_height = parseInt(
        parent_container.size.height /
          stackStructure[parent_container_id].sub_items.length
      );
      const sub_container_width = parent_container.size.width;

      let sub_container_y = 0;
      const sub_container_x = 0;

      let cutoff_height = parent_container.size.height;

      for (
        let i = 0;
        i < stackStructure[parent_container_id].sub_items.length;
        i++
      ) {
        if (i === stackStructure[parent_container_id].sub_items.length - 1) {
          adjusted_containers[
            stackStructure[parent_container_id].sub_items[i]
          ] = {
            position: { x: sub_container_x, y: sub_container_y },
            size: { width: sub_container_width, height: cutoff_height },
          };
        } else {
          adjusted_containers[
            stackStructure[parent_container_id].sub_items[i]
          ] = {
            position: { x: sub_container_x, y: sub_container_y },
            size: { width: sub_container_width, height: sub_container_height },
          };
        }
        sub_container_y += sub_container_height;
        cutoff_height -= sub_container_height;
      }
      setContainers(adjusted_containers);
    },
    [stackStructure, containers, filters]
  );
  const calculate_vertical_position_and_size = useCallback(
    (parent_container_id) => {
      let adjusted_containers = { ...containers };
      const parent_container = adjusted_containers[parent_container_id];

      const last_sub_container_id =
        stackStructure[parent_container_id].sub_items[
          stackStructure[parent_container_id].sub_items.length - 1
        ];
      const pervious_parent_height =
        adjusted_containers[last_sub_container_id].position.y +
        adjusted_containers[last_sub_container_id].size.height;

      for (
        let i = 0;
        i < stackStructure[parent_container_id].sub_items.length;
        i++
      ) {
        const sub_container_id =
          stackStructure[parent_container_id].sub_items[i];
        if (adjusted_containers[sub_container_id]) {
          adjusted_containers[sub_container_id].size.width =
            parent_container.size.width;
        }
      }

      if (pervious_parent_height === parent_container.size.height) {
        /* { | } ==================================================================================================================== */
        return;
      } else if (pervious_parent_height < parent_container.size.height) {
        /* { -> } =================================================================================================================== */

        let cutoff_height = parent_container.size.height;
        for (
          let i = stackStructure[parent_container_id].sub_items.length - 1;
          i >= 0;
          i--
        ) {
          const sub_container_id =
            stackStructure[parent_container_id].sub_items[i];
          const next_sub_container_id =
            stackStructure[parent_container_id].sub_items[i + 1];
          const prev_sub_container_id =
            stackStructure[parent_container_id].sub_items[i - 1];

          if (
            !next_sub_container_id &&
            pervious_parent_height <
              stackStructure[parent_container_id].sub_items.length * MIN
          ) {
            /* { | -> [] } =========================================================================================================== */
            adjusted_containers[sub_container_id].size.height = Math.max(
              cutoff_height -
                (stackStructure[parent_container_id].sub_items.length - 1) *
                  MIN,
              MIN
            );
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            adjusted_containers[sub_container_id].position.y =
              cutoff_height - adjusted_containers[sub_container_id].size.height;

            cutoff_height -= adjusted_containers[sub_container_id].size.height;
            if (cutoff_height <= MIN) {
              break;
            }
          } else if (
            next_sub_container_id &&
            pervious_parent_height <
              stackStructure[parent_container_id].sub_items.length * MIN
          ) {
            /* { | -> | } =========================================================================================================== */
            adjusted_containers[sub_container_id].size.height = MIN;
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            adjusted_containers[sub_container_id].position.y =
              cutoff_height - adjusted_containers[sub_container_id].size.height;

            cutoff_height -= adjusted_containers[sub_container_id].size.height;

            if (cutoff_height <= MIN) {
              break;
            }
          } else {
            /* { OK -> [] } ========================================================================================================= */
            adjusted_containers[sub_container_id].size.height = Math.max(
              cutoff_height - adjusted_containers[sub_container_id].position.y,
              MIN
            );
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            cutoff_height -= adjusted_containers[sub_container_id].size.height;
            break;
          }
        }
      } else {
        /* { <- } =================================================================================================================== */
        let cutoff_height = parent_container.size.height;
        for (
          let i = stackStructure[parent_container_id].sub_items.length - 1;
          i >= 0;
          i--
        ) {
          const sub_container_id =
            stackStructure[parent_container_id].sub_items[i];
          const prev_sub_container_id =
            stackStructure[parent_container_id].sub_items[i - 1];

          if (
            /* { | <- } ============================================================================+================================ */
            !prev_sub_container_id
          ) {
            adjusted_containers[sub_container_id].size.height = Math.max(
              cutoff_height - adjusted_containers[sub_container_id].position.y,
              MIN
            );
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            adjusted_containers[sub_container_id].position.x = 0;
            adjusted_containers[sub_container_id].position.y = 0;

            cutoff_height -= adjusted_containers[sub_container_id].size.width;
          } else if (
            /* { MIN <- } ============================================================================+============================== */
            prev_sub_container_id &&
            adjusted_containers[prev_sub_container_id].size.height === MIN
          ) {
            adjusted_containers[sub_container_id].size.height = Math.max(
              cutoff_height - adjusted_containers[sub_container_id].position.y,
              MIN
            );
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            adjusted_containers[sub_container_id].position.y = Math.max(
              cutoff_height - adjusted_containers[sub_container_id].size.height,
              0
            );
            adjusted_containers[sub_container_id].position.x = 0;

            cutoff_height -= adjusted_containers[sub_container_id].size.height;
          } else if (
            /* { OK <- } ============================================================================================================ */
            prev_sub_container_id
          ) {
            adjusted_containers[sub_container_id].size.height = Math.max(
              cutoff_height - adjusted_containers[sub_container_id].position.y,
              MIN
            );
            adjusted_containers[sub_container_id].size.width =
              parent_container.size.width;
            adjusted_containers[sub_container_id].position.y =
              cutoff_height - adjusted_containers[sub_container_id].size.height;
            adjusted_containers[sub_container_id].position.x = 0;

            cutoff_height -= adjusted_containers[sub_container_id].size.height;

            if (adjusted_containers[sub_container_id].size.height !== MIN) {
              break;
            }
          }
        }
      }
      setContainers(adjusted_containers);
    },
    [stackStructure, containers, filters]
  );
  const adjust_vertical_sub_item_filter = useCallback(
    (parent_id, sub_item_index, difference) => {
      let adjusted_filters = { ...filters };
      const applying_containers = { ...containers };

      const sub_container_id =
        stackStructure[parent_id].sub_items[sub_item_index];
      const next_sub_container_id =
        stackStructure[parent_id].sub_items[sub_item_index + 1];

      const max_height =
        applying_containers[sub_container_id].size.height +
        applying_containers[next_sub_container_id].size.height -
        MIN;

      adjusted_filters[sub_container_id] = {
        size: {
          width: applying_containers[sub_container_id].size.width,
          height: Math.min(
            Math.max(
              applying_containers[sub_container_id].size.height + difference,
              MIN
            ),
            max_height
          ),
        },
        position: {
          x: 0,
          y: applying_containers[sub_container_id].position.y,
        },
      };
      adjusted_filters[next_sub_container_id] = {
        size: {
          width: applying_containers[next_sub_container_id].size.width,
          height: Math.min(
            Math.max(
              applying_containers[next_sub_container_id].size.height -
                difference,
              MIN
            ),
            max_height
          ),
        },
        position: {
          x: 0,
          y: Math.min(
            Math.max(
              applying_containers[sub_container_id].position.y + MIN,
              applying_containers[next_sub_container_id].position.y + difference
            ),
            applying_containers[sub_container_id].position.y + max_height
          ),
        },
      };

      setFilters(adjusted_filters);
    },
    [stackStructure, containers, filters]
  );

  const apply_filter = useCallback(() => {
    const applying_filter = { ...filters };
    const adjusted_containers = { ...containers };
    if (Object.keys(applying_filter).length > 0) {
      Object.keys(applying_filter).forEach((sub_item_id) => {
        adjusted_containers[sub_item_id] = { ...applying_filter[sub_item_id] };
      });
      setContainers(adjusted_containers);
      setRerendered((prev) => prev + 1);
    }
    setFilters({});
  }, [stackStructure, containers, filters]);

  useEffect(() => {
    const calculate_root_position_and_size = throttle(() => {
      const position = {
        x: LEFT,
        y: TOP,
      };
      const size = {
        width: window.innerWidth - LEFT - RIGHT,
        height: window.innerHeight - TOP - BOTTOM,
      };
      setRootContainer({
        position: position,
        size: size,
      });
      setContainers((prev) => {
        return {
          ...prev,
          root: {
            position: position,
            size: size,
          },
        };
      });
      setRerendered((prev) => prev + 1);
    }, 100);
    window.addEventListener("resize", calculate_root_position_and_size);
    calculate_root_position_and_size();
    return () => {
      window.removeEventListener("resize", calculate_root_position_and_size);
    };
  }, []);

  return (
    <RootStackContexts.Provider
      value={{
        stackStructure,
        setStackStructure,
        containers,
        setContainers,
        filters,
        setFilters,
        onFrameResize,
        setOnFrameResize,
        calculate_horizontal_intial_position_and_size,
        calculate_horizontal_position_and_size,
        adjust_horizontal_sub_item_filter,
        calculate_vertical_intial_position_and_size,
        calculate_vertical_position_and_size,
        adjust_vertical_sub_item_filter,
        apply_filter,
      }}
    >
      {rootContainer ? (
        <HorizontalStack
          id={"root"}
          index={0}
          parent_rerendered={rerendered}
          parent_stack_type={"horizontal_stack"}
          end={true}
        />
      ) : null}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
