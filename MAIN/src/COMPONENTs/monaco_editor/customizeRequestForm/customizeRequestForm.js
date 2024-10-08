import React, { useState, useRef, useEffect, useContext } from "react";
import { ICON_MANAGER } from "../../../ICONs/icon_manager";
import { ContextMenuContexts } from "../../../BUILTIN_COMPONENTs/context_menu/context_menu_contexts";
import "./customizeRequestForm.css";
import { CUSTOMIZE_REQUEST_FORM_HEIGHT } from "../../../CONSTs/contextMenuConfig";

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

const CustomizeRequestForm = () => {
  const { progress_context_menu_item } = useContext(ContextMenuContexts);
  const [requestURL, setRequestURL] = useState("");
  const [requestMethod, setRequestMethod] = useState("POST");
  const [inputFormat, setInputFormat] = useState("onSelect");
  const [outputFormat, setOutputFormat] = useState("console");

  const onFormSubmit = (e) => {
    progress_context_menu_item("customizeRequest", {
      requestURL: requestURL,
      requestMethod: requestMethod,
      inputFormat: inputFormat,
      outputFormat: outputFormat,
    });
  };

  return (
    <div
      className="customizeRequestForm_component_container1120"
      style={{ height: CUSTOMIZE_REQUEST_FORM_HEIGHT }}
    >
      <img
        className="customizeRequestForm_component_title_icon0129"
        src={SYSTEM_ICON_MANAGER.customize.ICON512}
      />
      <span className="customizeRequestForm_component_title1120">
        Customize Request
      </span>
      <div>
        <div className="customizeRequestForm_component_subcontainer1120">
          <label>Request URL</label>
          <input
            className="customizeRequestForm_component_input1120"
            type="text"
            value={requestURL}
            onChange={(e) => setRequestURL(e.target.value)}
          />
        </div>
        <div className="customizeRequestForm_component_subcontainer1120">
          <label>Request Method</label>
          <select
            className="customizeRequestForm_component_select1120"
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div className="customizeRequestForm_component_subcontainer1120">
          <label>Input Format</label>
          <select
            className="customizeRequestForm_component_select1120"
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
          >
            <option value="onSelect">On Select</option>
            <option value="entireFile">Entire File</option>
          </select>
        </div>
        <div className="customizeRequestForm_component_subcontainer1120">
          <label>Output Format</label>
          <select
            className="customizeRequestForm_component_select1120"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="console">Console</option>
            <option value="apendToEnd">Apend To End</option>
            <option value="replace">Replace Current</option>
          </select>
        </div>
      </div>
      <button
        className="customizeRequestForm_component_button1120"
        onClick={(e) => {
          onFormSubmit(e);
        }}
      >
        Send Request
      </button>
    </div>
  );
};

export default CustomizeRequestForm;
