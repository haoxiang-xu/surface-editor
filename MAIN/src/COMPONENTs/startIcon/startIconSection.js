import React, { useState, useEffect, useRef } from "react";

import "./startIconSection.css";

const StartIcon = ({
  startOnClick,
  setStartOnClick,
  explorerTop,
  getFilesFromDatabase,
  setOnRightClickItem
}) => {
  const title_list = [
    "VECODER",
    "ENTER_PROJECT_NAME",
    "UNTITLE_PROJECT",
    "HELLO_WORLD",
    "VECTOR",
    "CODE",
  ];

  const [logo_text, setLogoText] = useState("</>");
  const [logo_title, setLogoTitle] = useState(title_list[0]);
  const logoTitleRef = useRef(logo_title);
  const [intervalId, setIntervalId] = useState(null);
  const [logo_subtitle, setLogoSubtitle] = useState("POWERED BY GPT");
  const logoRef = useRef(null);

  const [inputContainerId, setInputContainerId] = useState(
    "web_logo_section_component_logo_title_container0725"
  );
  const [subtitleId, setSubtitleId] = useState(
    "web_logo_section_component_logo_subtitle0725"
  );
  const [shadowAffectId, setShadowAffectId] = useState(
    "web_logo_section_component_shadow_affect0725"
  );
  const [logoIconId, setLogoIconId] = useState(
    "web_logo_section_component_logo_icon0725"
  );

  useEffect(() => {
    if (title_list.includes(logo_title.trim())) {
      logoTitleRef.current = logo_title;
      const interval = setInterval(titleSwitch, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [logo_title]);

  const titleSwitch = () => {
    if (title_list.includes(logo_title.trim())) {
      let currentIndex = title_list.indexOf(logo_title.trim());
      let nextIndex = 0;
      if (currentIndex === title_list.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = currentIndex + 1;
      }
      textSwitch(title_list[currentIndex], title_list[nextIndex]);
    }
  };
  const textSwitch = (switchFromText, switchToText) => {
    setLogoTitle(switchFromText);

    let character = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
    ];
    let currentText = "";

    //Makes the switchToText the same length as switchFromText
    if (switchFromText.length > switchToText.length) {
      let difference = switchFromText.length - switchToText.length;
      for (let i = 0; i < difference; i++) {
        switchToText += " ";
      }
    } else if (switchFromText.length < switchToText.length) {
      let difference = switchToText.length - switchFromText.length;
      for (let i = 0; i < difference; i++) {
        switchFromText += "_";
      }
    }
    currentText = switchFromText;

    let clockTime = 6;
    for (let c = 0; c <= switchToText.length; c++) {
      let c_from_index = character.indexOf(switchFromText[c]);
      let c_to_index = character.indexOf(switchToText[c]);

      let difference = 0;

      if (c_from_index < c_to_index) {
        difference = c_to_index - c_from_index;
        for (let d = 0; d <= difference; d++) {
          (function (currentText) {
            currentText = replaceCharAtIndex(
              currentText,
              c,
              character[c_from_index + d]
            );
            setTimeout(() => {
              setLogoTitle(currentText);
            }, clockTime);
          })(currentText);
          clockTime += 6;
        }
      } else {
        difference = c_from_index - c_to_index;
        for (let d = 0; d <= difference; d++) {
          (function (currentText) {
            currentText = replaceCharAtIndex(
              currentText,
              c,
              character[c_from_index + d]
            );
            setTimeout(() => {
              setLogoTitle(currentText);
            }, clockTime);
          })(currentText); // Pass the currentText to the IIFE
          clockTime += 5;
        }
      }
      currentText = replaceCharAtIndex(currentText, c, switchToText[c]).trim();
    }
  };
  const replaceCharAtIndex = (originalString, index, newChar) => {
    if (index < 0 || index >= originalString.length) {
      return originalString;
    }

    const stringArray = originalString.split("");
    stringArray[index] = newChar;
    const newString = stringArray.join("");

    return newString;
  };
  const inputWidth = {
    minWidth: "0px",
    width: `${logo_title.trim().length + 2}ch`,
    transition: "width 0.2s",
    textAlign: "center",
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setLogoTitle("");
      setInputContainerId(
        "web_logo_section_component_logo_title_container_hided0725"
      );
      setSubtitleId("web_logo_section_component_logo_subtitle_hided0725");
      setShadowAffectId("web_logo_section_component_shadow_affect_hided0725");
      setLogoIconId("web_logo_section_component_logo_icon_centered0725");
      getFilesFromDatabase();
      setStartOnClick(true);
    }
  };

  return (
    <div
      id="web_logo_section_component_container0725"
      ref={logoRef}
      style={
        startOnClick && explorerTop !== -1
          ? {
              transition: "all 0.32s ease",
              top: explorerTop + "px",
              transform: explorerTop === 0 ? "translate(-50%, 0%)" : "translate(-50%, -25%)",
            }
          : {
              transition: "all 0.32s",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }
      }
    >
      <link
        href="https://fonts.googleapis.com/css?family=Koulen"
        rel="stylesheet"
      ></link>
      <span id={subtitleId}>{logo_subtitle}</span>
      <div id={shadowAffectId}></div>
      <input
        id={inputContainerId}
        style={inputWidth}
        value={logo_title}
        onChange={(e) => setLogoTitle(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div id={logoIconId}>{logo_text}</div>
    </div>
  );
};

export default StartIcon;
