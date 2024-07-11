/* { Fixed Context Menu Styling } --------------------------------------------------------------------------------------------------------- */
const contextMenu_borderRadius = 11;
const contextMenu_boxShadow = "0px 2px 32px 12px rgba(0, 0, 0, 0.32)";
const contextMenu_backgroundColor = "#202020";
const contextMenu_border = 1;
const contextMenu_padding = 7;
const contextMenu_width = 256;
const contextMenu_minHeight = 16;

const context_menu_fixed_styling = {
  borderRadius: contextMenu_borderRadius,
  boxShadow: contextMenu_boxShadow,
  backgroundColor: contextMenu_backgroundColor,
  border: contextMenu_border,
  padding: contextMenu_padding,
  width: contextMenu_width,
  minHeight: contextMenu_minHeight,
};
/* { Fixed Context Menu Styling } --------------------------------------------------------------------------------------------------------- */

/* { Fixed Context Item Styling } --------------------------------------------------------------------------------------------------------- */

/* { Button } */
const button_height = 28;
const button_borderRadius = 4;
const button_fixed_styling = {
  height: button_height,
  borderRadius: button_borderRadius,
};

/* { Br } */
const br_height = 8;
const br_fixed_styling = {
  height: br_height,
  padding: 5,
};
/* { Fixed Context Item Styling } --------------------------------------------------------------------------------------------------------- */

export { context_menu_fixed_styling, button_fixed_styling, br_fixed_styling };
