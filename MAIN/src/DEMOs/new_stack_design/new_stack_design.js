import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

const TESTING_STACK_STRUCTURE = {
  root: {
    id: "root",
    type: "horizontal_stack",
    sub_items: ["test_0001", "test_0002", "test_0003"],
  },
  vertical_stack_0001: {
    id: "vertical_stack_0001",
    parent_id: "root",
    type: "vertical_stack",
    sub_items: ["test_0003", "test_0004"],
  },
  test_0001: {
    id: "test_0001",
    parent_id: "root",
    type: "test",
    sub_items: [],
  },
  test_0002: {
    id: "test_0002",
    parent_id: "root",
    type: "test",
    sub_items: [],
  },
  test_0003: {
    id: "test_0003",
    parent_id: "root",
    type: "test",
    sub_items: [],
  },
  test_0004: {
    id: "test_0004",
    parent_id: "vertical_stack_0001",
    type: "test",
    sub_items: [],
  },
  test_0005: {
    id: "test_0005",
    parent_id: "vertical_stack_0001",
    type: "test",
    sub_items: [],
  },
};

const StackTestingContainer = React.memo(({ id }) => {
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
});
const HorizontalStack = ({ stack }) => {
  return (
    <div style={{ display: "flex" }}>
      {stack.sub_items.map((item_id) => {
        const item = TESTING_STACK_STRUCTURE[item_id];
        return <StackItem key={item.id} item={item} />;
      })}
    </div>
  );
};
const NewStackDesign = () => {
  /* Canvas --------------------------------------------------------------------------- */
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  /* { append canvas size change listener } */
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);
  /* Canvas --------------------------------------------------------------------------- */

  const [stackStructure, setStackStructure] = useState(TESTING_STACK_STRUCTURE);
  const [stackPositions, setStackPositions] = useState({});
  const [stackSizes, setStackSizes] = useState({});
  const [stackPendingChanges, setStackPendingChanges] = useState({});

  const initializeStackPositionsToZero = useCallback(() => {
    for (const [id, item] of Object.entries(stackStructure)) {
      setStackPositions((prev) => ({
        ...prev,
        [id]: {
          x: 0,
          y: 0,
        },
      }));
    }
  }, []);
  const initializeStackSizesToZero = useCallback(() => {
    for (const [id, item] of Object.entries(stackStructure)) {
      setStackSizes((prev) => ({
        ...prev,
        [id]: {
          width: 0,
          height: 0,
        },
      }));
    }
  }, []);

  return (
    <div>
      <h1>New Stack Design</h1>
      <p>Coming soon...</p>
    </div>
  );
};

export default NewStackDesign;
