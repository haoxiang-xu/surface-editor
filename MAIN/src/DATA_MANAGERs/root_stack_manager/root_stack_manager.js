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
      "monaco_editor_0003",
      "monaco_editor_0004",
    ],
  },
  surface_explorer_0001: {
    type: "surface_explorer",
    parent_unique_tag: "root",
    position: { x_start: 0, y_start: 0, x_end: 100, y_end: 0 },
    min_width: 50,
  },
  monaco_editor_0002: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 100, y_start: 0, x_end: 200, y_end: 0 },
    min_width: 50,
  },
  monaco_editor_0003: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 200, y_start: 0, x_end: 300, y_end: 0 },
    min_width: 50,
  },
  monaco_editor_0004: {
    type: "monaco_editor",
    parent_unique_tag: "root",
    position: { x_start: 300, y_start: 0, x_end: 400, y_end: 0 },
    min_width: 50,
  },
};

const RootStackManager = ({ children }) => {
  const [stackStructure, setStackStructure] = useState(FAKE_STACK_STRUCTURE);

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
  const update_position_by_tag = (unique_tag, position) => {
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
  const update_positon_by_tag_auto_adjust = (unique_tag, position) => {
    const parent = stackStructure[access_parent_by_tag(unique_tag)];
    const current = stackStructure[unique_tag];

    if (!parent) return;
    switch (parent.type) {
      case "horizontal_stack":
        /* { Make sure the new position is appliable } ----------------------------- */
        let new_position = position;
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
              update_position_by_tag(sub_items[i], {
                x_start: sub_item.position.x_start + position_diff.x_start,
                y_start: sub_item.position.y_start,
                x_end: sub_item.position.x_end + position_diff.x_start,
                y_end: sub_item.position.y_end,
              });
            }
            update_position_by_tag(sub_items[target_index], target_position);
            break;
          } else {
            new_position.x_start = current.position.x_start;
            new_position.x_end = current.position.x_start + current.min_width;
            update_position_by_tag(unique_tag, new_position);
          }
        }
        if (new_position.x_end > window.innerWidth) {
          new_position.x_end = window.innerWidth;
          update_position_by_tag(unique_tag, new_position);
        }
        const position_diff = {
          x_start: new_position.x_start - current.position.x_start,
          y_start: new_position.y_start - current.position.y_start,
          x_end: new_position.x_end - current.position.x_end,
          y_end: new_position.y_end - current.position.y_end,
        };
        /* { Make sure the new position is appliable } ----------------------------- */
        update_position_by_tag(unique_tag, new_position);
        const sub_items = access_sub_items_by_tag(
          access_parent_by_tag(unique_tag)
        );
        const current_index = sub_items.indexOf(unique_tag);
        for (let i = current_index; i < sub_items.length; i++) {
          const sub_item = stackStructure[sub_items[i]];
          if (sub_item === current) continue;
          update_position_by_tag(sub_items[i], {
            x_start: sub_item.position.x_start + position_diff.x_end,
            y_start: sub_item.position.y_start,
            x_end: sub_item.position.x_end + position_diff.x_end,
            y_end: sub_item.position.y_end,
          });
        }
        break;
    }
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
        update_position_by_tag,
        access_sub_items_by_tag,
        calculate_magnetic_positions_by_tag,
        update_positon_by_tag_auto_adjust,
      }}
    >
      {children}
    </RootStackContexts.Provider>
  );
};

export default RootStackManager;
