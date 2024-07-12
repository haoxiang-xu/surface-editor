import { createContext } from "react";

/* Parameters --------------------------------------------------------------
    isRightClicked,
    setIsRightClicked,
    rightClickX,
    rightClickY,
    onRightClickItem,
    setOnRightClickItem,
    rightClickCommand,
    setRightClickCommand,
*/
/* onRightClickItem Structure ----------------------------------------------
{
    source: String
    condition: { paste: Boolean/String },
    content: { customizeRequest: Object } / File_Object,
    target: String
}
*/
/* RightClickCommand Structure ----------------------------------------------
{
    command: String,
    content: { customizeRequest: Object } / File_Object,
    target: String
}
*/
export const rightClickContextMenuCommandContexts = createContext("");
/* Parameters --------------------------------------------------------------
    progressRightClickCommand,
    onHoverContextItemIndex,
    setOnHoverContextItemIndex,
*/
export const rightClickContextMenuInsideContexts = createContext("");
