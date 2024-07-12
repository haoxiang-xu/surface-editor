import React, { useState, useContext, useEffect } from "react";

import { default_clickable_panel_styling } from "../../DATA_MANAGERs/global_styling_manager/global_styling_default_consts";
import {
  context_menu_fixed_styling,
  button_fixed_styling,
  br_fixed_styling,
  customize_component_fixed_styling,
} from "./context_menu_fixed_styling_config";

import { RootCommandContexts } from "../../DATA_MANAGERs/root_command_manager/root_command_contexts";
import { ContextMenuContexts } from "./context_menu_contexts";

import { ICON_MANAGER } from "../../ICONs/icon_manager";

/* Load ICON manager -------------------------------- */
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
/* Load ICON manager -------------------------------- */

/* { Context Menu Prestyled Component } ======================================================================================================== */
const ContextItemButton = ({
  index,
  unique_tag,
  width,
  top_position,
  position_x,
  position_y,
  position_z,
  list_direction,
}) => {
  const {
    contextStructure,
    get_context_item_height,
    get_context_menu_show_up_direction,
    progress_context_menu_item,
  } = useContext(ContextMenuContexts);

  const [onHover, setOnHover] = useState(false);
  const [onClicked, setOnClicked] = useState(false);
  const [isIconLoaded, setIsIconLoaded] = useState(false);
  const handleIconLoad = () => {
    setIsIconLoaded(true);
  };
  const setButtonBorderRadius = () => {
    if (index === 0) {
      if (list_direction === 3) {
        return `${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px`;
      } else if (list_direction === 2) {
        return `${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px`;
      }
      return `${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px`;
    } else if (index === -1) {
      if (list_direction === 1) {
        return `${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.innerBorderRadius}px`;
      } else if (list_direction === 0) {
        return `${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.outterBorderRadius}px`;
      }
      return `${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.innerBorderRadius}px ${button_fixed_styling.outterBorderRadius}px ${button_fixed_styling.outterBorderRadius}px`;
    } else {
      return `${button_fixed_styling.innerBorderRadius}px`;
    }
  };
  const [style, setStyle] = useState({
    backgroundColor: default_clickable_panel_styling.backgroundColor.default,
    boxShadow: default_clickable_panel_styling.boxShadow.default,
    borderRadius: setButtonBorderRadius(),
    transition: default_clickable_panel_styling.transition.default,
  });
  useEffect(() => {
    if (onClicked && contextStructure[unique_tag].clickable) {
      setStyle({
        backgroundColor: `rgba(${
          context_menu_fixed_styling.backgroundColorR + 64
        }, ${context_menu_fixed_styling.backgroundColorG + 64}, ${
          context_menu_fixed_styling.backgroundColorB + 64
        }, 0.72)`,
        boxShadow: default_clickable_panel_styling.boxShadow.onClick,
        borderRadius: setButtonBorderRadius(),
        transition: default_clickable_panel_styling.transition.onClick,
      });
    } else if (onHover && contextStructure[unique_tag].clickable) {
      setStyle({
        backgroundColor: `rgba(${
          context_menu_fixed_styling.backgroundColorR + 32
        }, ${context_menu_fixed_styling.backgroundColorG + 32}, ${
          context_menu_fixed_styling.backgroundColorB + 32
        }, 0.72)`,
        boxShadow: default_clickable_panel_styling.boxShadow.onHover,
        borderRadius: setButtonBorderRadius(),
        transition: default_clickable_panel_styling.transition.onHover,
      });
    } else {
      setStyle({
        backgroundColor:
          default_clickable_panel_styling.backgroundColor.default,
        boxShadow: default_clickable_panel_styling.boxShadow.default,
        borderRadius: setButtonBorderRadius(),
        transition: default_clickable_panel_styling.transition.default,
      });
    }
  }, [onHover, onClicked]);
  const [subListPostion, setSubListPosition] = useState([[-999, -999], 0]);
  useEffect(() => {
    if (
      contextStructure[unique_tag].sub_items !== undefined &&
      contextStructure[unique_tag].sub_items.length !== 0
    ) {
      setSubListPosition(
        get_context_menu_show_up_direction(
          [
            [position_x - context_menu_fixed_styling.padding * 1.4, position_y],
            [
              position_x - context_menu_fixed_styling.padding * 1.4,
              position_y + get_context_item_height(unique_tag),
            ],
            [
              position_x - width + context_menu_fixed_styling.padding * 1.4,
              position_y,
            ],
            [
              position_x - width + context_menu_fixed_styling.padding * 1.4,
              position_y + get_context_item_height(unique_tag),
            ],
          ],
          contextStructure[unique_tag].sub_items,
          [
            [false, false, false, true],
            [false, true, false, false],
            [false, false, true, false],
            [true, false, false, false],
          ]
        )
      );
    }
  }, [position_x, position_y]);
  return (
    <div
      style={{
        /* POSITION -------------- */
        position: "absolute",
        top: top_position,
        left: context_menu_fixed_styling.padding,

        /* SIZE ------------------ */
        height: get_context_item_height(unique_tag),
        width: `calc(100% - ${context_menu_fixed_styling.padding * 2}px)`,

        /* STYLE ----------------- */
        fontSize: button_fixed_styling.fontSize,
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
        opacity: contextStructure[unique_tag].clickable ? 1 : 0.32,
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => {
        setOnHover(false);
        setOnClicked(false);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (
          contextStructure[unique_tag].clickable &&
          (contextStructure[unique_tag].sub_items === undefined ||
            contextStructure[unique_tag].sub_items.length === 0)
        ) {
          setOnClicked(true);
        }
      }}
      onMouseUp={() => {
        if (
          onClicked &&
          contextStructure[unique_tag].clickable &&
          (contextStructure[unique_tag].sub_items === undefined ||
            contextStructure[unique_tag].sub_items.length === 0)
        ) {
          progress_context_menu_item(unique_tag, {});
        }
        setOnClicked(false);
      }}
    >
      {/* Context Item Icon render ---------------------------------------------------------- */}
      <div
        style={{
          /* POSITION -------------- */
          position: "absolute",
          top: "50%",
          left: 5,
          transform: "translate(0%, -50%)",

          /* SIZE ------------------ */
          width: "16px",
          height: "16px",
          backgroundImage: isIconLoaded
            ? `url(${contextStructure[unique_tag].quick_view_background})`
            : null,
        }}
      >
        <img
          src={contextStructure[unique_tag].icon}
          style={{
            /* POSITION -------------- */
            position: "absolute",
            top: "0px",
            left: "0px",

            /* SIZE ------------------ */
            width: "16px",
            height: "16px",
            userSelect: "none",
          }}
          loading="lazy"
          onLoad={handleIconLoad}
          draggable={false}
          alt={unique_tag}
        />
      </div>
      {/* Context Item Icon render ---------------------------------------------------------- */}

      {/* Context Item Label render --------------------------------------------------------- */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "32px",
          color: "#CCCCCC",
          transform: "translate(0%, -54%)",
          userSelect: "none",
          opacity: 0.72,
        }}
      >
        {contextStructure[unique_tag].label}
      </span>
      {/* Context Item Label render --------------------------------------------------------- */}

      {/* Context Item Short Cut Label render ----------------------------------------------- */}
      {contextStructure[unique_tag].short_cut_label !== undefined ? (
        <span
          style={{
            position: "absolute",
            top: "50%",
            right: 6,
            color: "#CCCCCC",
            transform: "translate(0%, -54%)",
            userSelect: "none",
            fontSize: br_fixed_styling.fontSize,
            opacity: 0.32,
          }}
        >
          {contextStructure[unique_tag].short_cut_label}
        </span>
      ) : null}
      {/* Context Item Short Cut Label render ----------------------------------------------- */}

      {/* Context Item More option Icon render ---------------------------------------------- */}
      {contextStructure[unique_tag].sub_items !== undefined &&
      contextStructure[unique_tag].sub_items.length !== 0 ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "8px",
            transform: "translate(0%, -45%)",
            draggable: false,
          }}
        >
          <img
            style={{
              width: "16px",
              height: "16px",
              userSelect: "none",
            }}
            src={SYSTEM_ICON_MANAGER.arrow.ICON512}
            loading="lazy"
          />
        </div>
      ) : null}
      {/* Context Item More option Icon render ---------------------------------------------- */}

      {/* Context Item Sub List render ------------------------------------------------------ */}
      {contextStructure[unique_tag].sub_items !== undefined &&
      contextStructure[unique_tag].sub_items.length !== 0 &&
      onHover ? (
        <ContextList
          position_x={subListPostion[0][0]}
          position_y={subListPostion[0][1]}
          position_z={position_z}
          direction={subListPostion[1]}
          sub_items={contextStructure[unique_tag].sub_items}
        />
      ) : null}
    </div>
  );
};
const ContextItemBr = ({ index, unique_tag, top_position }) => {
  const { get_context_item_height } = useContext(ContextMenuContexts);

  return (
    <div
      style={{
        /* POSITION -------------- */
        position: "absolute",
        top: top_position + get_context_item_height(unique_tag) / 2,
        left:
          context_menu_fixed_styling.padding +
          context_menu_fixed_styling.padding,

        /* SIZE ------------------ */
        height: 1,
        width: `calc(100% - ${
          (context_menu_fixed_styling.padding +
            context_menu_fixed_styling.padding) *
          2
        }px)`,

        /* STYLE ----------------- */
        borderTop: "1px solid #58585896",
      }}
    ></div>
  );
};
const ContextItemCustomizeComponent = ({ index, unique_tag, top_position }) => {
  const {
    contextStructure,
    get_context_item_height,
    progress_context_menu_item,
  } = useContext(ContextMenuContexts);

  const [ContextItemComponent, setContextItemComponent] = useState(null);
  useEffect(() => {
    async function loadComponent() {
      const component_path = contextStructure[unique_tag].path;
      const { default: LoadedComponent } = await import(
        `../STACK_COMPONENTs/${component_path}`
      );
      setContextItemComponent(() => LoadedComponent);
    }

    loadComponent();
  }, [contextStructure]);

  return (
    <div
      style={{
        /* POSITION -------------- */
        position: "absolute",
        top: top_position,
        left: context_menu_fixed_styling.padding,

        /* SIZE ------------------ */
        height: get_context_item_height(unique_tag),
        width: `calc(100% - ${context_menu_fixed_styling.padding * 2}px)`,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {ContextItemComponent ? (
        <ContextItemComponent
          progress_context_menu_item={progress_context_menu_item}
        />
      ) : null}
    </div>
  );
};
/* { Context Menu Prestyled Component } ======================================================================================================== */
const ContextList = ({
  position_x,
  position_y,
  position_z,
  direction,
  sub_items,
}) => {
  const {
    contextStructure,
    calculate_context_list_height,
    calculate_context_list_width,
    calculate_item_top_position,
  } = useContext(ContextMenuContexts);

  const [listPosition, setListPosition] = useState([-999, -999]);
  const [borderRadius, setBorderRadius] = useState(
    `0px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px`
  );
  const [height, setHeight] = useState(context_menu_fixed_styling.minHeight);
  const [width, setWidth] = useState(calculate_context_list_width(sub_items));
  useEffect(() => {
    setTimeout(() => {
      setHeight(calculate_context_list_height(sub_items));
      setWidth(calculate_context_list_width(sub_items));
    }, 20);
    if (direction === 3) {
      setListPosition([position_x, position_y]);
      setBorderRadius(
        `0px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px`
      );
    } else if (direction === 2) {
      setListPosition([position_x - width, position_y]);
      setBorderRadius(
        `${context_menu_fixed_styling.borderRadius}px 0px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px`
      );
    } else if (direction === 1) {
      setListPosition([
        position_x,
        position_y - calculate_context_list_height(sub_items),
      ]);
      setBorderRadius(
        `${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px 0px`
      );
    } else {
      setListPosition([
        position_x - width,
        position_y - calculate_context_list_height(sub_items),
      ]);
      setBorderRadius(
        `${context_menu_fixed_styling.borderRadius}px ${context_menu_fixed_styling.borderRadius}px 0px ${context_menu_fixed_styling.borderRadius}px`
      );
    }
  }, [position_x, position_y, position_z, direction, sub_items]);

  return (
    <div
      className={"context_menu_list_container"}
      style={{
        /*ANIMATION ---------------- */
        transition: "height 0.33s cubic-bezier(0.72, -0.16, 0.2, 1.16)",

        /*POSITION ---------------- */
        position: "fixed",
        top: `${listPosition[1]}px`,
        left: `${listPosition[0]}px`,
        zIndex: position_z,

        /*SIZE -------------------- */
        height: height,
        width: width,

        /*STYLE ------------------- */
        border: `${context_menu_fixed_styling.border}px solid rgba(${Math.min(
          context_menu_fixed_styling.backgroundColorR + 64,
          255
        )}, ${Math.min(
          context_menu_fixed_styling.backgroundColorG + 64,
          255
        )}, ${Math.min(
          context_menu_fixed_styling.backgroundColorB + 64,
          255
        )}, 1)`,
        backgroundColor: `rgba(${context_menu_fixed_styling.backgroundColorR}, ${context_menu_fixed_styling.backgroundColorG}, ${context_menu_fixed_styling.backgroundColorB}, 1)`,
        borderRadius: borderRadius,
        boxShadow: context_menu_fixed_styling.boxShadow,
        overflow: "hidden",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {sub_items.map((item, index) => {
        switch (contextStructure[item].type) {
          case "button":
            return (
              <ContextItemButton
                key={item}
                index={index === sub_items.length - 1 ? -1 : index}
                unique_tag={item}
                width={width}
                top_position={calculate_item_top_position(index, sub_items)}
                position_x={listPosition[0] + width}
                position_y={
                  listPosition[1] +
                  calculate_item_top_position(index, sub_items)
                }
                position_z={position_z}
                list_direction={direction}
              />
            );
          case "br":
            return (
              <ContextItemBr
                key={index}
                index={index}
                unique_tag={item}
                top_position={calculate_item_top_position(index, sub_items)}
              />
            );
          case "component":
            return (
              <ContextItemCustomizeComponent
                key={item}
                index={index}
                unique_tag={item}
                top_position={calculate_item_top_position(index, sub_items)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const ContextMenu = () => {
  const {
    cmd,
    push_command_by_tag,
    pop_command_by_tag,
    contextMenuPositionX,
    contextMenuPositionY,
    sourceStackComponentTag,
    contextStructure,
    unload_context_menu,
  } = useContext(RootCommandContexts);

  const get_context_item_height = (unique_tag) => {
    switch (contextStructure[unique_tag].type) {
      case "button":
        if (contextStructure[unique_tag].height) {
          return contextStructure[unique_tag].height;
        } else {
          return button_fixed_styling.height;
        }
      case "br":
        if (contextStructure[unique_tag].height) {
          return contextStructure[unique_tag].height;
        } else {
          return br_fixed_styling.height;
        }
      case "component":
        if (contextStructure[unique_tag].height) {
          return contextStructure[unique_tag].height;
        } else {
          return customize_component_fixed_styling.height;
        }
      default:
        if (contextStructure[unique_tag].height) {
          return contextStructure[unique_tag].height;
        } else {
          return 0;
        }
    }
  };
  const get_context_item_width = (unique_tag) => {
    return (
      contextStructure[unique_tag].width || context_menu_fixed_styling.minWidth
    );
  };
  const calculate_context_list_height = (sub_items) => {
    let height = context_menu_fixed_styling.padding * 2 + 2;
    for (let i = 0; i < sub_items.length; i++) {
      height += get_context_item_height(sub_items[i]);
    }
    return height;
  };
  const calculate_context_list_width = (sub_items) => {
    let width = context_menu_fixed_styling.minWidth;
    for (let i = 0; i < sub_items.length; i++) {
      width = Math.max(width, get_context_item_width(sub_items[i]));
    }
    return width;
  };
  const calculate_item_top_position = (index, sub_items) => {
    let top_position = context_menu_fixed_styling.padding + 1;
    for (let i = 0; i < index; i++) {
      top_position += get_context_item_height(sub_items[i]);
    }
    return top_position;
  };
  const get_context_menu_show_up_direction = (
    positions,
    sub_items,
    filters
  ) => {
    let avaliable_positions = [...filters];
    /* 
      positions -> array of position values [x, y]
      filters -> array of avaliable directions [top_left, top_right, bottom_left, bottom_right] represented by trues and falses

      return -> [position, direction] direction will be a index of filters, if top_left is avaliable, return 0
    */
    const context_liet_width = calculate_context_list_width(sub_items);

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (
        position[1] + calculate_context_list_height(sub_items) >
        window.innerHeight
      ) {
        avaliable_positions[i][2] = false;
        avaliable_positions[i][3] = false;
      }
      if (position[0] + context_liet_width > window.innerWidth) {
        avaliable_positions[i][1] = false;
        avaliable_positions[i][3] = false;
      }
      avaliable_positions[i][0] = true && avaliable_positions[i][0];
    }

    for (let i = 0; i < avaliable_positions.length; i++) {
      for (let p = avaliable_positions[i].length - 1; p >= 0; p--) {
        if (avaliable_positions[i][p]) {
          return [positions[i], p];
        }
      }
    }
    return [[-999, -999], 0];
  };

  const [subListPostion, setSubListPosition] = useState(
    get_context_menu_show_up_direction(
      [[contextMenuPositionX, contextMenuPositionY]],
      contextStructure.root.sub_items,
      [[true, true, true, true]]
    )
  );
  useEffect(() => {
    setSubListPosition(
      get_context_menu_show_up_direction(
        [[contextMenuPositionX, contextMenuPositionY]],
        contextStructure.root.sub_items,
        [[true, true, true, true]]
      )
    );
  }, [contextMenuPositionX, contextMenuPositionY]);

  const progress_context_menu_item = (unique_tag, content) => {
    /* 
      unique_tag -> unique tag of the command
      content -> customized josn format variable that contains content of the command
    */
    push_command_by_tag(sourceStackComponentTag, {
      source: "context_menu",
      target: sourceStackComponentTag,
      content: {
        command_title: unique_tag,
        command_content: content,
      },
    });
    unload_context_menu();
  };
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ContextMenuContexts.Provider
        value={{
          contextStructure,
          get_context_item_height,
          calculate_context_list_height,
          calculate_context_list_width,
          calculate_item_top_position,
          progress_context_menu_item,
          get_context_menu_show_up_direction,
        }}
      >
        <ContextList
          position_x={subListPostion[0][0]}
          position_y={subListPostion[0][1]}
          position_z={12}
          direction={subListPostion[1]}
          sub_items={contextStructure.root.sub_items}
        />
      </ContextMenuContexts.Provider>
    </div>
  );
};

export default ContextMenu;
