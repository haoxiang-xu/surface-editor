import React, { useState, useRef, useEffect, useContext } from "react";
import "./dirItemGhostDragImage.css";
import { ICON_MANAGER } from "../../ICONs/icon_manager";
import Tag from "../tag/tag";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";

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

const DirItemGhostDragImage = ({ draggedDirItemPath }) => {
  const { access_file_name_by_path_in_file } = useContext(RootDataContexts);
  const [position, setPosition] = useState({
    x: -9999,
    y: -9999,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const tagRef = useRef(null);
  useEffect(() => {
    const onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("dragover", onDragOver);
    return () => {
      window.removeEventListener("dragover", onDragOver);
    };
  }, []);
  useEffect(() => {
    if (tagRef.current) {
      setContainerWidth(tagRef.current.offsetWidth);
      setContainerHeight(tagRef.current.offsetHeight);
    }
  }, [tagRef.current]);

  return (
    <>
      {draggedDirItemPath ? (
        <div
          style={{
            position: "fixed",
            transform: "translate(-50%, -50%)",

            left: position.x,
            top: position.y,
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {/* <span className="ghost_drag_image_filetype_label0207" ref={tagRef}>
            {access_file_name_by_path_in_file(draggedDirItemPath)}
          </span> */}
          <Tag
            config={{
              reference: tagRef,
              type: "file",
              label: access_file_name_by_path_in_file(draggedDirItemPath),
              style: {
                borderRadius: 6,
                fontSize: 12,
              },
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default DirItemGhostDragImage;
