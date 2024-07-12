/* Context Menu Dimensions --------------------------------------------- */
const CONTEXTMENU_WIDTH = 238;
const CONTEXTITEM_BORDER = 10; //Define the border height of each context item to calculate the context menu height
const CONTEXTITEM_HEIGHT = 26;

const SUBCONTEXTMENU_WIDTH = 238;

const CUSTOMIZE_REQUEST_FORM_WIDTH = 275;
const CUSTOMIZE_REQUEST_FORM_HEIGHT = 260;
/* Context Menu Dimensions --------------------------------------------- */

/* Root Context Menu Item Config ===================================================================== */
const COMPONENT_ITEM_FUNCTION_CONFIG = {
  vecoder_editor: [
    "continue",
    "fix",
    "hr",
    "customizeInstruction",
    "customizeAPI",
    "AST",
    "hr",
    "moreOptions",
    "copy",
    "paste_or_unpaste",
  ],
  vecoder_explorer_root_folder: [
    "newFile",
    "newFolder",
    "insertFile",
    "hr",
    "paste_or_unpaste",
    "hr",
    "openFolder",
    "openFile",
  ],
  vecoder_explorer_folder: [
    "newFile",
    "newFolder",
    "insertFile",
    "hr",
    "copy",
    "paste_or_unpaste",
    "hr",
    "rename",
    "delete",
  ],
  vecoder_explorer_file: ["copy", "hr", "rename", "delete"],
};
/* Root Context Menu Item Config ===================================================================== */

export {
  CONTEXTMENU_WIDTH,
  CONTEXTITEM_BORDER,
  CONTEXTITEM_HEIGHT,
  SUBCONTEXTMENU_WIDTH,
  CUSTOMIZE_REQUEST_FORM_WIDTH,
  CUSTOMIZE_REQUEST_FORM_HEIGHT,
  COMPONENT_ITEM_FUNCTION_CONFIG,
};
