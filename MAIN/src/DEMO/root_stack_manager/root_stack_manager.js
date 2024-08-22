import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { debounce } from "lodash";
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
/* { import contexts } ---------------------------------------------------------------------- */

const FAKE_STACK_STRUCTURE = {
  root: {
    id: "root",
    type: "horizontal_stack",
    sub_items: [
      "vertical_stack_0002",
      "surface_explorer_0001",
      "surface_explorer_0002",
      "surface_explorer_0003",
      "surface_explorer_0004",
      "surface_explorer_0005",
      "vertical_stack_0001",
    ],
  },
  surface_explorer_0001: {
    id: "surface_explorer_0001",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0002: {
    id: "surface_explorer_0002",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0003: {
    id: "surface_explorer_0003",
    type: "surface_explorer",
    sub_items: [],
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
  vertical_stack_0001: {
    id: "vertical_stack_0001",
    type: "vertical_stack",
    sub_items: [
      "surface_explorer_0006",
      "surface_explorer_0007",
      "surface_explorer_0008",
      "surface_explorer_0009",
    ],
  },
  surface_explorer_0006: {
    id: "surface_explorer_0006",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0007: {
    id: "surface_explorer_0007",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0008: {
    id: "surface_explorer_0008",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0009: {
    id: "surface_explorer_0009",
    type: "surface_explorer",
    sub_items: [],
  },
  vertical_stack_0002: {
    id: "vertical_stack_0002",
    type: "vertical_stack",
    sub_items: [
      "surface_explorer_0010",
      "surface_explorer_0011",
      "surface_explorer_0012",
      "surface_explorer_0013",
      "horizontal_stack_0001",
    ],
  },
  surface_explorer_0010: {
    id: "surface_explorer_0010",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0011: {
    id: "surface_explorer_0011",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0012: {
    id: "surface_explorer_0012",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0013: {
    id: "surface_explorer_0013",
    type: "surface_explorer",
    sub_items: [],
  },
  horizontal_stack_0001: {
    id: "horizontal_stack_0001",
    type: "horizontal_stack",
    sub_items: [
      "surface_explorer_0014",
      "surface_explorer_0015",
      "surface_explorer_0016",
    ],
  },
  surface_explorer_0014: {
    id: "surface_explorer_0014",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0015: {
    id: "surface_explorer_0015",
    type: "surface_explorer",
    sub_items: [],
  },
  surface_explorer_0016: {
    id: "surface_explorer_0016",
    type: "surface_explorer",
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

const TOP = 40;
const RIGHT = default_component_padding;
const BOTTOM = default_component_padding;
const LEFT = default_component_padding;

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

const StackFrameTestingContainer = ({ id }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: default_resizer_size / 2,
        left: default_resizer_size / 2,
        bottom: default_resizer_size / 2,
        right: default_resizer_size / 2,

        border: `1px solid rgba(${R + 8}, ${G + 8}, ${B + 8}, 1)`,
        backgroundColor: `rgba(${R}, ${G}, ${B}, 1)`,
        borderRadius: default_component_border_radius,
        overflow: "hidden",
      }}
    >
      {/* <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          color: "white",
          fontSize: 36,
          userSelect: "none",

          opacity: 0.32,
        }}
      >
        {id.slice(-2)}
      </span> */}
    </div>
  );
};
const StackFrameResizer = ({
  id,
  index,
  stack_structure_type,
  adjust_item_filter,
  apply_item_filter,
}) => {
  const hoverTimeout = useRef(null);
  const [onHover, setOnHover] = useState(false);
  const [onPause, setOnPause] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [previousMousePosition, setPerviousMousePosition] = useState(null);
  const [endingMousePosition, setEndingMousePosition] = useState(null);

  const [resizerSize, setResizerSize] = useState(
    MIN - default_resizer_size * 2
  );
  const [resizerColor, setResizerColor] = useState(
    `rgba(${R + 16}, ${G + 16}, ${B + 16}, 1)`
  );
  const [borderRadius, setBorderRadius] = useState(
    default_component_border_radius
  );

  const mouse_position_listener = (event) => {
    const handleMouseUp = (event) => {
      apply_item_filter();
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
      setOnClick(false);
    };
    const handleMouseMove = (event) => {
      event.stopPropagation();
      setEndingMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    if (stack_structure_type === "horizontal_stack") {
      document.body.style.cursor = "ew-resize";
    } else {
      document.body.style.cursor = "ns-resize";
    }
    setOnClick(true);
  };
  useEffect(() => {
    if (!endingMousePosition || !previousMousePosition) return;
    if (stack_structure_type === "horizontal_stack") {
      adjust_item_filter(
        id,
        index,
        endingMousePosition.x - previousMousePosition.x
      );
    } else {
      adjust_item_filter(
        id,
        index,
        endingMousePosition.y - previousMousePosition.y
      );
    }
  }, [endingMousePosition]);
  useEffect(() => {
    if (onClick) {
      setResizerSize(`calc(100% - ${default_resizer_size * 2}px)`);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${67}, ${105}, ${180}, 1)`);
    } else if (onHover && onPause) {
      setResizerSize(`calc(100% - ${default_resizer_size * 2}px)`);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${67}, ${105}, ${180}, 1)`);
    } else {
      setResizerSize(MIN - default_resizer_size * 2);
      setBorderRadius(default_component_border_radius);
      setResizerColor(`rgba(${R + 16}, ${G + 16}, ${B + 16}, 1)`);
    }
  }, [onHover, onPause, onClick]);

  switch (stack_structure_type) {
    case "horizontal_stack":
      return (
        <div
          draggable="false"
          style={{
            position: "absolute",
            right: -default_resizer_size / 2,
            top: 0,
            width: default_resizer_size,
            height: "100%",

            cursor: "ew-resize",
            zIndex: default_resizer_layer,
          }}
          onMouseEnter={() => {
            setOnHover(true);
            hoverTimeout.current = setTimeout(() => {
              setOnPause(true);
            }, 400);
          }}
          onMouseLeave={() => {
            setOnHover(false);
            clearTimeout(hoverTimeout.current);
            if (hoverTimeout.current) {
              setOnPause(false);
            }
            hoverTimeout.current = null;
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            setPerviousMousePosition({ x: event.clientX, y: event.clientY });
            mouse_position_listener(event);
          }}
        >
          <div
            draggable="false"
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
            }}
            onMouseEnter={() => {
              setOnHover(true);
              setOnPause(true);
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
            bottom: -default_resizer_size / 2,
            left: 0,

            width: "100%",
            height: default_resizer_size,

            cursor: "ns-resize",
            zIndex: default_resizer_layer,
          }}
          onMouseEnter={() => {
            setOnHover(true);
            hoverTimeout.current = setTimeout(() => {
              setOnPause(true);
            }, 400);
          }}
          onMouseLeave={() => {
            setOnHover(false);
            clearTimeout(hoverTimeout.current);
            if (hoverTimeout.current) {
              setOnPause(false);
            }
            hoverTimeout.current = null;
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            setPerviousMousePosition({ x: event.clientX, y: event.clientY });
            mouse_position_listener(event);
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
  container,
  parent_stack_type,
  parent_rerendered,
  end,
  adjust_item_filter,
  apply_item_filter,
}) => {
  return (
    <div
      draggable="false"
      style={{
        // transition:
        //   "top 0.24s cubic-bezier(0.32, 1, 0.32, 1), left 0.24s cubic-bezier(0.32, 1, 0.32, 1), width 0.24s cubic-bezier(0.32, 1, 0.32, 1), height 0.24s cubic-bezier(0.32, 1, 0.32, 1)",
        position: "absolute",
        top: container.position.y,
        left: container.position.x,
        width: container.size.width,
        height: container.size.height,
      }}
    >
      <StackFrameTestingContainer id={id} />
      {end ? null : (
        <StackFrameResizer
          id={id}
          index={index}
          stack_structure_type={parent_stack_type}
          adjust_item_filter={adjust_item_filter}
          apply_item_filter={apply_item_filter}
        />
      )}
    </div>
  );
};

const VerticalStack = ({
  id,
  index,
  container,
  parent_stack_type,
  parent_rerendered,
  end,
  adjust_item_filter,
  apply_item_filter,
}) => {
  const { stackStructure } = useContext(RootStackContexts);
  const [subContainers, setSubContainers] = useState(null);
  const [containerFilter, setContainerFilter] = useState(null);
  const [rerendered, setRerendered] = useState(false);

  const intial_position_and_size_calculation = useCallback(() => {
    const sub_containers = {};

    const sub_container_height = parseInt(
      container.size.height / stackStructure[id].sub_items.length
    );
    const sub_container_width = container.size.width;

    let sub_container_y = 0;
    const sub_container_x = 0;

    let cutoff_height = container.size.height;

    for (let i = 0; i < stackStructure[id].sub_items.length; i++) {
      if (i === stackStructure[id].sub_items.length - 1) {
        sub_containers[stackStructure[id].sub_items[i]] = {
          position: { x: sub_container_x, y: sub_container_y },
          size: { width: sub_container_width, height: cutoff_height },
        };
      } else {
        sub_containers[stackStructure[id].sub_items[i]] = {
          position: { x: sub_container_x, y: sub_container_y },
          size: { width: sub_container_width, height: sub_container_height },
        };
      }
      sub_container_y += sub_container_height;
      cutoff_height -= sub_container_height;
    }
    setSubContainers(sub_containers);
  }, [container, subContainers]);
  const position_and_size_calculation = useCallback(() => {
    let sub_containers = { ...subContainers };

    const last_sub_container_id =
      stackStructure[id].sub_items[stackStructure[id].sub_items.length - 1];
    const pervious_parent_height =
      sub_containers[last_sub_container_id].position.y +
      sub_containers[last_sub_container_id].size.height;

    for (let i = 0; i < stackStructure[id].sub_items.length; i++) {
      const sub_container_id = stackStructure[id].sub_items[i];
      if (sub_containers[sub_container_id]) {
        sub_containers[sub_container_id].size.width = container.size.width;
      }
    }

    if (pervious_parent_height === container.size.height) {
      /* { | } ==================================================================================================================== */
      return;
    } else if (pervious_parent_height < container.size.height) {
      /* { -> } =================================================================================================================== */

      let cutoff_height = container.size.height;
      for (let i = stackStructure[id].sub_items.length - 1; i >= 0; i--) {
        const sub_container_id = stackStructure[id].sub_items[i];
        const next_sub_container_id = stackStructure[id].sub_items[i + 1];
        const prev_sub_container_id = stackStructure[id].sub_items[i - 1];

        if (
          !next_sub_container_id &&
          pervious_parent_height < stackStructure[id].sub_items.length * MIN
        ) {
          /* { | -> [] } =========================================================================================================== */
          sub_containers[sub_container_id].size.height = Math.max(
            cutoff_height - (stackStructure[id].sub_items.length - 1) * MIN,
            MIN
          );
          sub_containers[sub_container_id].size.width = container.size.width;
          sub_containers[sub_container_id].position.y =
            cutoff_height - sub_containers[sub_container_id].size.height;

          cutoff_height -= sub_containers[sub_container_id].size.height;
          if (cutoff_height <= MIN) {
            break;
          }
        } else if (
          next_sub_container_id &&
          pervious_parent_height < stackStructure[id].sub_items.length * MIN
        ) {
          /* { | -> | } =========================================================================================================== */
          sub_containers[sub_container_id].size.height = MIN;
          sub_containers[sub_container_id].size.width = container.size.width;
          sub_containers[sub_container_id].position.y =
            cutoff_height - sub_containers[sub_container_id].size.height;

          cutoff_height -= sub_containers[sub_container_id].size.height;

          if (cutoff_height <= MIN) {
            break;
          }
        } else {
          /* { OK -> [] } ========================================================================================================= */
          sub_containers[sub_container_id].size.height = Math.max(
            cutoff_height - sub_containers[sub_container_id].position.y,
            MIN
          );
          sub_containers[sub_container_id].size.width = container.size.width;
          cutoff_height -= sub_containers[sub_container_id].size.height;
          break;
        }
      }
    } else {
      /* { <- } =================================================================================================================== */
      let cutoff_height = container.size.height;
      for (let i = stackStructure[id].sub_items.length - 1; i >= 0; i--) {
        const sub_container_id = stackStructure[id].sub_items[i];
        const prev_sub_container_id = stackStructure[id].sub_items[i - 1];

        if (
          /* { | <- } ============================================================================+================================ */
          !prev_sub_container_id
        ) {
          sub_containers[sub_container_id].size.height = Math.max(
            cutoff_height - sub_containers[sub_container_id].position.y,
            MIN
          );
          sub_containers[sub_container_id].size.width = container.size.width;
          sub_containers[sub_container_id].position.x = 0;
          sub_containers[sub_container_id].position.y = 0;

          cutoff_height -= sub_containers[sub_container_id].size.width;
        } else if (
          /* { MIN <- } ============================================================================+============================== */
          prev_sub_container_id &&
          sub_containers[prev_sub_container_id].size.height === MIN
        ) {
          sub_containers[sub_container_id].size.height = Math.max(
            cutoff_height - sub_containers[sub_container_id].position.y,
            MIN
          );
          sub_containers[sub_container_id].size.width = container.size.width;
          sub_containers[sub_container_id].position.y = Math.max(
            cutoff_height - sub_containers[sub_container_id].size.height,
            0
          );
          sub_containers[sub_container_id].position.x = 0;

          cutoff_height -= sub_containers[sub_container_id].size.height;
        } else if (
          /* { OK <- } ============================================================================================================ */
          prev_sub_container_id
        ) {
          sub_containers[sub_container_id].size.height = Math.max(
            cutoff_height - sub_containers[sub_container_id].position.y,
            MIN
          );
          sub_containers[sub_container_id].size.width = container.size.width;
          sub_containers[sub_container_id].position.y =
            cutoff_height - sub_containers[sub_container_id].size.height;
          sub_containers[sub_container_id].position.x = 0;

          cutoff_height -= sub_containers[sub_container_id].size.height;

          if (sub_containers[sub_container_id].size.height !== MIN) {
            break;
          }
        }
      }
    }
    setSubContainers(sub_containers);
  }, [container, subContainers]);
  const adjust_sub_item_filter = useCallback(
    (subitem_id, index, difference) => {
      const sub_containers = { ...subContainers };
      let sub_containers_filter = {};

      const sub_container_id = subitem_id;
      const next_sub_container_id = stackStructure[id].sub_items[index + 1];

      const max_height =
        sub_containers[sub_container_id].size.height +
        sub_containers[next_sub_container_id].size.height -
        MIN;

      sub_containers_filter[sub_container_id] = {
        size: {
          width: sub_containers[sub_container_id].size.width,
          height: Math.min(
            Math.max(
              sub_containers[sub_container_id].size.height + difference,
              MIN
            ),
            max_height
          ),
        },
        position: {
          x: 0,
          y: sub_containers[sub_container_id].position.y,
        },
      };
      sub_containers_filter[next_sub_container_id] = {
        size: {
          width: sub_containers[next_sub_container_id].size.width,
          height: Math.min(
            Math.max(
              sub_containers[next_sub_container_id].size.height - difference,
              MIN
            ),
            max_height
          ),
        },
        position: {
          x: 0,
          y: Math.min(
            Math.max(
              sub_containers[sub_container_id].position.y + MIN,
              sub_containers[next_sub_container_id].position.y + difference
            ),
            sub_containers[sub_container_id].position.y + max_height
          ),
        },
      };

      setContainerFilter(sub_containers_filter);
    },
    [subContainers, containerFilter]
  );
  const apply_sub_item_filter = useCallback(() => {
    let sub_containers = { ...subContainers };
    if (containerFilter) {
      Object.keys(containerFilter).forEach((subContainerId) => {
        sub_containers[subContainerId] = containerFilter[subContainerId];
      });
    }
    setContainerFilter(null);
    setSubContainers(sub_containers);
  }, [subContainers, containerFilter]);

  useEffect(() => {
    if (!subContainers) {
      intial_position_and_size_calculation();
    } else {
      position_and_size_calculation();
    }
    setRerendered((prev) => !prev);
  }, [container, parent_rerendered]);

  return (
    <div
      style={{
        position: "absolute",
        top: container.position.y,
        left: container.position.x,
        width: container.size.width,
        height: container.size.height,
      }}
    >
      {subContainers
        ? Object.keys(subContainers).map((subContainerId, index) => {
            let children_container = subContainers[subContainerId];
            if (containerFilter && containerFilter[subContainerId]) {
              children_container = containerFilter[subContainerId];
            }

            switch (stackStructure[subContainerId].type) {
              case "horizontal_stack":
                return (
                  <HorizontalStack
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
                  />
                );
              case "vertical_stack":
                return (
                  <VerticalStack
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
                  />
                );
              default:
                return (
                  <StackFrame
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"vertical_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
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
          adjust_item_filter={adjust_item_filter}
          apply_item_filter={apply_item_filter}
        />
      )}
    </div>
  );
};
const HorizontalStack = ({
  id,
  index,
  container,
  parent_stack_type,
  parent_rerendered,
  end,
  adjust_item_filter,
  apply_item_filter,
}) => {
  const { stackStructure } = useContext(RootStackContexts);
  const [subContainers, setSubContainers] = useState(null);
  const [containerFilter, setContainerFilter] = useState(null);
  const [rerendered, setRerendered] = useState(false);

  const intial_position_and_size_calculation = useCallback(() => {
    const sub_containers = {};

    const sub_container_width = parseInt(
      container.size.width / stackStructure[id].sub_items.length
    );
    const sub_container_height = container.size.height;

    let sub_container_x = 0;
    const sub_container_y = 0;

    let cutoff_width = container.size.width;

    for (let i = 0; i < stackStructure[id].sub_items.length; i++) {
      if (i === stackStructure[id].sub_items.length - 1) {
        sub_containers[stackStructure[id].sub_items[i]] = {
          position: { x: sub_container_x, y: sub_container_y },
          size: { width: cutoff_width, height: sub_container_height },
        };
      } else {
        sub_containers[stackStructure[id].sub_items[i]] = {
          position: { x: sub_container_x, y: sub_container_y },
          size: { width: sub_container_width, height: sub_container_height },
        };
      }
      sub_container_x += sub_container_width;
      cutoff_width -= sub_container_width;
    }
    setSubContainers(sub_containers);
  }, [container, subContainers]);
  const position_and_size_calculation = useCallback(() => {
    let sub_containers = { ...subContainers };

    const last_sub_container_id =
      stackStructure[id].sub_items[stackStructure[id].sub_items.length - 1];
    const pervious_parent_width =
      sub_containers[last_sub_container_id].position.x +
      sub_containers[last_sub_container_id].size.width;

    for (let i = 0; i < stackStructure[id].sub_items.length; i++) {
      const sub_container_id = stackStructure[id].sub_items[i];
      if (sub_containers[sub_container_id]) {
        sub_containers[sub_container_id].size.height = container.size.height;
      }
    }

    if (pervious_parent_width === container.size.width) {
      /* { | } ==================================================================================================================== */
      return;
    } else if (pervious_parent_width < container.size.width) {
      /* { -> } =================================================================================================================== */
      let cutoff_width = container.size.width;
      for (let i = stackStructure[id].sub_items.length - 1; i >= 0; i--) {
        const sub_container_id = stackStructure[id].sub_items[i];
        const next_sub_container_id = stackStructure[id].sub_items[i + 1];
        const prev_sub_container_id = stackStructure[id].sub_items[i - 1];

        if (
          !next_sub_container_id &&
          pervious_parent_width < stackStructure[id].sub_items.length * MIN
        ) {
          /* { | -> [] } =========================================================================================================== */
          sub_containers[sub_container_id].size.width = Math.max(
            cutoff_width - (stackStructure[id].sub_items.length - 1) * MIN,
            MIN
          );
          sub_containers[sub_container_id].size.height = container.size.height;
          sub_containers[sub_container_id].position.x =
            cutoff_width - sub_containers[sub_container_id].size.width;

          cutoff_width -= sub_containers[sub_container_id].size.width;
          if (cutoff_width <= MIN) {
            break;
          }
        } else if (
          next_sub_container_id &&
          pervious_parent_width < stackStructure[id].sub_items.length * MIN
        ) {
          /* { | -> | } =========================================================================================================== */
          sub_containers[sub_container_id].size.width = MIN;
          sub_containers[sub_container_id].size.height = container.size.height;
          sub_containers[sub_container_id].position.x =
            cutoff_width - sub_containers[sub_container_id].size.width;

          cutoff_width -= sub_containers[sub_container_id].size.width;

          if (cutoff_width <= MIN) {
            break;
          }
        } else {
          /* { OK -> [] } ========================================================================================================= */
          sub_containers[sub_container_id].size.width = Math.max(
            cutoff_width - sub_containers[sub_container_id].position.x,
            MIN
          );
          sub_containers[sub_container_id].size.height = container.size.height;
          cutoff_width -= sub_containers[sub_container_id].size.width;
          break;
        }
      }
    } else {
      /* { <- } =================================================================================================================== */
      let cutoff_width = container.size.width;
      for (let i = stackStructure[id].sub_items.length - 1; i >= 0; i--) {
        const sub_container_id = stackStructure[id].sub_items[i];
        const prev_sub_container_id = stackStructure[id].sub_items[i - 1];

        if (
          /* { | <- } ============================================================================+================================ */
          !prev_sub_container_id
        ) {
          sub_containers[sub_container_id].size.width = Math.max(
            cutoff_width - sub_containers[sub_container_id].position.x,
            MIN
          );
          sub_containers[sub_container_id].size.height = container.size.height;
          sub_containers[sub_container_id].position.x = 0;
          sub_containers[sub_container_id].position.y = 0;

          cutoff_width -= sub_containers[sub_container_id].size.width;
        } else if (
          /* { MIN <- } ============================================================================+============================== */
          prev_sub_container_id &&
          sub_containers[prev_sub_container_id].size.width === MIN
        ) {
          sub_containers[sub_container_id].size.width = Math.max(
            cutoff_width - sub_containers[sub_container_id].position.x,
            MIN
          );
          sub_containers[sub_container_id].size.height = container.size.height;
          sub_containers[sub_container_id].position.x = Math.max(
            cutoff_width - sub_containers[sub_container_id].size.width,
            0
          );
          sub_containers[sub_container_id].position.y = 0;

          cutoff_width -= sub_containers[sub_container_id].size.width;
        } else if (
          /* { OK <- } ============================================================================================================ */
          prev_sub_container_id
        ) {
          sub_containers[sub_container_id].size.width = Math.max(
            cutoff_width - sub_containers[sub_container_id].position.x,
            MIN
          );
          sub_containers[sub_container_id].size.height = container.size.height;
          sub_containers[sub_container_id].position.x =
            cutoff_width - sub_containers[sub_container_id].size.width;
          sub_containers[sub_container_id].position.y = 0;

          cutoff_width -= sub_containers[sub_container_id].size.width;

          if (sub_containers[sub_container_id].size.width !== MIN) {
            break;
          }
        }
      }
    }
    setSubContainers(sub_containers);
  }, [container, subContainers]);
  const adjust_sub_item_filter = useCallback(
    (subitem_id, index, difference) => {
      const sub_containers = { ...subContainers };
      let sub_containers_filter = {};

      const sub_container_id = subitem_id;
      const next_sub_container_id = stackStructure[id].sub_items[index + 1];

      const max_width =
        sub_containers[sub_container_id].size.width +
        sub_containers[next_sub_container_id].size.width -
        MIN;

      sub_containers_filter[sub_container_id] = {
        size: {
          width: Math.min(
            Math.max(
              sub_containers[sub_container_id].size.width + difference,
              MIN
            ),
            max_width
          ),
          height: sub_containers[sub_container_id].size.height,
        },
        position: {
          x: sub_containers[sub_container_id].position.x,
          y: 0,
        },
      };
      sub_containers_filter[next_sub_container_id] = {
        size: {
          width: Math.min(
            Math.max(
              sub_containers[next_sub_container_id].size.width - difference,
              MIN
            ),
            max_width
          ),
          height: sub_containers[next_sub_container_id].size.height,
        },
        position: {
          x: Math.min(
            Math.max(
              sub_containers[sub_container_id].position.x + MIN,
              sub_containers[next_sub_container_id].position.x + difference
            ),
            sub_containers[sub_container_id].position.x + max_width
          ),
          y: 0,
        },
      };

      setContainerFilter(sub_containers_filter);
    },
    [subContainers, containerFilter]
  );
  const apply_sub_item_filter = useCallback(() => {
    let sub_containers = { ...subContainers };
    if (containerFilter) {
      Object.keys(containerFilter).forEach((subContainerId) => {
        sub_containers[subContainerId] = containerFilter[subContainerId];
      });
    }
    setContainerFilter(null);
    setSubContainers(sub_containers);
  }, [subContainers, containerFilter]);

  useEffect(() => {
    if (!subContainers) {
      intial_position_and_size_calculation();
    } else {
      position_and_size_calculation();
    }
    setRerendered((prev) => !prev);
  }, [container, parent_rerendered]);

  return (
    <div
      style={{
        position: "absolute",
        top: container.position.y,
        left: container.position.x,
        width: container.size.width,
        height: container.size.height,
      }}
    >
      {subContainers
        ? Object.keys(subContainers).map((subContainerId, index) => {
            let children_container = subContainers[subContainerId];
            if (containerFilter && containerFilter[subContainerId]) {
              children_container = containerFilter[subContainerId];
            }

            switch (stackStructure[subContainerId].type) {
              case "horizontal_stack":
                return (
                  <HorizontalStack
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
                  />
                );
              case "vertical_stack":
                return (
                  <VerticalStack
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
                  />
                );
              default:
                return (
                  <StackFrame
                    key={subContainerId}
                    index={index}
                    parent_rerendered={rerendered}
                    id={subContainerId}
                    container={children_container}
                    parent_stack_type={"horizontal_stack"}
                    end={index === stackStructure[id].sub_items.length - 1}
                    adjust_item_filter={adjust_sub_item_filter}
                    apply_item_filter={apply_sub_item_filter}
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
          adjust_item_filter={adjust_item_filter}
          apply_item_filter={apply_item_filter}
        />
      )}
    </div>
  );
};

const RootStackManager = () => {
  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);
  const [rootContainer, setRootContainer] = useState(null);
  const [rerendered, setRerendered] = useState(false);

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
      setRerendered((prev) => !prev);
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
      }}
    >
      {rootContainer ? (
        <HorizontalStack
          id={"root"}
          index={0}
          container={rootContainer}
          parent_rerendered={rerendered}
          parent_stack_type={"horizontal_stack"}
          end={true}
        />
      ) : null}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
