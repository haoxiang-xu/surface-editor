import React, { useState, useContext, useEffect } from "react";
import HorizontalStackTopLeftSection from "../STACK_FRAME_COMPONENTs/horizontal_stack_top_left_section.js";
import { stackStructureDragAndDropContexts } from "../../CONTEXTs/stackStructureDragAndDropContexts.js";
import { STACK_COMPONENT_CONFIG } from "../../CONSTs/stackComponentConfig.js";

import "./stack_frame.css";

const RESIZER_CONTAINER = {
  type: "RESIZER",
  min_width: 12,
  width: 12,
  max_width: 12,
  content: "",
};

const HorizontalStackFrameOverLay = () => {
  return <div className="horizontal_stack_frame_overlay_2024_07_05"></div>;
};
const HorizontalStackFrameInvisibleOverLay = () => {
  return (
    <div
      className="stack_structure_item_overlay_invisible0206"
      style={{
        /* POSITION-------------------------------- */
        position: "absolute",
        top: "0px",
        left: "0px",

        /* SIZE------------------------------------ */
        width: "100%",
        height: "100%",

        /* STYLE----------------------------------- */
        borderRadius: "11px",
        opacity: 0,
      }}
    ></div>
  );
};

const HorizontalStackResizer = ({
  index,
  /* Stack Data ------------------------------------ */
  item,
  stackRefs,
  stacks,
  setStacks,
  /* Resizer Double Click Functions ---------------- */
  maximizeContainer,
  minimizeContainer,
}) => {
  /* Stack Structure Container Drag and Drop ------- */
  const {
    onDragIndex,
    setOnDropIndex,
    resizerOnMouseDown,
    setResizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);
  const [resizerClassname, setResizerClassname] = useState(
    "horizontal_stack_resizer_2024_07_05"
  );
  const handleResizerMouseDown = (e, index) => {
    setResizerOnMouseDown(true);
    const startX = e.clientX;
    const left_start_width = stacks[index - 1].width;
    const right_start_width = stacks[index + 1].width;
    const scroll_x_start_position = window.scrollX;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const moveX = e.clientX - startX;
      const left_width = left_start_width + moveX;
      const right_width = right_start_width - moveX;
      if (e.clientX > window.innerWidth - RESIZER_CONTAINER.width) {
        // IF RIGHT ITEM OUTSIDE OF WINDOW
        const editedStacks = [...stacks];
        editedStacks[index - 1].width = Math.min(
          editedStacks[index - 1].max_width,
          window.innerWidth -
            stackRefs.current[index - 1]?.getBoundingClientRect().x -
            RESIZER_CONTAINER.width
        );
        setStacks(editedStacks);
      } else if (
        index + 1 === stacks.length - 1 ||
        e.clientX + right_width >= window.innerWidth - 6
      ) {
        // IF RIGHT ITEM OUTSIDE OF WINDOW OR SECOND LAST ITEM WON'T CHANGE END WIDTH
        if (
          left_width > stacks[index - 1].min_width &&
          left_width < stacks[index - 1].max_width
        ) {
          const editedStacks = [...stacks];
          editedStacks[index - 1].width = left_width;
          setStacks(editedStacks);
        } else if (left_width < stacks[index - 1].min_width) {
          const new_left_width = stacks[index - 1].min_width;

          const editedStacks = [...stacks];
          editedStacks[index - 1].width = new_left_width;
          setStacks(editedStacks);
        }
      } else {
        if (
          left_width > stacks[index - 1].min_width &&
          right_width > stacks[index + 1].min_width &&
          left_width < stacks[index - 1].max_width &&
          right_width < stacks[index + 1].max_width
        ) {
          const editedStacks = [...stacks];
          editedStacks[index - 1].width = left_width;
          editedStacks[index + 1].width = right_width;
          setStacks(editedStacks);
        } else if (
          left_width > stacks[index - 1].min_width &&
          left_width < stacks[index - 1].max_width &&
          stacks[index + 1].width === stacks[index + 1].min_width
        ) {
          const editedStacks = [...stacks];
          editedStacks[index - 1].width = left_width;
          setStacks(editedStacks);
        } else if (
          left_width < stacks[index - 1].min_width &&
          right_width < stacks[index + 1].max_width
        ) {
          const new_left_width = stacks[index - 1].min_width;
          const new_right_width =
            right_start_width +
            (left_start_width - stacks[index - 1].min_width);

          const editedStacks = [...stacks];
          editedStacks[index - 1].width = new_left_width;
          editedStacks[index + 1].width = new_right_width;
          setStacks(editedStacks);
        } else if (
          right_width < stacks[index + 1].min_width &&
          left_width < stacks[index - 1].max_width
        ) {
          const new_right_width = stacks[index + 1].min_width;
          const new_left_width =
            left_start_width +
            (right_start_width - stacks[index + 1].min_width);

          const editedStacks = [...stacks];
          editedStacks[index - 1].width = new_left_width;
          editedStacks[index + 1].width = new_right_width;
          setStacks(editedStacks);
        }
      }
    };
    const handleMouseUp = (e) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setResizerOnMouseDown(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleResizerDoubleClick = (e, index) => {
    if (stacks[index + 1].width === stacks[index + 1].min_width) {
      maximizeContainer(index + 1);
    } else {
      minimizeContainer(index + 1);
    }
  };
  const resizerOnDragOver = (e, index) => {
    if (onDragIndex === -1) {
      return;
    }
    setOnDropIndex(index);
  };
  return (
    <div
      ref={(el) => (stackRefs.current[index] = el)}
      key={index}
      style={{
        width: item.width,
        cursor: "ew-resize",
      }}
      onMouseEnter={(e) => {
        if (!resizerOnMouseDown) {
          setResizerClassname("horizontal_stack_resizer_2024_07_05_onhover");
        }
      }}
      onMouseLeave={(e) => {
        if (!resizerOnMouseDown) {
          setResizerClassname("horizontal_stack_resizer_2024_07_05");
        }
      }}
      onMouseDown={(e) => {
        handleResizerMouseDown(e, index);
      }}
      onDragOver={(e) => {
        resizerOnDragOver(e, index),
          setResizerClassname("horizontal_stack_resizer_2024_07_05_ondragover");
      }}
      onDragLeave={(e) => {
        setResizerClassname("horizontal_stack_resizer_2024_07_05");
      }}
      onDoubleClick={(e) => {
        handleResizerDoubleClick(e, index);
      }}
      draggable={false}
    >
      <div className={resizerClassname}></div>
    </div>
  );
};
const HorizontalStackContainer = ({
  index,
  component_type,
  stack_structure_type,
  /* Stack Data ------------------------------------ */
  item,
  stackRefs,
  stacks,
  setStacks,
  /* Expand and Narrow Container ------------------- */
  expandContainer,
  narrowContainer,
  /* Resizer Double Click Functions ---------------- */
  maximizeContainer,
  minimizeContainer,
}) => {
  const [StackFrameComponent, setStackFrameComponent] = useState(null);
  useEffect(() => {
    async function loadComponent() {
      const component_path =
        STACK_COMPONENT_CONFIG[component_type].path;
      const { default: LoadedComponent } = await import(
        `../STACK_COMPONENTs/${component_path}/${component_path}`
      );
      setStackFrameComponent(() => LoadedComponent);
    }

    loadComponent();
  }, [component_type]);

  /* { Stack Frame Drag and Drop } ---------------------------------------------------------------------------- */
  const {
    onDropIndex,
    setOnDropIndex,
    onDragIndex,
    onStackItemDragStart,
    onStackItemDragEnd,
    resizerOnMouseDown,
    setResizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);
  /* ---------------------------------------------------------------------------------------------------------- */

  /* HORIZONTAL OR VERTICAL MODE ====================================================== */
  const [mode, setMode] = useState(null);
  useEffect(() => {
    if (stack_structure_type === "horizontal_stack") {
      item.width <= 50
        ? setMode(stack_structure_type + "_vertical_mode")
        : setMode(stack_structure_type + "_horizontal_mode");
    }
  }, [item.width]);
  /* HORIZONTAL OR VERTICAL MODE ====================================================== */

  const onMaximizeOnClick = () => {
    expandContainer(index);
  };
  const onMinimizeOnClick = () => {
    narrowContainer(index);
  };

  return (
    <div
      className={"horizontal_stack_container"}
      key={index}
      ref={(el) => (stackRefs.current[index] = el)}
      style={{
        /* POSITION-------------------------------- */
        position: "relative",
        /* SIZE------------------------------------ */
        height: "100%",
        width: item.width,

        /* STYLE----------------------------------- */
        boxSizing: "border-box",
        display: "inline-block",
        overflow: "hidden",
        opacity: onDragIndex === index ? 0.32 : 1,

        /* ANIMATION------------------------------- */
        transition: resizerOnMouseDown ? "width 0s" : "width 0.16s",
      }}
      draggable={resizerOnMouseDown ? false : true}
      onDragStart={(e) => {
        e.stopPropagation();
        onStackItemDragStart(e, index);
      }}
      onDragEnd={(e) => {
        onStackItemDragEnd(e);
      }}
    >
      <div
        style={{
          /* POSITION --------------------------- */
          position: "absolute",
          top: "0px",
          left: "0px",

          /* SIZE ------------------------------- */
          height: "100%",
          width: "100%",

          /* STYLE ------------------------------ */
          border: "2px solid #282828",
          boxSizing: "border-box",
          overflow: "hidden",
          borderRadius: "11px",
          backgroundColor: "#1E1E1E",

          /* ANIMATION -------------------------- */
          transition: "all 0.04s ease",
        }}
      >
        {StackFrameComponent ? (
          <StackFrameComponent
            mode={mode}
            explorer_width={item.width}
            code_editor_width={item.width}
            code_editor_container_ref_index={
              item.code_editor_container_ref_index
            }
            onMaximizeOnClick={onMaximizeOnClick}
            onMinimizeOnClick={onMinimizeOnClick}
          />
        ) : null}
        <HorizontalStackTopLeftSection
          mode={mode}
          //Maximize and Minimize Container
          onMaximizeOnClick={onMaximizeOnClick}
          onMinimizeOnClick={onMinimizeOnClick}
        />
      </div>
      {index === onDropIndex ? <HorizontalStackFrameOverLay /> : null}
      {onDragIndex !== -1 ? <HorizontalStackFrameInvisibleOverLay /> : null}
    </div>
  );
};

const StackFrame = ({
  index,
  stack_structure_type,
  component_type,
  /* Stack Data ------------------------------------ */
  item,
  stackRefs,
  stacks,
  setStacks,
  /* Expand and Narrow Container ------------------- */
  expandContainer,
  narrowContainer,
  /* Resizer Double Click Functions ---------------- */
  maximizeContainer,
  minimizeContainer,
}) => {
  switch (component_type) {
    case "horizontal_stack_resizer":
      return (
        <HorizontalStackResizer
          index={index}
          item={item}
          stackRefs={stackRefs}
          stacks={stacks}
          setStacks={setStacks}
          maximizeContainer={maximizeContainer}
          minimizeContainer={minimizeContainer}
        />
      );
    default:
      return (
        <HorizontalStackContainer
          index={index}
          component_type={component_type}
          stack_structure_type={stack_structure_type}
          item={item}
          stackRefs={stackRefs}
          stacks={stacks}
          setStacks={setStacks}
          expandContainer={expandContainer}
          narrowContainer={narrowContainer}
          maximizeContainer={maximizeContainer}
          minimizeContainer={minimizeContainer}
        />
      );
  }
};

export default StackFrame;
