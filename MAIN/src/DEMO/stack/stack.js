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

const default_resizer_width = 12;
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

  const [mousePosition, setMousePosition] = useState(
    access_position_by_tag(unique_tag)
  );
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
      setMousePosition({ x: event.clientX, y: event.clientY });
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
      if (
        Math.abs(new_x_end - magneticPositions[i]) <
        default_magnetic_range
      ) {
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

  return (
    <div
      style={{
        /* { Resizer Position } ----------------------- */
        position: "absolute",
        top: 0,
        right: 0,

        /* { Resizer Size } --------------------------- */
        width: default_resizer_width,
        height: "100%",

        /* { Resizer Styling } ------------------------ */
        cursor: "ew-resize",
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
const StackFrameWrapper = ({ unique_tag }) => {
  const { stackStructure } = useContext(RootStackContexts);
  const {
    access_type_by_tag,
    access_min_width_by_tag,
    access_position_by_tag,
  } = useContext(RootStackContexts);
  const [prop, setProp] = useState(null);
  const [wrapper, setWrapper] = useState(null);
  useEffect(() => {
    setProp({
      type: access_type_by_tag(unique_tag),
      min_width: access_min_width_by_tag(unique_tag),
      position: access_position_by_tag(unique_tag),
    });
  }, [stackStructure]);

  /* { Render Wrapper } ------------------------------------------------------------- */
  useEffect(() => {
    const render_stack_frame_wrapper = () => {
      switch (prop.type) {
        case "horizontal_stack":
          return null;
        default:
          return (
            <div
              style={{
                position: "absolute",
                top: prop.position.y_start,
                left: prop.position.x_start,
                width: prop.position.x_end - prop.position.x_start,
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: default_resizer_width,
                  bottom: 0,
                  left: 0,

                  /* { Stack Frame Content Styling } ----------------------- */
                  boxSizing: "border-box",
                  overflow: "hidden",
                  backgroundColor: "#3F3F3F32",
                }}
              >
                {unique_tag}
              </div>
              <HorizontalStackWrapperResizer unique_tag={unique_tag} />
            </div>
          );
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
