/* { Fixed Context Menu Styling } --------------------------------------------------------------------------------------------------------- */
const contextMenu_borderRadius = 12;
const contextMenu_boxShadow = "0 2px 12px rgba(0, 0, 0, 0.2)";
const contextMenu_backgroundColorR = 32;
const contextMenu_backgroundColorG = 32;
const contextMenu_backgroundColorB = 32;
const backdropFilter = "blur(32px)";
const contextMenu_border = 1;
const contextMenu_padding = 5;
const contextMenu_minWidth = 220;
const contextMenu_minHeight = 16;

const context_menu_fixed_styling = {
  borderRadius: contextMenu_borderRadius,
  boxShadow: contextMenu_boxShadow,
  backgroundColorR: contextMenu_backgroundColorR,
  backgroundColorG: contextMenu_backgroundColorG,
  backgroundColorB: contextMenu_backgroundColorB,
  backdropFilter: backdropFilter,
  border: contextMenu_border,
  padding: contextMenu_padding,
  minWidth: contextMenu_minWidth,
  minHeight: contextMenu_minHeight,
};
/* { Fixed Context Menu Styling } --------------------------------------------------------------------------------------------------------- */

/* { Fixed Context Item Styling } --------------------------------------------------------------------------------------------------------- */

/* { Button } */
const button_height = 22;
const button_outter_borderRadius = 7;
const button_inner_borderRadius = 4;
const button_fontSize = 12;
const button_fixed_styling = {
  height: button_height,
  outterBorderRadius: button_outter_borderRadius,
  innerBorderRadius: button_inner_borderRadius,
  fontSize: button_fontSize,
};

/* { Br } */
const br_height = 8;
const br_fixed_styling = {
  height: br_height,
  padding: 5,
};

/* { Customized Component } */
const customized_component_height = 28;
const customize_component_fixed_styling = {
  height: customized_component_height,
};
/* { Fixed Context Item Styling } --------------------------------------------------------------------------------------------------------- */

export {
  context_menu_fixed_styling,
  button_fixed_styling,
  br_fixed_styling,
  customize_component_fixed_styling,
};
