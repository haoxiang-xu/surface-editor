import React, { useState, useEffect, useRef, useContext } from "react";
import { ICON_MANAGER } from "../../ICONs/icon_manager.js";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts.js";
import { explorerContexts } from "../../CONTEXTs/explorerContexts.js";
import DirItem from "./dirItem/dirItem.js";
import PulseLoader from "react-spinners/PulseLoader";
import BarLoader from "react-spinners/BarLoader";
import "./explorer.css";

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

const SearchBar = ({}) => {
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
  return (
    <div
      className={"dir_list_component_search_bar_container0125"}
      draggable={false}
    >
      <input className={"dir_list_component_search_bar_input0125"} />
      <img
        src={SYSTEM_ICON_MANAGER.search.ICON512}
        className={"dir_list_component_search_bar_icon0125"}
        draggable={false}
        alt="search"
      />
    </div>
  );
};
const DirList = ({}) => {
  const { dir, isDirLoaded, setIsDirLoaded } = useContext(RootDataContexts);
  const [ExplorerOnMouseOver, setExplorerOnMouseOver] = useState(false);
  const [dirPathOnHover, setDirPathOnHover] = useState(null);
  const [onSingleClickFile, setOnSingleClickFile] = useState(null);
  const [onCopyFile, setOnCopyFile] = useState(null);
  const [onDragFiles, setOnDragFiles] = useState(null);

  useEffect(() => {
    if (!ExplorerOnMouseOver) {
      setDirPathOnHover(null);
    }
  }, [ExplorerOnMouseOver]);
  useEffect(() => {
    const updateLoadingStatus = ({ isDirLoading }) => {
      setIsDirLoaded(!isDirLoading);
    };
    window.electronAPI.subscribeToReadDirStateChange(updateLoadingStatus);
  }, []);

  return (
    <div
      id={"dir_list_component_container0725"}
      style={{
        overflowY: "scroll",
        display: isDirLoaded ? "block" : "none",
      }}
      onMouseEnter={() => {
        setExplorerOnMouseOver(true);
      }}
      onMouseLeave={() => {
        setExplorerOnMouseOver(false);
      }}
    >
      <explorerContexts.Provider
        value={{
          dirPathOnHover,
          setDirPathOnHover,
          onSingleClickFile,
          setOnSingleClickFile,
          onCopyFile,
          setOnCopyFile,
          onDragFiles,
          setOnDragFiles,
        }}
      >
        <DirItem filePath={dir.filePath} root={true} />
      </explorerContexts.Provider>
    </div>
  );
};
const Explorer = ({ mode }) => {
  const { isDirLoaded } = useContext(RootDataContexts);
  return (
    <>
      {mode === "horizontal_stack_vertical_mode" ? null : (
        <div>
          <DirList />
          <SearchBar />
        </div>
      )}
      {isDirLoaded ? null : (
        <div className="dir_list_component_loading_container0404">
          <BarLoader
            size={8}
            color={"#C8C8C864"}
            height={5}
            width={32}
            speed={1}
          />
        </div>
      )}
    </>
  );
};

export default Explorer;
