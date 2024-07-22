import React, { useState, useContext, useEffect } from "react";

/* { import contexts } ---------------------------------------------------------------------- */
import { RootStackContexts } from "../../DATA_MANAGERs/root_stack_manager/root_stack_contexts";
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

const default_resizer_offset = 12;
const default_resizer_color = "#292929";
const default_resizer_hover_color = "#0078D4";
const default_magnetic_range = 12;

const HorizontalStackWrapperResizer = ({ unique_tag }) => {
  const {
    access_position_by_tag,
    calculate_magnetic_positions_by_tag,
    update_positon_by_tag_auto_adjust,
  } = useContext(RootStackContexts);
  const [style, setStyle] = useState({
    height: 50,
    backgroundColor: default_resizer_color,
  });
  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);

  /* { Resizer Styling Update } ------------------------------------------------------------- */
  useEffect(() => {
    setStyle({
      height: onHover || onClick ? "calc(100% - 12px)" : 50,
      backgroundColor:
        onHover || onClick
          ? default_resizer_hover_color
          : default_resizer_color,
    });
  }, [onHover, onClick]);
  /* { Resizer Styling Update } ------------------------------------------------------------- */

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [startingPosition, setStartingPosition] = useState(
    access_position_by_tag(unique_tag)
  );
  const [magneticPositions, setMagneticPositions] = useState([]);
  const mouse_position_listener = (event) => {
    const handleMouseUp = (event) => {
      setOnClick(false);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
    };
    const handleMouseMove = (event) => {
      setMousePosition((prevState) => {
        setPerviousMousePosition(prevState);
        return { x: event.clientX, y: event.clientY };
      });
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.style.cursor = "ew-resize";

    setStartingPosition(access_position_by_tag(unique_tag));
    setMagneticPositions(calculate_magnetic_positions_by_tag(unique_tag));
    setClickPosition({ x: event.clientX, y: event.clientY });
    setMousePosition({ x: event.clientX, y: event.clientY });
  };
  useEffect(() => {
    if (!onClick) return;
    const pervious_position = access_position_by_tag(unique_tag);
    let new_x_end =
      startingPosition.x_end + (mousePosition.x - clickPosition.x);
    for (let i = 0; i < magneticPositions.length; i++) {
      if (Math.abs(new_x_end - magneticPositions[i]) < default_magnetic_range) {
        new_x_end = magneticPositions[i];
        break;
      }
    }
    update_positon_by_tag_auto_adjust(unique_tag, {
      x_start: pervious_position.x_start,
      y_start: pervious_position.y_start,
      x_end: new_x_end,
      y_end: pervious_position.y_end,
    });
  }, [mousePosition, onClick]);

  /* { Check If magnetic positions requires update } ---------------------------------------- */
  const [perviousMousePosition, setPerviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isMovingRight, setIsMovingRight] = useState(false);
  useEffect(() => {
    if (perviousMousePosition.x < mousePosition.x) {
      setIsMovingRight(true);
    } else {
      setIsMovingRight(false);
    }
  }, [mousePosition]);
  useEffect(() => {
    setMagneticPositions(calculate_magnetic_positions_by_tag(unique_tag));
  }, [isMovingRight]);
  /* { Check If magnetic positions requires update } ---------------------------------------- */

  return (
    <div
      style={{
        /* { Resizer Position } ----------------------- */
        position: "absolute",
        top: 0,
        right: 0,

        /* { Resizer Size } --------------------------- */
        width: default_resizer_offset,
        height: "100%",

        /* { Resizer Styling } ------------------------ */
        cursor: "ew-resize",
        zIndex: 12,
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onMouseDown={(event) => {
        setOnClick(true);
        mouse_position_listener(event);
      }}
      onMouseUp={() => setOnClick(false)}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrag={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div
        style={{
          transition:
            "height 0.32s cubic-bezier(0.32, 0.96, 0.32, 1.08), background-color 0.32s",
          /* { Handle Position } ---------------------- */
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          /* { Handle Size } -------------------------- */
          width: 4,
          height: style.height,

          /* { Handle Styling } ----------------------- */
          borderRadius: 4,
          backgroundColor: style.backgroundColor,
        }}
      ></div>
    </div>
  );
};
const VerticalStackWrapperResizer = ({ unique_tag }) => {
  const {
    access_position_by_tag,
    calculate_magnetic_positions_by_tag,
    update_positon_by_tag_auto_adjust,
  } = useContext(RootStackContexts);
  const [style, setStyle] = useState({
    width: 50,
    backgroundColor: default_resizer_color,
  });

  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);

  /* { Resizer Styling Update } ------------------------------------------------------------- */
  useEffect(() => {
    setStyle({
      width: onHover || onClick ? "calc(100% - 12px)" : 50,
      backgroundColor:
        onHover || onClick
          ? default_resizer_hover_color
          : default_resizer_color,
    });
  }, [onHover, onClick]);
  /* { Resizer Styling Update } ------------------------------------------------------------- */

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [startingPosition, setStartingPosition] = useState(
    access_position_by_tag(unique_tag)
  );
  const [magneticPositions, setMagneticPositions] = useState([]);
  const mouse_position_listener = (event) => {
    const handleMouseUp = (event) => {
      setOnClick(false);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
    };
    const handleMouseMove = (event) => {
      setMousePosition((prevState) => {
        setPerviousMousePosition(prevState);
        return { x: event.clientX, y: event.clientY };
      });
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.style.cursor = "ns-resize";

    setStartingPosition(access_position_by_tag(unique_tag));
    setMagneticPositions(calculate_magnetic_positions_by_tag(unique_tag));
    setClickPosition({ x: event.clientX, y: event.clientY });
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    if (!onClick) return;
    const pervious_position = access_position_by_tag(unique_tag);
    let new_y_end =
      startingPosition.y_end + (mousePosition.y - clickPosition.y);
    for (let i = 0; i < magneticPositions.length; i++) {
      if (Math.abs(new_y_end - magneticPositions[i]) < default_magnetic_range) {
        new_y_end = magneticPositions[i];
        break;
      }
    }
    update_positon_by_tag_auto_adjust(unique_tag, {
      x_start: pervious_position.x_start,
      y_start: pervious_position.y_start,
      x_end: pervious_position.x_end,
      y_end: new_y_end,
    });
  }, [mousePosition, onClick]);

  /* { Check If magnetic positions requires update } ---------------------------------------- */
  const [perviousMousePosition, setPerviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isMovingUp, setIsMovingUp] = useState(false);
  useEffect(() => {
    if (perviousMousePosition.y < mousePosition.y) {
      setIsMovingUp(false);
    } else {
      setIsMovingUp(true);
    }
  }, [mousePosition]);
  useEffect(() => {
    setMagneticPositions(calculate_magnetic_positions_by_tag(unique_tag));
  }, [isMovingUp]);
  /* { Check If magnetic positions requires update } ---------------------------------------- */

  return (
    <div
      style={{
        /* { Resizer Position } ----------------------- */
        position: "absolute",
        bottom: 0,
        left: 0,

        /* { Resizer Size } --------------------------- */
        height: default_resizer_offset,
        width: `calc(100% - ${default_resizer_offset}px)`,

        /* { Resizer Styling } ------------------------ */
        cursor: "ns-resize",
        zIndex: 12,
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onMouseDown={(event) => {
        setOnClick(true);
        mouse_position_listener(event);
      }}
      onMouseUp={() => setOnClick(false)}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrag={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div
        style={{
          transition:
            "width 0.32s cubic-bezier(0.32, 0.96, 0.32, 1.08), background-color 0.32s",
          /* { Handle Position } ---------------------- */
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          /* { Handle Size } -------------------------- */
          height: 4,
          width: style.width,
          maxWidth: "calc(100% - 8px)",

          /* { Handle Styling } ----------------------- */
          borderRadius: 4,
          backgroundColor: style.backgroundColor,
        }}
      ></div>
    </div>
  );
};
const StackFrameWrapper = ({ unique_tag }) => {
  const { stackStructure, access_parent_by_tag } =
    useContext(RootStackContexts);
  const {
    access_type_by_tag,
    access_min_width_by_tag,
    access_position_by_tag,
    access_sub_items_by_tag,
  } = useContext(RootStackContexts);
  const [prop, setProp] = useState(null);
  const [wrapper, setWrapper] = useState(null);
  useEffect(() => {
    setProp({
      type: access_type_by_tag(unique_tag),
      parent: access_parent_by_tag(unique_tag),
      min_width: access_min_width_by_tag(unique_tag),
      position: access_position_by_tag(unique_tag),
    });
  }, [stackStructure]);

  /* { Render Wrapper } ------------------------------------------------------------- */
  useEffect(() => {
    const render_stack_frame_wrapper = () => {
      let parent_type = "default";
      if (prop.parent) {
        parent_type = access_type_by_tag(prop.parent);
      }
      switch (parent_type) {
        case "horizontal_stack":
          return (
            <div
              style={{
                position: "absolute",
                top: prop.position.y_start,
                left: prop.position.x_start,
                width: prop.position.x_end - prop.position.x_start,
                height: prop.position.y_end - prop.position.y_start,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: default_resizer_offset,
                  bottom: 0,
                  left: 0,

                  /* { Stack Frame Content Styling } ----------------------- */
                  boxSizing: "border-box",
                  overflow: "hidden",
                  backgroundColor: "#3F3F3F32",
                }}
              >
                <span style={{ userSelect: "none" }}>{unique_tag}</span>
              </div>
              <HorizontalStackWrapperResizer unique_tag={unique_tag} />
            </div>
          );
        case "vertical_list":
          const parent_sub_items = access_sub_items_by_tag(
            access_parent_by_tag(unique_tag)
          );
          const current_index = parent_sub_items.indexOf(unique_tag);
          const sub_item_length = parent_sub_items.length;
          return (
            <div
              style={{
                position: "absolute",
                top: prop.position.y_start,
                left: prop.position.x_start,
                width: prop.position.x_end - prop.position.x_start,
                height: prop.position.y_end - prop.position.y_start,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: default_resizer_offset,
                  bottom:
                    current_index !== sub_item_length - 1
                      ? default_resizer_offset
                      : 0,
                  left: 0,

                  /* { Stack Frame Content Styling } ----------------------- */
                  boxSizing: "border-box",
                  overflow: "hidden",
                  backgroundColor: "#3F3F3F32",
                }}
              >
                <span style={{ userSelect: "none" }}>{unique_tag}</span>
              </div>
              {current_index !== sub_item_length - 1 ? (
                <VerticalStackWrapperResizer unique_tag={unique_tag} />
              ) : null}
            </div>
          );
        default:
          return null;
      }
    };
    if (!prop) return;
    setWrapper(render_stack_frame_wrapper(prop.type));
  }, [prop]);
  /* { Render Wrapper } ------------------------------------------------------------- */

  return wrapper;
};
const Stack = () => {
  const { stackStructure } = React.useContext(RootStackContexts);
  return (
    <TestingWrapper>
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
        {Object.keys(stackStructure).map((unique_tag) => {
          return <StackFrameWrapper key={unique_tag} unique_tag={unique_tag} />;
        })}
      </div>
    </TestingWrapper>
  );
};

export default Stack;
