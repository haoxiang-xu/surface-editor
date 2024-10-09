import React, { useState, useRef, useEffect, useContext } from "react";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import Tag from "../tag/tag";
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

const GhostImage = ({ onDragItem }) => {
  const { access_file_name_by_path_in_file } = useContext(RootDataContexts);
  const { onDragPosition, setOnDragPosition } = useContext(RootCommandContexts);

  const [positionX, setPositionX] = useState(-9999);
  const [positionY, setPositionY] = useState(-9999);
  const [ghostImage, setGhostImage] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const tagRef = useRef(null);

  const render_ghost_image = (onDragItem) => {
    if (!onDragItem.ghost_image) {
      return null;
    } else if (onDragItem.ghost_image === "tag") {
      switch (onDragItem.content.type) {
        case "file":
          return (
            <Tag
              config={{
                reference: tagRef,
                type: "file",
                label: access_file_name_by_path_in_file(
                  onDragItem.content.path
                ),
              }}
            />
          );
        case "folder":
          return (
            <Tag
              config={{
                reference: tagRef,
                type: "file",
                label: access_file_name_by_path_in_file(
                  onDragItem.content.path
                ),
              }}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    const handle_drag_over_event_ghost_image = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setPositionX((prev) => {
        const newX = event.clientX;
        if (prev !== newX) {
          return newX;
        } else {
          return prev;
        }
      });
      setPositionY((prev) => {
        const newY = event.clientY;
        if (prev !== newY) {
          return newY;
        } else {
          return prev;
        }
      });
    };
    window.addEventListener("dragover", handle_drag_over_event_ghost_image);
    return () => {
      window.removeEventListener(
        "dragover",
        handle_drag_over_event_ghost_image
      );
    };
  }, []);
  useEffect(() => {
    setGhostImage(render_ghost_image(onDragItem));
  }, [onDragItem]);
  useEffect(() => {
    if (tagRef.current) {
      setContainerWidth(tagRef.current.offsetWidth);
      setContainerHeight(tagRef.current.offsetHeight);
    }
  }, [tagRef.current]);
  useEffect(() => {
    setOnDragPosition({ x: positionX, y: positionY });
  }, [positionX, positionY]);

  return (
    <div
      style={{
        position: "fixed",
        left: positionX,
        top: positionY,
        transform: "translate(-50%, -50%)",
        zIndex: 64,

        width: containerWidth,
        height: containerHeight,
        pointerEvents: "none",
      }}
    >
      {ghostImage}
    </div>
  );
};

export default GhostImage;
