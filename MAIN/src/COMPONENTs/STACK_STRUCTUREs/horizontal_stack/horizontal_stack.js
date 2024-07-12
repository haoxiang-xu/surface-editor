import React, { useState, useEffect, useRef, useContext } from "react";
//COMPONENTs ---------------------------------------------------------------------------------------
import StackFrame from "../../stack_frame/stack_frame";
//ICONs --------------------------------------------------------------------------------------------
import { ICON_MANAGER } from "../../../ICONs/icon_manager";
//CONTEXTs -----------------------------------------------------------------------------------------
import { stackStructureDragAndDropContexts } from "../../../CONTEXTs/stackStructureDragAndDropContexts";
import { globalDragAndDropContexts } from "../../../CONTEXTs/globalDragAndDropContexts";
import { rightClickContextMenuCommandContexts } from "../../../CONTEXTs/rightClickContextMenuContexts";
import { RootDataContexts } from "../../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { RootCommandContexts } from "../../../DATA_MANAGERs/root_command_manager/root_command_contexts";
//CSS ----------------------------------------------------------------------------------------------
import "./horizontal_stack.css";

/* Load ICON manager --------------------------------------------------------------------------------- */
const GHOST_IMAGE = ICON_MANAGER().GHOST_IMAGE;
/* Load ICON manager --------------------------------------------------------------------------------- */

/* CONSTANT VARIABLES ================================================================================================================================== */
const RESIZER_CONTAINER = {
  type: "RESIZER",
  min_width: 12,
  width: 12,
  max_width: 12,
  content: "",
};
const ENDING_CONTAINER = {
  type: "END",
  min_width: 128,
  width: 128,
  max_width: 128,
  content: "",
};
const TEST_CONTAINER = {
  type: "TESTING_CONTAINER",
  min_width: 42,
  width: 600,
  max_width: 2048,
  content: "TEST",
};
/* CONSTANT VARIABLES ================================================================================================================================== */

/* CONTAINERS ------------------------------------------------------------------------------------------------------------- */
const TestingLabelContainer = ({
  index,
  //Stack Data
  item,
  stackRefs,
}) => {
  //Stack Structure Container Drag and Drop
  const {
    onDropIndex,
    onStackItemDragStart,
    onStackItemDragEnd,
    resizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);

  return (
    <div
      className={"stack_structure_item_test0128"}
      ref={(el) => (stackRefs.current[index] = el)}
      key={index}
      draggable={resizerOnMouseDown ? false : true}
      onDragStart={(e) => {
        onStackItemDragStart(e, index);
      }}
      onDragEnd={(e) => {
        onStackItemDragEnd(e);
      }}
      style={{
        width: item.width,
      }}
    >
      {index === onDropIndex ? (
        <div className="stack_structure_item_overlay0122"></div>
      ) : (
        <div></div>
      )}
      <span className="stack_structure_label0116">{item.content}</span>
    </div>
  );
};
const EndingContainer = ({
  index,
  //Stack Data
  item,
  stackRefs,
}) => {
  //Stack Structure Container Drag and Drop
  const { onDropIndex } = useContext(stackStructureDragAndDropContexts);
  return (
    <div
      className={"stack_structure_item0116"}
      ref={(el) => (stackRefs.current[index] = el)}
      key={index}
      style={{
        width: item.width,
      }}
      draggable={false}
    >
      {" "}
      {index === onDropIndex ? (
        <div className="stack_structure_item_overlay0122"></div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
/* CONTAINERS ------------------------------------------------------------------------------------------------------------- */

const HorizontalStack = () => {
  const [
    stackStructureContainerClassName,
    setStackStructureContainerClassName,
  ] = useState("stack_structure_container0116");
  const { stackStructureOptionsData, updateStackStructureContainerIndex } =
    useContext(RootDataContexts);

  /* Right Click Menu ================================================================================================================================== */
  const { unload_context_menu } = useContext(RootCommandContexts);
  /* Right Click Menu ================================================================================================================================== */

  /* Children Item Drag and Drop ----------------------------------------------------------------- */
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [dragCommand, setDragCommand] = useState(null);
  /* Children Item Drag and Drop ----------------------------------------------------------------- */
  /* DATA =============================================================================================================================================== */
  //Stacking Data ----------------------------------------------------------------------
  let stacking_structure = [];
  for (let index = 0; index < stackStructureOptionsData.length; index++) {
    switch (stackStructureOptionsData[index].type) {
      case "surface_explorer":
        const EXPLORER_CONTAINER = {
          type: "surface_explorer",
          tag: stackStructureOptionsData[index].stack_component_unique_tag,
          min_width: 42,
          width: 256,
          max_width: 2048,
          explorer_container_ref_index:
            stackStructureOptionsData[index].explorer_container_ref_index,
        };
        stacking_structure.push(EXPLORER_CONTAINER);
        stacking_structure.push(RESIZER_CONTAINER);
        break;
      case "monaco_editor":
        const CODE_EDITOR = {
          type: "monaco_editor",
          tag: stackStructureOptionsData[index].stack_component_unique_tag,
          min_width: 42,
          width: 600,
          max_width: 2048,
          code_editor_container_ref_index:
            stackStructureOptionsData[index].code_editor_container_ref_index,
        };
        stacking_structure.push(CODE_EDITOR);
        stacking_structure.push(RESIZER_CONTAINER);
        break;
      default:
        break;
    }
  }
  stacking_structure.push(ENDING_CONTAINER);

  const [stacks, setStacks] = useState(stacking_structure);
  const stackRefs = useRef([]);
  /* DATA =============================================================================================================================================== */

  /* Stack Container Drag and Drop ------------------------------------------------------------ */
  const stackStructureContainerRef = useRef(null);
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
  const containerOnDragOver = (e) => {
    e.preventDefault();
    if (onDragIndex === -1) {
      return;
    }
    const targetElement = e.target.closest(
      ".horizontal_stack_container," +
        ".stack_structure_item0116, " +
        ".stack_structure_item_test0128, " +
        ".stack_structure_explorer0122, " +
        ".stack_structure_code_editor0122"
    );
    if (targetElement && stackStructureContainerRef.current) {
      const childrenArray = Array.from(
        stackStructureContainerRef.current.children
      );
      const dropIndex = childrenArray.indexOf(targetElement);
      if (dropIndex !== onDropIndex && dropIndex !== -1) {
        setOnDropIndex(dropIndex);
      }
    }
  };
  useEffect(() => {
    if (onDragIndex !== -1) {
      setStackStructureContainerClassName(
        "stack_structure_container_minimize0207"
      );
    } else {
      setStackStructureContainerClassName("stack_structure_container0116");
    }
  }, [onDragIndex]);
  /* Stack Container Drag and Drop ------------------------------------------------------------ */

  /* Resizer =============================================================================================================================================== */
  const [resizerOnMouseDown, setResizerOnMouseDown] = useState(false);
  const scrollToPosition = (position) => {
    window.scrollTo({
      left: position,
      behavior: "auto",
    });
  };
  const maximizeContainer = (index) => {
    const editedStacks = [...stacks];
    editedStacks[index].width = Math.min(
      editedStacks[index].max_width,
      window.innerWidth -
        stackRefs.current[index]?.getBoundingClientRect().x -
        RESIZER_CONTAINER.width
    );
    setStacks(editedStacks);
  };
  const minimizeContainer = (index) => {
    const editedStacks = [...stacks];
    editedStacks[index].width = editedStacks[index].min_width;
    setStacks(editedStacks);
  };
  const expandContainer = (index) => {
    const editedStacks = [...stacks];
    let next_index = index + 2;
    let current_index = index;

    while (
      next_index < editedStacks.length - 1 &&
      stackRefs.current[next_index]?.getBoundingClientRect().x +
        editedStacks[next_index].width +
        RESIZER_CONTAINER.width <
        window.innerWidth
    ) {
      current_index = next_index;
      next_index = next_index + 2;
    }

    const adding_width =
      window.innerWidth -
      (stackRefs.current[current_index]?.getBoundingClientRect().x +
        editedStacks[current_index].width +
        RESIZER_CONTAINER.width);

    editedStacks[index].width = Math.min(
      editedStacks[index].max_width,
      editedStacks[index].width + adding_width
    );
    setStacks(editedStacks);
  };
  const narrowContainer = (index) => {
    const editedStacks = [...stacks];
    let next_index = index + 2;
    let current_index = index;

    while (
      next_index < editedStacks.length &&
      stackRefs.current[next_index]?.getBoundingClientRect().x +
        editedStacks[next_index].width +
        RESIZER_CONTAINER.width <=
        window.innerWidth
    ) {
      current_index = next_index;
      next_index = next_index + 2;
    }

    if (
      stackRefs.current[current_index]?.getBoundingClientRect().x +
        editedStacks[current_index].width +
        RESIZER_CONTAINER.width >
      window.innerWidth
    ) {
      editedStacks[index].width = Math.max(
        editedStacks[index].min_width,
        editedStacks[index].width -
          (stackRefs.current[current_index]?.getBoundingClientRect().x +
            editedStacks[current_index].width +
            RESIZER_CONTAINER.width -
            window.innerWidth)
      );
      setStacks(editedStacks);
    } else if (next_index < editedStacks.length) {
      editedStacks[index].width = Math.max(
        editedStacks[index].min_width,
        editedStacks[index].width -
          (stackRefs.current[next_index]?.getBoundingClientRect().x +
            editedStacks[next_index].width -
            window.innerWidth) -
          RESIZER_CONTAINER.width
      );
    } else {
      //Else set current container to min width
      editedStacks[index].width = editedStacks[index].min_width;
    }

    setStacks(editedStacks);
  };
  /* Resizer =============================================================================================================================================== */

  return (
    <div
      className={stackStructureContainerClassName}
      ref={stackStructureContainerRef}
      onDragOver={(e) => {
        containerOnDragOver(e);
      }}
      onDragLeave={(e) => {
        setOnDropIndex(-1);
      }}
    >
      {/*Stack Structure Containers-----------------------------------------------------------------*/}
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
        <stackStructureDragAndDropContexts.Provider
          value={{
            onDropIndex,
            setOnDropIndex,
            onDragIndex,
            setOnDragIndex,
            onStackItemDragStart,
            onStackItemDragEnd,
            resizerOnMouseDown,
            setResizerOnMouseDown,
          }}
        >
          {stacks.map((item, index) => {
            switch (item?.type) {
              case "TESTING_CONTAINER":
                return (
                  <TestingLabelContainer
                    key={"TEST" + index}
                    index={index}
                    //Stack Data
                    item={item}
                    stackRefs={stackRefs}
                    //Stack Structure Container Drag and Drop
                    onStackItemDragStart={onStackItemDragStart}
                    onStackItemDragEnd={onStackItemDragEnd}
                    resizerOnMouseDown={resizerOnMouseDown}
                    onDropIndex={onDropIndex}
                  />
                );
              case "surface_explorer":
                return (
                  <StackFrame
                    key={"surface_explorer" + item.explorer_container_ref_index}
                    stack_component_unique_tag={item.tag}
                    stack_structure_type={"horizontal_stack"}
                    component_type={"surface_explorer"}
                    index={index}
                    //Stack Data
                    item={item}
                    stackRefs={stackRefs}
                    stacks={stacks}
                    setStacks={setStacks}
                    //Expand and Narrow Container
                    expandContainer={expandContainer}
                    narrowContainer={narrowContainer}
                  />
                );
              case "monaco_editor":
                return (
                  <StackFrame
                    key={"monaco_editor" + item.code_editor_container_ref_index}
                    stack_component_unique_tag={item.tag}
                    stack_structure_type={"horizontal_stack"}
                    index={index}
                    component_type={"monaco_editor"}
                    //Stack Data
                    item={item}
                    stackRefs={stackRefs}
                    stacks={stacks}
                    setStacks={setStacks}
                    //Expand and Narrow Container
                    expandContainer={expandContainer}
                    narrowContainer={narrowContainer}
                  />
                );
              case "RESIZER":
                return (
                  <StackFrame
                    key={"RESIZER" + index}
                    component_type={"horizontal_stack_resizer"}
                    stack_structure_type={"horizontal_stack"}
                    index={index}
                    //Stack Data
                    item={item}
                    stackRefs={stackRefs}
                    stacks={stacks}
                    setStacks={setStacks}
                    //Resizer Double Click Functions
                    maximizeContainer={maximizeContainer}
                    minimizeContainer={minimizeContainer}
                  />
                );
              case "END":
                return (
                  <EndingContainer
                    key={"END" + index}
                    index={index}
                    //Stack Data
                    item={item}
                    stackRefs={stackRefs}
                  />
                );
              default:
                break;
            }
          })}
        </stackStructureDragAndDropContexts.Provider>
      </globalDragAndDropContexts.Provider>
      {/*Stack Structure Containers-----------------------------------------------------------------*/}
    </div>
  );
};

export default HorizontalStack;
