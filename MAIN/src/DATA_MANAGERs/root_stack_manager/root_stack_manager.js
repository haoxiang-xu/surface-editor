import React, { useState, useEffect } from "react";
import { RootStackContexts } from "./root_stack_contexts";

const FAKE_STACK_STRUCTURE = {
  root: {
    type: "horizontal_stack",
    parent_unique_tag: null,
    position: { x_start: 0, y_start: 0, x_end: 0, y_end: 0 },
    sub_items: [
      "surface_explorer_0001",
      "monaco_editor_0002",
      "vertical_list_0005",
      "monaco_editor_0004",
      "monaco_editor_0003",
    ],
  },
  surface_explorer_0001: {
    type: "surface_explorer",
    parent_unique_tag: "root",
    position: { x_start: 0, y_start: 0, x_end: 100, y_end: 0 },
    min_width: 50,
    min_height: 50,
  },
  monaco_editor_0002: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 100, y_start: 0, x_end: 200, y_end: 0 },
    min_width: 50,
    min_height: 50,
  },
  monaco_editor_0003: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 400, y_start: 0, x_end: 500, y_end: 0 },
    min_width: 50,
    min_height: 50,
  },
  monaco_editor_0004: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 300, y_start: 0, x_end: 400, y_end: 0 },
    min_width: 50,
    min_height: 50,
  },
  vertical_list_0005: {
    type: "vertical_list",
    parent_unique_tag: "root",
    position: { x_start: 200, y_start: 0, x_end: 300, y_end: 0 },
    min_width: 50,
    sub_items: [
      "monaco_editor_0006",
      "monaco_editor_0007",
      "monaco_editor_0008",
    ],
  },
  monaco_editor_0006: {
    type: "monaco_editor",
    parent_unique_tag: "vertical_list_0005",
    position: { x_start: 200, y_start: 0, x_end: 300, y_end: 100 },
    min_width: 50,
    min_height: 50,
  },
  monaco_editor_0007: {
    type: "monaco_editor",
    parent_unique_tag: "vertical_list_0005",
    position: { x_start: 200, y_start: 100, x_end: 300, y_end: 200 },
    min_width: 50,
    min_height: 50,
  },
  monaco_editor_0008: {
    type: "monaco_editor",
    parent_unique_tag: "vertical_list_0005",
    position: { x_start: 200, y_start: 200, x_end: 300, y_end: 300 },
    min_width: 50,
    min_height: 50,
  },
};

const RootStackManager = ({ children }) => {
  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });

  /* { Access and Update Basic Stack Structure Value } ------------------------------------------------------------------------------------------------------------------------ */
  const access_type_by_tag = (unique_tag) => {
    const type = stackStructure[unique_tag].type;
    if (!type) return null;
    return type;
  };
  const access_parent_by_tag = (unique_tag) => {
    const parent = stackStructure[unique_tag].parent_unique_tag;
    if (!parent) return null;
    return parent;
  };
  const access_min_width_by_tag = (unique_tag) => {
    const min_width = stackStructure[unique_tag].min_width;
    if (!min_width) return 0;
    return min_width;
  };
  const access_position_by_tag = (unique_tag) => {
    const position = stackStructure[unique_tag].position;
    if (!position) return null;
    return position;
  };
  const update_individual_position_by_tag = (unique_tag, position) => {
    if (!position) return;
    const new_position = position;
    if (
      new_position.x_end - new_position.x_start <
      access_min_width_by_tag(unique_tag)
    ) {
      new_position.x_end =
        new_position.x_start + access_min_width_by_tag(unique_tag);
    }
    setStackStructure((prevData) => {
      return {
        ...prevData,
        [unique_tag]: {
          ...prevData[unique_tag],
          position: new_position,
        },
      };
    });
  };
  const access_sub_items_by_tag = (unique_tag) => {
    const sub_items = stackStructure[unique_tag].sub_items;
    if (!sub_items) return [];
    return sub_items;
  };
  /* { Access and Update Basic Stack Structure Value } ------------------------------------------------------------------------------------------------------------------------ */

  /* { Recursively update positions responsing to window dimension } */
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  useEffect(() => {
    update_frame_positions();
  }, [windowDimension]);
  const update_frame_positions = () => {
    const recursively_update_frame_positions = (
      unique_tag,
      position_filter
    ) => {
      const current = stackStructure[unique_tag];
      const type = current.type;
      let new_position = current.position;
      let sub_items = [];
      let sub_position_filter = {};
      switch (type) {
        case "horizontal_stack":
          const window_height = windowDimension.height;
          new_position.y_end = window_height;
          update_individual_position_by_tag(unique_tag, new_position);

          sub_items = current.sub_items;
          sub_position_filter = {
            x_start: null,
            y_start: null,
            x_end: null,
            y_end: new_position.y_end,
          };

          for (let i = 0; i < sub_items.length; i++) {
            recursively_update_frame_positions(
              sub_items[i],
              sub_position_filter
            );
          }
          break;
        case "vertical_list":
          Object.keys(position_filter).map((key) => {
            new_position[key] = position_filter[key] || new_position[key];
          });
          recursively_update_position(
            "vertical_list",
            unique_tag,
            new_position
          );
          sub_items = current.sub_items;
          sub_position_filter = {
            x_start: null,
            y_start: null,
            x_end: null,
            y_end: new_position.y_end,
          };
          recursively_update_frame_positions(
            sub_items[sub_items.length - 1],
            sub_position_filter
          );

        default:
          Object.keys(position_filter).map((key) => {
            new_position[key] = position_filter[key] || new_position[key];
          });
          recursively_update_position(
            access_type_by_tag(unique_tag),
            unique_tag,
            new_position
          );
          break;
      }
    };
    recursively_update_frame_positions("root", {});
  };
  /* { Calculate Magnetic Positions }  */
  const calculate_magnetic_positions_by_tag = (unique_tag) => {
    const parent = stackStructure[access_parent_by_tag(unique_tag)];
    const current = stackStructure[unique_tag];
    if (!parent) return;
    switch (parent.type) {
      case "horizontal_stack":
        let magnetic_positions = [
          stackStructure[unique_tag].position.x_start +
            stackStructure[unique_tag].min_width,
        ];
        const sub_items = access_sub_items_by_tag(
          access_parent_by_tag(unique_tag)
        );
        const current_index = sub_items.indexOf(unique_tag);
        let offset = 0;
        for (let i = current_index + 1; i < sub_items.length; i++) {
          const sub_item = stackStructure[sub_items[i]];
          offset += sub_item.position.x_end - sub_item.position.x_start;
          magnetic_positions.push(window.innerWidth - offset);
        }
        offset = 0;
        for (let i = current_index - 1; i >= 0; i--) {
          const sub_item = stackStructure[sub_items[i]];
          offset += sub_item.min_width;
          magnetic_positions.push(
            sub_item.position.x_start + offset + current.min_width
          );
        }
        magnetic_positions.push(window.innerWidth);
        return magnetic_positions;
    }
    return [];
  };
  /* { Update Positions and auto adjust related stack frames } */
  const recursively_update_position = (type, unique_tag, position) => {
    if (type === "horizontal_stack" || type === "vertical_list") {
      update_position_by_tag_auto_adjust_sub_level(unique_tag, position);
    } else {
      update_individual_position_by_tag(unique_tag, position);
    }
  };
  const update_positon_by_tag_auto_adjust_current_level = (
    unique_tag,
    position
  ) => {
    const parent = stackStructure[access_parent_by_tag(unique_tag)];
    const current = stackStructure[unique_tag];

    if (!parent) return;
    let new_position = position;
    switch (parent.type) {
      case "horizontal_stack":
        {
          /* { Make sure the new position is appliable } ----------------------------- */
          if (new_position.x_end - new_position.x_start < current.min_width) {
            /* { Find not reaching min_width Item and propegate position from it } */
            const sub_items = access_sub_items_by_tag(
              access_parent_by_tag(unique_tag)
            );
            const current_index = sub_items.indexOf(unique_tag);
            let target_index = -1;
            for (let i = current_index - 1; i >= 0; i--) {
              if (
                stackStructure[sub_items[i]].position.x_end -
                  stackStructure[sub_items[i]].position.x_start >
                  stackStructure[sub_items[i]].min_width &&
                stackStructure[sub_items[i]].position.x_start >= 0
              ) {
                target_index = i;
                break;
              }
            }
            if (target_index !== -1) {
              new_position.x_start =
                position.x_start +
                (new_position.x_end - new_position.x_start - current.min_width);

              let position_diff = {
                x_start: new_position.x_start - current.position.x_start,
                y_start: new_position.y_start - current.position.y_start,
                x_end: new_position.x_end - current.position.x_end,
                y_end: new_position.y_end - current.position.y_end,
              };

              const target = stackStructure[sub_items[target_index]];
              const target_position = {
                x_start: target.position.x_start,
                y_start: target.position.y_start,
                x_end: target.position.x_end + position_diff.x_start,
                y_end: target.position.y_end,
              };

              if (
                target_position.x_end - target_position.x_start <
                target.min_width
              ) {
                position_diff.x_start =
                  position_diff.x_start +
                  (target.min_width -
                    (target_position.x_end - target_position.x_start));
              }

              for (let i = target_index + 1; i < sub_items.length; i++) {
                const sub_item = stackStructure[sub_items[i]];
                recursively_update_position(sub_item.type, sub_items[i], {
                  x_start: sub_item.position.x_start + position_diff.x_start,
                  y_start: sub_item.position.y_start,
                  x_end: sub_item.position.x_end + position_diff.x_start,
                  y_end: sub_item.position.y_end,
                });
              }
              recursively_update_position(
                access_type_by_tag(sub_items[target_index]),
                sub_items[target_index],
                target_position
              );
              break;
            } else {
              new_position.x_start = current.position.x_start;
              new_position.x_end = current.position.x_start + current.min_width;
              recursively_update_position(
                current.type,
                unique_tag,
                new_position
              );
            }
          }
          if (new_position.x_end > window.innerWidth) {
            new_position.x_end = window.innerWidth;
            update_individual_position_by_tag(unique_tag, new_position);
          }
          const position_diff = {
            x_start: new_position.x_start - current.position.x_start,
            y_start: new_position.y_start - current.position.y_start,
            x_end: new_position.x_end - current.position.x_end,
            y_end: new_position.y_end - current.position.y_end,
          };
          /* { Make sure the new position is appliable } ----------------------------- */
          const sub_items = access_sub_items_by_tag(
            access_parent_by_tag(unique_tag)
          );
          const current_index = sub_items.indexOf(unique_tag);
          recursively_update_position(current.type, unique_tag, new_position);
          for (let i = current_index; i < sub_items.length; i++) {
            const sub_item = stackStructure[sub_items[i]];
            if (sub_item === current) continue;
            recursively_update_position(sub_item.type, sub_items[i], {
              x_start: sub_item.position.x_start + position_diff.x_end,
              y_start: sub_item.position.y_start,
              x_end: sub_item.position.x_end + position_diff.x_end,
              y_end: sub_item.position.y_end,
            });
          }
        }
        break;
      case "vertical_list":
        {
          if (new_position.y_end - new_position.y_start < current.min_height) {
            break;
          }
          const sub_items = access_sub_items_by_tag(
            access_parent_by_tag(unique_tag)
          );
          const current_index = sub_items.indexOf(unique_tag);
          const next_item = stackStructure[sub_items[current_index + 1]];

          const position_diff = {
            x_start: new_position.x_start - current.position.x_start,
            y_start: new_position.y_start - current.position.y_start,
            x_end: new_position.x_end - current.position.x_end,
            y_end: new_position.y_end - current.position.y_end,
          };

          new_position.y_end = Math.min(
            new_position.y_end,
            window.innerHeight - next_item.min_height
          );

          if (
            next_item.position.y_end - (next_item.position.y_start + position_diff.y_end) <
            next_item.min_height
          ) {
            break;
          }

          recursively_update_position(current.type, unique_tag, new_position);
          recursively_update_position(
            next_item.type,
            sub_items[current_index + 1],
            {
              x_start: next_item.position.x_start,
              y_start: Math.min(
                next_item.position.y_start + position_diff.y_end,
                window.innerHeight - next_item.min_height
              ),
              x_end: next_item.position.x_end,
              y_end: next_item.position.y_end,
            }
          );
        }
        break;
    }
  };
  const update_position_by_tag_auto_adjust_sub_level = (
    unique_tag,
    position
  ) => {
    const current = stackStructure[unique_tag];
    const type = current.type;

    switch (type) {
      case "vertical_list":
        const sub_items = current.sub_items;
        for (let i = 0; i < sub_items.length; i++) {
          let new_position = access_position_by_tag(sub_items[i]);
          new_position.x_start = position.x_start;
          new_position.x_end = position.x_end;
          recursively_update_position(
            access_type_by_tag(sub_items[i]),
            sub_items[i],
            new_position
          );
        }
    }
    update_individual_position_by_tag(unique_tag, position);
  };

  return (
    <RootStackContexts.Provider
      value={{
        stackStructure,
        setStackStructure,
        access_type_by_tag,
        access_parent_by_tag,
        access_min_width_by_tag,
        access_position_by_tag,
        update_individual_position_by_tag,
        access_sub_items_by_tag,

        update_frame_positions,
        calculate_magnetic_positions_by_tag,
        update_positon_by_tag_auto_adjust:
          update_positon_by_tag_auto_adjust_current_level,
      }}
    >
      {children}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
