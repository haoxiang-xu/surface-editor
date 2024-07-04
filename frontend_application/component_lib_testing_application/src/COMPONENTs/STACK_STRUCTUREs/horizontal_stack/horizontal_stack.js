import React, { useState, useEffect, useRef, useContext } from "react";
//COMPONENTs ---------------------------------------------------------------------------------------
import VecoderEditor from "../../vecoder_editor/vecoder_editor";
import Explorer from "../../explorer/explorer";
//ICONs --------------------------------------------------------------------------------------------
import { ICON_MANAGER } from "../../../ICONs/icon_manager";
//CONTEXTs -----------------------------------------------------------------------------------------
import { stackStructureDragAndDropContexts } from "../../../CONTEXTs/stackStructureDragAndDropContexts";
import { globalDragAndDropContexts } from "../../../CONTEXTs/globalDragAndDropContexts";
import { rightClickContextMenuCommandContexts } from "../../../CONTEXTs/rightClickContextMenuContexts";
import { RootDataContexts } from "../../../DATA_MANAGERs/root_data_manager/root_data_contexts";
//CSS ----------------------------------------------------------------------------------------------
import "./horizontal_stack.css";

/* Load ICON manager --------------------------------------------------------------------------------- */
let FILE_TYPE_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  FILE_TYPE_ICON_MANAGER = ICON_MANAGER().FILE_TYPE_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
let SYSTEM_ICON_MANAGER = {
  default: {
    ICON: null,
    LABEL_COLOR: "#C8C8C8",
  },
};
try {
  SYSTEM_ICON_MANAGER = ICON_MANAGER().SYSTEM_ICON_MANAGER;
} catch (e) {
  console.log(e);
}
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
const ResizerTypeContainer = ({
  index,
  //Stack Data
  item,
  stackRefs,
  stacks,
  setStacks,
  //Resizer Double Click Functions
  maximizeContainer,
  minimizeContainer,
}) => {
  //Stack Structure Container Drag and Drop
  const {
    onDragIndex,
    setOnDropIndex,
    resizerOnMouseDown,
    setResizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);
  const [resizerClassname, setResizerClassname] = useState(
    "stack_structure_resizer0122"
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
      className={"stack_structure_resizer_container0122"}
      ref={(el) => (stackRefs.current[index] = el)}
      key={index}
      style={{
        width: item.width,
        cursor: "ew-resize",
      }}
      onMouseEnter={(e) => {
        if (!resizerOnMouseDown) {
          setResizerClassname("stack_structure_resizer_hover0122");
        }
      }}
      onMouseLeave={(e) => {
        if (!resizerOnMouseDown) {
          setResizerClassname("stack_structure_resizer0122");
        }
      }}
      onMouseDown={(e) => {
        handleResizerMouseDown(e, index);
      }}
      onDragOver={(e) => {
        resizerOnDragOver(e, index),
          setResizerClassname("stack_structure_resizer_onDragOver0122");
      }}
      onDragLeave={(e) => {
        setResizerClassname("stack_structure_resizer0122");
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
const ExplorerTypeContainer = ({
  index,
  //Stack Data
  item,
  stackRefs,
  stacks,
  setStacks,
  //Expand and Narrow Container
  expandContainer,
  narrowContainer,
}) => {
  //Stack Structure Container Drag and Drop
  const {
    onDropIndex,
    onDragIndex,
    onStackItemDragStart,
    onStackItemDragEnd,
    resizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);
  const onMaximizeOnClick = () => {
    expandContainer(index);
  };
  const onMinimizeOnClick = () => {
    narrowContainer(index);
  };
  return (
    <div
      className="stack_structure_explorer0122"
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
        transition: resizerOnMouseDown ? "width 0s" : "width 0.16s",
        width: item.width,
        opacity: onDragIndex === index ? 0.32 : 1,
      }}
    >
      <Explorer
        explorer_width={item.width}
        onMaximizeOnClick={onMaximizeOnClick}
        onMinimizeOnClick={onMinimizeOnClick}
      />
      {index === onDropIndex ? (
        <div className="stack_structure_item_overlay0122"></div>
      ) : null}
      {onDragIndex !== -1 ? (
        <div className="stack_structure_item_overlay_invisible0206"></div>
      ) : null}
    </div>
  );
};
const VecoderEditorTypeContainer = ({
  index,
  //Stack Data
  item,
  stackRefs,
  stacks,
  setStacks,
  //Expand and Narrow Container
  expandContainer,
  narrowContainer,
}) => {
  //Stack Structure Container Drag and Drop
  const {
    onDropIndex,
    onDragIndex,
    onStackItemDragStart,
    onStackItemDragEnd,
    resizerOnMouseDown,
  } = useContext(stackStructureDragAndDropContexts);
  const onMaximizeOnClick = () => {
    expandContainer(index);
  };
  const onMinimizeOnClick = () => {
    narrowContainer(index);
  };
  return (
    <div
      className="stack_structure_code_editor0122"
      ref={(el) => (stackRefs.current[index] = el)}
      key={index}
      draggable={resizerOnMouseDown ? false : true}
      onDragStart={(e) => {
        e.stopPropagation();
        onStackItemDragStart(e, index);
      }}
      onDragEnd={(e) => {
        onStackItemDragEnd(e);
      }}
      style={{
        transition: resizerOnMouseDown ? "width 0s" : "width 0.16s",
        width: item.width,
        opacity: onDragIndex === index ? 0.32 : 1,
      }}
    >
      <VecoderEditor
        code_editor_width={item.width}
        code_editor_container_ref_index={item.code_editor_container_ref_index}
        //Maximize and Minimize Container
        onMaximizeOnClick={onMaximizeOnClick}
        onMinimizeOnClick={onMinimizeOnClick}
      />
      {index === onDropIndex ? (
        <div className="stack_structure_item_overlay0122"></div>
      ) : null}
      {onDragIndex !== -1 ? (
        <div className="stack_structure_item_overlay_invisible0206"></div>
      ) : null}
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
  const {handleRightClick, handleLeftClick} = useContext(rightClickContextMenuCommandContexts);
  /* Right Click Menu ================================================================================================================================== */

  /* Children Item Drag and Drop ----------------------------------------------------------------- */
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [dragCommand, setDragCommand] = useState(null);
  /* Children Item Drag and Drop ----------------------------------------------------------------- */

  /* DATA =============================================================================================================================================== */
  //Explorer Data ----------------------------------------------------------------------
  const EXPLORER_FILES = {
    fileName: "vecoder",
    fileType: "folder",
    filePath: "vecoder",
    fileExpend: true,
    files: [
      {
        fileName: "vecoder_sample",
        fileType: "folder",
        filePath: "vecoder/vecoder_sample",
        fileExpend: true,
        files: [
          {
            fileName: "public",
            fileType: "folder",
            filePath: "vecoder/vecoder_sample/public",
            fileExpend: true,
            files: [
              {
                fileName: "favicon.icon",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/favicon.icon",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "index.html",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/index.html",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "index.php",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/index.php",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "logo192.png",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/logo192.png",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "resume.pdf",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/resume.pdf",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "manifest.json",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/manifest.json",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "robots.txt",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/robots.txt",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "test.py",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/test.py",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "test.java",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/test.java",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "test.xls",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/test.xls",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "test.doc",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/test.doc",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "test.ppt",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/public/test.ppt",
                fileExpend: false,
                files: [],
              },
            ],
          },
          {
            fileName: "src",
            fileType: "folder",
            filePath: "vecoder/vecoder_sample/src",
            fileExpend: true,
            files: [
              {
                fileName: "COMPONENTs",
                fileType: "folder",
                filePath: "vecoder/vecoder_sample/src/COMPONENTs",
                fileExpend: false,
                files: [
                  {
                    fileName: "explorer",
                    fileType: "folder",
                    filePath: "vecoder/vecoder_sample/src/COMPONENTs/explorer",
                    fileExpend: false,
                    files: [
                      {
                        fileName: "dirItem",
                        fileType: "folder",
                        filePath:
                          "vecoder/vecoder_sample/src/COMPONENTs/explorer/dirItem",
                        fileExpend: false,
                        files: [
                          {
                            fileName: "dirItem.css",
                            fileType: "file",
                            filePath:
                              "vecoder/vecoder_sample/src/COMPONENTs/explorer/dirItem/dirItem.css",
                            fileExpend: false,
                            files: [],
                          },
                          {
                            fileName: "dirItem.js",
                            fileType: "file",
                            filePath:
                              "vecoder/vecoder_sample/src/COMPONENTs/explorer/dirItem/dirItem.js",
                            fileExpend: false,
                            files: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                fileName: "App.css",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/src/App.css",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "App.js",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/src/App.js",
                fileExpend: false,
                files: [],
              },
              {
                fileName: "App.test.js",
                fileType: "file",
                filePath: "vecoder/vecoder_sample/src/App.test.js",
                fileExpend: false,
                files: [],
              },
            ],
          },
          {
            fileName: ".gitignore",
            fileType: "file",
            filePath: "vecoder/vecoder_sample/.gitignore",
            fileExpend: false,
            files: [],
          },
          {
            fileName: "package.json",
            fileType: "file",
            filePath: "vecoder/vecoder_sample/package.json",
            fileExpend: false,
            files: [],
          },
          {
            fileName: "package-lock.json",
            fileType: "file",
            filePath: "vecoder/vecoder_sample/package-lock.json",
            fileExpend: false,
            files: [],
          },
          {
            fileName: "README.md",
            fileType: "file",
            filePath: "vecoder/vecoder_sample/README.md",
            fileExpend: false,
            files: [],
          },
          {
            fileName: ".env",
            fileType: "file",
            filePath: "vecoder/vecoder_sample/.env",
            fileExpend: false,
            files: [],
          },
        ],
      },
    ],
  };
  const [explorer_files, setExplorer_files] = useState(EXPLORER_FILES);
  //Stacking Data ----------------------------------------------------------------------
  let stacking_structure = [];
  for (let index = 0; index < stackStructureOptionsData.length; index++) {
    switch (stackStructureOptionsData[index].type) {
      case "EXPLORER":
        const EXPLORER_CONTAINER = {
          type: "EXPLORER",
          min_width: 42,
          width: 256,
          max_width: 2048,
          explorer_container_ref_index:
            stackStructureOptionsData[index].explorer_container_ref_index,
        };
        stacking_structure.push(EXPLORER_CONTAINER);
        stacking_structure.push(RESIZER_CONTAINER);
        break;
      case "CODE_EDITOR":
        const CODE_EDITOR = {
          type: "CODE_EDITOR",
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
    handleLeftClick(e);
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
      onContextMenu={handleRightClick}
      onClick={handleLeftClick}
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
              case "EXPLORER":
                return (
                  <ExplorerTypeContainer
                    key={"EXPLORER" + item.explorer_container_ref_index}
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
              case "CODE_EDITOR":
                return (
                  <VecoderEditorTypeContainer
                    key={"CODE_EDITOR" + item.code_editor_container_ref_index}
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
              case "RESIZER":
                return (
                  <ResizerTypeContainer
                    key={"RESZIER" + index}
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
