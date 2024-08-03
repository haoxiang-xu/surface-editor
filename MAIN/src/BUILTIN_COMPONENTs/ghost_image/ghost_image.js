import React, { useState, useRef, useEffect, useContext } from "react";
import { ICON_MANAGER } from "../../ICONs/icon_manager";

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
/* Load ICON manager --------------------------------------------------------------------------------- */

const GhostImage = ({}) => {
  const [positionX, setPositionX] = useState(null);
  const [positionY, setPositionY] = useState(null);

  useEffect(() => {
    const handle_drag_over_event_ghost_image = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setPositionX(event.clientX);
      setPositionY(event.clientY);
    };
    window.addEventListener("dragover", handle_drag_over_event_ghost_image);
    return () => {
      window.removeEventListener(
        "dragover",
        handle_drag_over_event_ghost_image
      );
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: positionX,
        top: positionY,
        transform: "translate(-50%, -50%)",
        zIndex: 64,

        width: "100px",
        height: "100px",

        backgroundColor: "rgba(0, 0, 0, 0.25)",
        pointerEvents: "none",
      }}
    ></div>
  );
};

export default GhostImage;
