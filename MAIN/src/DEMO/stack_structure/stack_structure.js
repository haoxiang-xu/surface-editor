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
const default_magnetic_range = 12;

/* { Stack Resizer } ======================================================================== */
/* 
  Mouse Movement -> update PendingItemSizeFilter 
  Mouse OnClick -> update ItemMagneticPositions
*/
const HorizontalStackResizer = ({
  index,
  unique_tag,
  sub_items,
  calculate_stack_item_position,
  calculate_all_magnetic_positions,
}) => {
  const { access_min_width_by_tag, access_width_by_tag } =
    useContext(RootStackContexts);
  const {
    isMouseDown,
    mousePosition,
    pendingItemSizeFilter,
    setPendingItemSizeFilter,
    itemMagneticPositions,
    setItemMagneticPositions,
    calculate_stack_item_width,
    handle_resizer_on_drag,
  } = useContext(StackStructureContexts);
  const [startPosition, setStartPosition] = useState(mousePosition);
  const [onHover, setOnHover] = useState(false);
  const [onLeftClick, setOnLeftClick] = useState(false);
  const [onRightClick, setOnRightClick] = useState(false);
  const [style, setStyle] = useState({
    backgroundColor: default_resizer_color,
    height: 50,
    left: calculate_stack_item_position("resizer", index),
  });

  const mouse_down_set_magnetic_positions = () => {
    if (!isMouseDown || !onLeftClick) return;
    setItemMagneticPositions((prevState) => ({
      ...prevState,
      [unique_tag]: calculate_all_magnetic_positions(index, unique_tag),
    }));
  };
  /* { Styling } ------------------------------------------------- */
  useEffect(() => {
    setStyle((prevData) => {
      return {
        ...prevData,
        left: calculate_stack_item_position("resizer", index),
        backgroundColor:
          onHover || onLeftClick || (onRightClick && isMouseDown)
            ? "#0078D4"
            : default_resizer_color,
        height:
          onHover || onLeftClick || (onRightClick && isMouseDown)
            ? "calc(100% - 8px)"
            : 50,
      };
    });
  }, [mousePosition, onLeftClick, onRightClick, isMouseDown, onHover]);
  /* { Adjust Width } -------------------------------------------- */
  useEffect(() => {
    if (!isMouseDown) {
      setOnLeftClick(false);
      setOnRightClick(false);
      return;
    }
    /* { Adjust Current Index Item Width } */
    if (onLeftClick) {
      setPendingItemSizeFilter((prevState) => ({
        ...prevState,
        [unique_tag]: mousePosition.x - startPosition.x,
      }));
    }
    /* { Adjust Current and Next Item Width } */
    if (onRightClick) {
      if (index + 1 < sub_items.length) {
        setPendingItemSizeFilter((prevState) => ({
          ...prevState,
          [unique_tag]: mousePosition.x - startPosition.x,
          [sub_items[index + 1]]: startPosition.x - mousePosition.x,
        }));
      } else {
        setPendingItemSizeFilter((prevState) => ({
          ...prevState,
          [unique_tag]: mousePosition.x - startPosition.x,
        }));
      }
    }
  }, [mousePosition, onLeftClick, onRightClick, isMouseDown]);
  /* { When Mouse Click Set Magnetic Positions } ----------------- */
  useEffect(() => {
    mouse_down_set_magnetic_positions();
  }, [onLeftClick, onRightClick, isMouseDown]);

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
        if (e.button === 0) {
          setOnLeftClick(true);
        } else {
          setOnRightClick(true);
        }
        setStartPosition(handle_resizer_on_drag(e));
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDoubleClick={() => {}}
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
  const { access_min_width_by_tag } = useContext(RootStackContexts);
  const { mousePosition, pendingItemSizeFilter, calculate_stack_item_width } =
    useContext(StackStructureContexts);
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
  /* { Magnetic Positions } -------------------------------------------------------------------- */
  const calculate_all_magnetic_positions = (index, unique_tag) => {
    /* { Min Positions }  */
    const min_width = access_min_width_by_tag(unique_tag);
    /* { To Border Positions }  */
    const to_border_width =
      index > 0
        ? window.innerWidth -
          (calculate_stack_item_position("resizer", index - 1) +
            2 * default_resizer_width)
        : window.innerWidth - default_resizer_width;

    let magnetic_positions = [min_width];
    /* { All Stack Item To Border Positions } */
    for (let i = index + 1; i < sub_items.length; i++) {
      magnetic_positions.push(
        window.innerWidth -
          (calculate_stack_item_position("resizer", i - 1) +
            2 * default_resizer_width +
            calculate_stack_item_width(sub_items[i])) +
          calculate_stack_item_width(sub_items[index])
      );
    }
    magnetic_positions.push(to_border_width);
    return magnetic_positions;
  };
  /* { Magnetic Positions } -------------------------------------------------------------------- */
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
              sub_items={sub_items}
              calculate_stack_item_position={calculate_stack_item_position}
              calculate_all_magnetic_positions={
                calculate_all_magnetic_positions
              }
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

  const [pendingItemSizeFilter, setPendingItemSizeFilter] = useState({});
  const [itemMagneticPositions, setItemMagneticPositions] = useState({});
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [keyPressed, setKeyPressed] = useState(null);
  useEffect(() => {
    if (isMouseDown) return;
    for (let key in pendingItemSizeFilter) {
      update_width_by_tag(key, calculate_stack_item_width(key));
    }
    setPendingItemSizeFilter({});
  }, [isMouseDown]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const calculate_stack_item_width = (unique_tag) => {
    const min_width = access_min_width_by_tag(unique_tag);
    if (
      pendingItemSizeFilter[unique_tag] &&
      itemMagneticPositions[unique_tag]
    ) {
      const magnetic_positions = itemMagneticPositions[unique_tag];
      const width = Math.min(
        Math.max(
          access_width_by_tag(unique_tag) + pendingItemSizeFilter[unique_tag],
          min_width
        ),
        itemMagneticPositions[unique_tag][
          itemMagneticPositions[unique_tag].length - 1
        ]
      );
      /* { Magnetic } -------------------------------------------------------------------- */
      for (let i = 0; i < magnetic_positions.length; i++) {
        if (Math.abs(width - magnetic_positions[i]) < default_magnetic_range) {
          return magnetic_positions[i];
        }
      }
      /* { Magnetic } -------------------------------------------------------------------- */
      return width;
    }
    return access_width_by_tag(unique_tag);
  };
  /* { Resizer Drag } -------------------------------------------------------------------- */
  /* 
    When Mouse Move -> update Mouse Position
  */
  const handle_resizer_on_drag = (event) => {
    const handleMouseUp = (event) => {
      setIsMouseDown(false);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.cursor = "default";
    };
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setKeyPressed("Shift");
        console.log("Shift");
      }
    };
    setIsMouseDown(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.cursor = "ew-resize";

    setMousePosition({ x: event.clientX, y: event.clientY });
    return { x: event.clientX, y: event.clientY };
  };
  /* { Render Stack Component } ---------------------------------------------------------- */
  /*
    -> Render Stack Frame By Default and pass unique_tag as type
    -> Else Render Stack Structure By type
  */
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
          pendingItemSizeFilter,
          setPendingItemSizeFilter,
          itemMagneticPositions,
          setItemMagneticPositions,
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
