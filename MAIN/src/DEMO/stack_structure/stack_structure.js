import React, { useState, useContext, useEffect } from "react";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootStackContexts } from "../../DATA_MANAGERs/root_stack_manager/root_stack_contexts";
import { StackStructureContexts } from "./stack_structure_contexts";
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

const default_resizer_width = 12;
const default_resizer_color = "#292929";
const default_magnetic_range = 16;

/* { Stack Resizer } ======================================================================== */
const HorizontalStackResizer = ({
  index,
  unique_tag,
  calculate_stack_item_position,
}) => {
  const { isMouseDown, mousePosition, setSizeDiff, handle_resizer_on_drag } =
    useContext(StackStructureContexts);
  const [startPosition, setStartPosition] = useState(mousePosition);
  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [style, setStyle] = useState({
    backgroundColor: default_resizer_color,
    height: 50,
    left: calculate_stack_item_position("resizer", index),
  });
  useEffect(() => {
    setStyle((prevData) => {
      return {
        ...prevData,
        left: calculate_stack_item_position("resizer", index),
        backgroundColor:
          onHover || (onClick && isMouseDown)
            ? "#0078D4"
            : default_resizer_color,
        height: onHover || (onClick && isMouseDown) ? "calc(100% - 8px)" : 50,
      };
    });
  }, [mousePosition, onClick, isMouseDown, onHover]);
  useEffect(() => {
    if (!onClick) return;
    if (!isMouseDown) {
      setOnClick(false);
      return;
    }
    setSizeDiff({
      ...setSizeDiff,
      [unique_tag]: mousePosition.x - startPosition.x,
    });
  }, [mousePosition, onClick, isMouseDown]);

  return (
    <div
      style={{
        /* { Stack Resizer Position } ---------------------- */
        position: "absolute",
        top: 0,
        left: style.left,

        /* { Stack Resizer Size } -------------------------- */
        width: default_resizer_width,
        height: "100%",
        cursor: "ew-resize",
        userSelect: "none",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => {
        setOnHover(false);
      }}
      onMouseDown={(e) => {
        setOnClick(true);
        setStartPosition(handle_resizer_on_drag(e));
      }}
    >
      <div
        style={{
          transition:
            "height 0.32s cubic-bezier(0.32, 0.96, 0.32, 1.08), background-color 0.32s",

          /* { Resizer Handle Position } ------------------- */
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          /* { Resizer Handle Size } ----------------------- */
          width: 4,
          height: style.height,

          /* { Resizer Handle Styling } -------------------- */
          borderRadius: 4,
          backgroundColor: style.backgroundColor,
        }}
      ></div>
    </div>
  );
};
/* { Stack Item } =========================================================================== */
const HorizontalStackItem = ({
  index,
  unique_tag,
  calculate_stack_item_position,
}) => {
  const { isMouseDown, mousePosition, calculate_stack_item_width } = useContext(
    StackStructureContexts
  );
  const [width, setWidth] = useState(calculate_stack_item_width(unique_tag));
  const [left, setLeft] = useState(
    calculate_stack_item_position("item", index)
  );
  useEffect(() => {
    setWidth(calculate_stack_item_width(unique_tag));
    setLeft(calculate_stack_item_position("item", index));
  }, [isMouseDown, mousePosition]);

  return (
    <div
      style={{
        /* { Stack Item Position } ---------------------- */
        position: "absolute",
        top: 0,
        left: left,

        /* { Stack Item Size } -------------------------- */
        width: width,
        height: "100%",

        /* { Stack Item Styling } ----------------------- */
        border: "1px solid #8C8C8C64",
        boxSizing: "border-box",
        color: "#8C8C8C32",
        overflow: "hidden",
      }}
    >
      {unique_tag}
    </div>
  );
};
/* { Stack Structure } ====================================================================== */
const HorizontalStack = ({ sub_items }) => {
  const { calculate_stack_item_width } = useContext(StackStructureContexts);
  const calculate_stack_item_position = (type, index) => {
    let left = 0;
    if (type === "resizer") {
      index = index + 1;
      left = 0;
      for (let i = 0; i < index; i++) {
        left +=
          calculate_stack_item_width(sub_items[i]) + default_resizer_width;
      }
      return left - default_resizer_width;
    } else {
      for (let i = 0; i < index; i++) {
        left +=
          calculate_stack_item_width(sub_items[i]) + default_resizer_width;
      }
      return left;
    }
  };
  return (
    <div
      style={{
        /* { Stack Structure Position } ---------------------- */
        position: "absolute",
        top: 0,
        left: 0,

        /* { Stack Structure Size } -------------------------- */
        height: "100%",
        width: "100%",

        /* { Stack Structure Styling } ----------------------- */
        boxSizing: "border-box",
      }}
    >
      {sub_items.map((unique_tag, index) => {
        return (
          <div key={unique_tag}>
            <HorizontalStackItem
              index={index}
              unique_tag={unique_tag}
              calculate_stack_item_position={calculate_stack_item_position}
            />
            <HorizontalStackResizer
              index={index}
              unique_tag={unique_tag}
              calculate_stack_item_position={calculate_stack_item_position}
            />
          </div>
        );
      })}
    </div>
  );
};

const StackStructure = () => {
  const {
    stackStructure,
    setStackStructure,
    access_sub_items_by_tag,
    access_type_by_tag,
    access_width_by_tag,
    update_width_by_tag,
    access_min_width_by_tag,
  } = React.useContext(RootStackContexts);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [sizeDiff, setSizeDiff] = useState({});

  const calculate_stack_item_width = (unique_tag) => {
    const min_width = access_min_width_by_tag(unique_tag);
    const magnetic_width = [min_width];

    if (sizeDiff[unique_tag]) {
      const width = Math.max(
        access_width_by_tag(unique_tag) + sizeDiff[unique_tag],
        min_width
      );

      /* { Magnetic } -------------------------------------------------------------------- */
      for (let i = 0; i < magnetic_width.length; i++) {
        if (Math.abs(width - magnetic_width[i]) < default_magnetic_range) {
          return magnetic_width[i];
        }
      }
      /* { Magnetic } -------------------------------------------------------------------- */
      return width;
    }
    return access_width_by_tag(unique_tag);
  };
  useEffect(() => {
    if (isMouseDown) return;
    for (let key in sizeDiff) {
      update_width_by_tag(key, calculate_stack_item_width(key));
    }
    setSizeDiff({});
  }, [isMouseDown]);
  const handle_resizer_on_drag = (event) => {
    const handleMouseUp = (event) => {
      setIsMouseDown(false);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    setIsMouseDown(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    setMousePosition({ x: event.clientX, y: event.clientY });
    return { x: event.clientX, y: event.clientY };
  };
  const render_stack_component_by_tag = (unique_tag) => {
    const type = access_type_by_tag(unique_tag);
    switch (type) {
      case "horizontal_stack":
        return (
          <HorizontalStack sub_items={access_sub_items_by_tag(unique_tag)} />
        );

      default:
        return <div>{unique_tag}</div>;
    }
  };

  return (
    <TestingWrapper>
      <StackStructureContexts.Provider
        value={{
          isMouseDown,
          mousePosition,
          setSizeDiff,
          calculate_stack_item_width,
          handle_resizer_on_drag,
          render_stack_component_by_tag,
        }}
      >
        {render_stack_component_by_tag("root")}
      </StackStructureContexts.Provider>
    </TestingWrapper>
  );
};

export default StackStructure;
