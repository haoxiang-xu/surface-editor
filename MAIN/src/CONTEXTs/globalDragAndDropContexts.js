import { createContext } from "react";

/* Parameters --------------------------------------------------------------
    draggedItem,
    setDraggedItem,
    draggedOverItem,
    setDraggedOverItem,
    dragCommand,
    setDragCommand,
*/
/* DraggedItem ---------------------------------------------------
    {
        source: String,
        content: File_Path,
    }
*/
/* DragCommand -------------------------------------------------------------
    "APPEND TO TARGET"
    "WAITING FOR MODEL APPEND"
    "DELETE FROM SOURCE"
    "WAITING FOR MODEL APPEND THEN DELETE FROM SOURCE"
*/
export const globalDragAndDropContexts = createContext("");
