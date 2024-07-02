import React, { useState, useEffect, useRef, useContext } from "react";
import { vecoderEditorContexts } from "../../CONTEXTs/vecoderEditorContexts";
import StackStructure from "../../COMPONENTs/stack_structure/stack_structure";

const DEFAULT_MONACO_EDITORS_OPTIONS_DATA = {
  "demo/src/code_editor.js": {
    viewState: null,
    model: null,
  },
  "demo/index/style/code_editor.css": {
    viewState: null,
    model: null,
  },
  "demo/main.py": {
    viewState: null,
    model: null,
  },
  "demo/index/index.html": {
    viewState: null,
    model: null,
  },
  "demo/main.java": {
    viewState: null,
    model: null,
  },
};
const DEFAULT_VECODER_EDITORS_OPTIONS_DATA = {
  1: {
    code_editor_container_ref_index: 1,
    onSelectedMonacoIndex: -1,
    monacoEditorPaths: [
      "demo/src/code_editor.js",
      "demo/index/style/code_editor.css",
      "demo/main.py",
    ],
  },
  2: {
    code_editor_container_ref_index: 2,
    onSelectedMonacoIndex: -1,
    monacoEditorPaths: ["demo/index/index.html", "demo/main.java"],
  },
};
const DEFAULT_VECODER_EDITORS_CONTENT_DATA = {
  "demo/src/code_editor.js": {
    fileName: "code_editor.js",
    fileLanguage: "javascript",
    filePath: "demo/src/code_editor.js",
    fileContent: `import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

import "./codeEditor.css";

import road_map_icon from "./ICONs/road-map.png";
import line_numbers_icon from "./ICONs/number-sign.png";
import close_file_icon from "./ICONs/delete.png";
import close_icon from "./ICONs/close.png";
import minus_icon from "./ICONs/minus.png";
import more_icon from "./ICONs/more.png";

const CodeEditor = ({ files }) => {
  const [refresh, setRefresh] = useState(false);
  const [fileList, setFileList] = useState(files);
  const [roadMapVisible, setRoadMapVisible] = useState(false);
  const [lineNumbersVisible, setLineNumbersVisible] = useState("off");
  const [verticalScrollbarVisible, setVerticalScrollbarVisible] = useState(false);
  const [horizontalScrollbarVisible, setHorizontalScrollbarVisible] = useState(false);
  const filesContainerRef = useRef(null);
  const [filesContainerWidth, setFilesContainerWidth] = useState(0);
  const [fileAverageContainerWidth, setFileAverageContainerWidth] = useState(0);
      
  const [onSelectedIndex, setOnSelectedIndex] = useState(0);
      
  const handleRoadMapIconClick = () => {
    setRoadMapVisible(!roadMapVisible);
  };
  const handleLineNumbersIconClick = () => {
    if (lineNumbersVisible === "on") {
      setLineNumbersVisible("off");
    } else {
      setLineNumbersVisible("on");
    }
  };
  const handleMouseMove = (e) => {
    const vertical_threshold = 112;
    const horizontal_threshold = 256;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
          
    const nearRightEdge = left + width - clientX < vertical_threshold;
    const nearBottomEdge = top + height - clientY < horizontal_threshold;
        
    if (nearRightEdge) {
      setVerticalScrollbarVisible(true);
    } else {
      setVerticalScrollbarVisible(false);
    }
    if (nearBottomEdge) {
      setHorizontalScrollbarVisible(true);
    } else {
      setHorizontalScrollbarVisible(false);
    }
  };
  const handleFileCloseIconClick = (index) => () => {
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };
      
  useEffect(() => {
    function handleResize() {
      if (filesContainerRef.current) {
        setFilesContainerWidth(
          filesContainerRef.current.getBoundingClientRect().width
        );
      }
    }
      
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setFileAverageContainerWidth(
    Math.max(filesContainerWidth / (fileList.length + 2) - 4.5, 21) + "pt"
    );
  }, [filesContainerWidth]);

  useEffect(() => {
    setFileAverageContainerWidth(
      Math.max(filesContainerWidth / (fileList.length + 2) - 4.5, 21) + "pt"
    );
    setRefresh(!refresh);
  }, [fileList]);

  useEffect(() => {
    setFileList(files);
  }, [files]);

  return (
    <div
    id="code_editor_container0829"
    onMouseMove={handleMouseMove}
    onMouseLeave={() => {
      setVerticalScrollbarVisible(false);
      setHorizontalScrollbarVisible(false);
    }}
    >
    <div id="code_editor_files_container0829" ref={filesContainerRef}>
    {fileList.map((file, index) => (
      <div
        key={index}
        id={index === onSelectedIndex? "code_editor_file_container_on_selected0830" : "code_editor_file_container0829"}
        draggable={true}
        style={{ width: fileAverageContainerWidth }}
        onClick={() => {
          setOnSelectedIndex(index);
        }}
      >
        <div id="code_editor_fileName_container0829">{file.fileName}</div>
          <img
            src={close_file_icon}
            id="code_editor_close_icon0829"
            alt="close"
            onClick={handleFileCloseIconClick(index)}
          />
        </div>
      ))}
    </div>

    <img
      src={road_map_icon}
      id="code_editor_road_map_icon0829"
      onClick={handleRoadMapIconClick}
    />
    <img
      src={line_numbers_icon}
      id="code_editor_line_numbers_icon0829"
      onClick={handleLineNumbersIconClick}
    />
    <img src={minus_icon} id="code_editor_minus_icon0830" />
    <img src={close_icon} id="code_editor_close_window_icon0830" />
    <img src={more_icon} id="code_editor_more_icon0830" />

    <MonacoEditor
      top="0px"
      left="0px"
      position="absolute"
      width="100%"
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={fileList[onSelectedIndex]? fileList[onSelectedIndex].content : ""}
      automaticLayout={true}
      options={{
        minimap: {
          enabled: roadMapVisible,
        },
        fontSize: 14,
        fontFamily: "Consolas",
        lineNumbers: lineNumbersVisible,
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4,
        },
        readOnly: false,
        overflow: "hidden",
      }}
    />
    </div>
  );
};

export default CodeEditor;

`,
  },
  "demo/index/style/code_editor.css": {
    fileName: "code_editor.css",
    fileLanguage: "css",
    filePath: "demo/index/style/code_editor.css",
    fileContent: `#code_editor_container0829 {
  /*POSITION*/
  width: 500pt;
  height: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  /*STYLE*/
  border-radius: 12pt;
  padding: 32pt 18pt 8pt 1pt;
  box-shadow: 0px 4px 16px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  background-color: #1e1e1e;
  user-select: none;
}
#code_editor_files_container0829 {
  display: flex;
  white-space: nowrap;

  /*POSITION*/
  position: absolute;
  top: 3pt;
  left: 34pt;
  right: 96pt;
  padding: 0pt;

  /*SIZE*/
  height: 25pt;

  /*STYLE*/

  box-sizing: border-box;

  overflow-x: auto;
  overflow-y: hidden;
}
#code_editor_files_container0829::-webkit-scrollbar {
  height: 2pt;
}
#code_editor_files_container0829::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4pt;
}
#code_editor_files_container0829::-webkit-scrollbar-thumb {
  background: #2f3133;
  border-radius: 4pt;
}
#code_editor_files_container0829::-webkit-scrollbar-thumb:hover {
  background: #494d53;
  box-shadow: 0px 2px 16px 2px rgba(0, 0, 0, 0.16);
  border-radius: 4pt;
}

`,
  },
  "demo/main.py": {
    fileName: "main.py",
    fileLanguage: "python",
    filePath: "demo/main.py",
    fileContent: `import random

def get_compliment(color):
  """Return a compliment based on the color."""
  compliments = {
    "red": ["You have fiery taste!", "A passionate choice!"],
    "blue": ["You're cooler than a blue moon!", "Such a calming choice!"],
    "green": ["You must love nature!", "A very earthy choice!"],
    "yellow": ["Sunshine suits you!", "A bright and cheerful choice!"],
    "purple": ["A royal choice indeed!", "Mysterious and deep!"],
  } 
  # Get a random compliment for the given color, or a default one.
  return random.choice(compliments.get(color, ["That's a unique choice!"]))
    
def main():
  print("Hello! Let's talk about colors!")
        
  # Infinite loop until the user wants to exit.
  while True:
    color = input("What's your favorite color? (type 'exit' to quit) ").lower()
            
  if color == "exit":
    print("Goodbye!")
    break
            
  print(get_compliment(color))
  
if __name__ == "__main__":
  main()
`,
  },
  "demo/index/index.html": {
    fileName: "index.html",
    fileLanguage: "html",
    filePath: "demo/index/index.html",
    fileContent: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>File Content Editor</title>
<style>
.file-editor {
  margin-bottom: 10px;
}
</style>
</head>
<body>
<div id="fileEditors"></div>
<ul id="fileContents"></ul>
  
<script>
// Sample files array
let files = [
  { fileName: "file1.txt", fileContent: "Content of file 1" },
  { fileName: "file2.txt", fileContent: "Content of file 2" }
];
  
const setContent = (index) => (value) => {
  files[index].fileContent = value;
  renderFileContents();
};
  
const renderEditors = () => {
  const editorsContainer = document.getElementById('fileEditors');
  editorsContainer.innerHTML = ''; // Clear existing content
  
  files.forEach((file, index) => {
    const textarea = document.createElement('textarea');
    textarea.className = 'file-editor';
    textarea.value = file.fileContent;
    textarea.oninput = (e) => setContent(index)(e.target.value);
    editorsContainer.appendChild(textarea);
  });
};
  
const renderFileContents = () => {
  const contentsContainer = document.getElementById('fileContents');
  contentsContainer.innerHTML = ''; // Clear existing content
  
  files.forEach((file) => {
    const listItem = document.createElement('li');
    listItem.textContent = file.fileContent;
    contentsContainer.appendChild(listItem);
  });
};
  
// Initial rendering
renderEditors();
renderFileContents();
</script>
</body>
</html>
  
  `,
  },
  "demo/main.java": {
    fileName: "main.java",
    fileLanguage: "java",
    filePath: "demo/main.java",
    fileContent: `public class Main {
  public static void main(String[] args) {
    // Create some car objects
    Car myCar = new Car("Toyota", "Corolla", 2020);
    Car anotherCar = new Car("Honda", "Civic", 2019);

    // Display car details
    System.out.println(myCar.getDescription());
    System.out.println(anotherCar.getDescription());
  }
}
class Car {
  private String make;
  private String model;
  private int year;

  // Constructor
  public Car(String make, String model, int year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  // Method to get car's description
  public String getDescription() {
    return year + " " + make + " " + model;
  }
}
  `,
  },
};
const DEFAULT_STACK_STRUCTURE_OPTIONS_DATA = [
  {
    type: "EXPLORER",
    explorer_container_ref_index: 0,
  },
  {
    type: "CODE_EDITOR",
    code_editor_container_ref_index: 1,
  },
  {
    type: "CODE_EDITOR",
    code_editor_container_ref_index: 2,
  },
];
const DEFAULT_EXPLORE_OPTIONS_AND_CONTENT_DATA = {
  fileName: "demo",
  fileType: "folder",
  filePath: "demo",
  fileExpend: false,
  files: [
    {
      fileName: "index",
      fileType: "folder",
      filePath: "demo/index",
      fileExpend: false,
      files: [
        {
          fileName: "style",
          fileType: "folder",
          filePath: "demo/index/style",
          fileExpend: false,
          files: [
            {
              fileName: "code_editor.css",
              fileType: "file",
              filePath: "demo/index/style/code_editor.css",
              fileExpend: false,
              files: [],
            },
          ],
        },
        {
          fileName: "index.html",
          fileType: "file",
          filePath: "demo/index/index.html",
          fileExpend: false,
          files: [],
        },
      ],
    },
    {
      fileName: "src",
      fileType: "folder",
      filePath: "demo/src",
      fileExpend: false,
      files: [
        {
          fileName: "code_editor.js",
          fileType: "file",
          filePath: "demo/src/code_editor.js",
          fileExpend: false,
          files: [],
        },
      ],
    },
    {
      fileName: "main.java",
      fileType: "file",
      filePath: "demo/main.java",
      fileExpend: false,
      files: [],
    },
    {
      fileName: "main.py",
      fileType: "file",
      filePath: "demo/main.py",
      fileExpend: false,
      files: [],
    },
  ],
};
const VecoderEditorPage = () => {
  /* Monaco Editor Options ------------------------------------ */
  const [monacoEditorsOptionsData, setMonacoEditorsOptionsData] = useState(
    DEFAULT_MONACO_EDITORS_OPTIONS_DATA
  );
  const accessMonacoEditorOptionsByPath = (path) => {
    return monacoEditorsOptionsData[path];
  };
  const updateMonacoEditorOptionsByPath = (path, data) => {
    setMonacoEditorsOptionsData((prevData) => {
      return { ...prevData, [path]: data };
    });
  };
  const appendMonacoEditorOptionsByPath = (path, data) => {
    setMonacoEditorsOptionsData((prevData) => {
      return { ...prevData, [path]: data };
    });
  };
  const removeMonacoEditorOptionsByPath = (path) => {
    setMonacoEditorsOptionsData((prevData) => {
      const newData = { ...prevData };
      delete newData[path];
      return newData;
    });
  };
  const updateMonacoEditorViewStatesByPath = (path, newViewState) => {
    setMonacoEditorsOptionsData((prevData) => {
      return {
        ...prevData,
        [path]: { ...prevData[path], viewState: newViewState },
      };
    });
  };
  const updateMonacoEditorModelsByPath = (path, newModel) => {
    setMonacoEditorsOptionsData((prevData) => {
      return {
        ...prevData,
        [path]: { ...prevData[path], model: newModel },
      };
    });
  };
  /* Monaco Editor Options ------------------------------------ */

  /* Vecoder Editor Data and Functions ============================================================== */
  const [vecoderEditorsOptionsData, setVecoderEditorsOptionsData] = useState(
    DEFAULT_VECODER_EDITORS_OPTIONS_DATA
  );
  const updateOnSelectedMonacoIndexByEditorIndex = (
    codeEditorContainerRefIndex,
    onSelectedMonacoIndex
  ) => {
    setVecoderEditorsOptionsData((prevData) => {
      return {
        ...prevData,
        [codeEditorContainerRefIndex]: {
          ...prevData[codeEditorContainerRefIndex],
          onSelectedMonacoIndex,
        },
      };
    });
  };
  const accessOnSelectedMonacoIndexByEditorIndex = (
    codeEditorContainerRefIndex
  ) => {
    return vecoderEditorsOptionsData[codeEditorContainerRefIndex]
      .onSelectedMonacoIndex;
  };
  const updateMonacoEditorPathsByEditorIndex = (
    codeEditorContainerRefIndex,
    monacoEditorPaths
  ) => {
    setVecoderEditorsOptionsData((prevData) => {
      return {
        ...prevData,
        [codeEditorContainerRefIndex]: {
          ...prevData[codeEditorContainerRefIndex],
          monacoEditorPaths,
        },
      };
    });
  };
  const accessMonacoEditorPathsByEditorIndex = (
    codeEditorContainerRefIndex
  ) => {
    return vecoderEditorsOptionsData[codeEditorContainerRefIndex]
      .monacoEditorPaths;
  };
  const accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex = (
    codeEditorContainerRefIndex,
    onSelectedMonacoIndex
  ) => {
    return accessVecoderEditorFileLanguageDataByPath(
      vecoderEditorsOptionsData[codeEditorContainerRefIndex].monacoEditorPaths[
        onSelectedMonacoIndex
      ]
    );
  };
  const accessMonacoEditorFileContentDataByEditorIndexAndOnSelectedIndex = (
    codeEditorContainerRefIndex,
    onSelectedMonacoIndex
  ) => {
    return accessVecoderEditorFileContentDataByPath(
      vecoderEditorsOptionsData[codeEditorContainerRefIndex].monacoEditorPaths[
        onSelectedMonacoIndex
      ]
    );
  };
  const [vecoderEditorContentData, setVecoderEditorContentData] = useState(
    DEFAULT_VECODER_EDITORS_CONTENT_DATA
  );
  useEffect(() => {
    window.electronAPI.onFileContent((content, relativePath) => {
      const newFile = { [relativePath]: content };
      setVecoderEditorContentData((prevData) => {
        return {
          ...prevData,
          ...newFile,
        };
      });
    });
    window.electronAPI.onFileError((error) => {
      console.error("Error:", error);
    });
  }, []);
  const updateVecoderEditorFileContentDataByPath = (path, data) => {
    setVecoderEditorContentData((prevData) => {
      if (prevData.hasOwnProperty(path)) {
        return {
          ...prevData,
          [path]: {
            ...prevData[path],
            fileContent: data,
          },
        };
      } else {
        console.error("File path does not exist:", path);
        return { ...prevData };
      }
    });
  };
  const accessVecoderEditorFileContentDataByPath = (path) => {
    if (path in vecoderEditorContentData) {
      return vecoderEditorContentData[path].fileContent;
    } else {
      //AWAIT ELECTRONJS TO LOAD THAT PATH IN SYSTEM
      window.electronAPI.readFile(accessFileAbsolutePathByPath(path), path);
      return path;
    }
  };
  const accessVecoderEditorFileLanguageDataByPath = (path) => {
    if (path in vecoderEditorContentData) {
      return vecoderEditorContentData[path].fileLanguage;
    } else {
      return "Unknow";
    }
  };
  const accessVecoderEditorFileNameDataByPath = (path) => {
    if (path in vecoderEditorContentData) {
      return vecoderEditorContentData[path].fileName;
    } else {
      return path.split("/")[path.split("/").length - 1];
    }
  };
  /* Vecoder Editor Data and Functions ============================================================== */

  /* Explorer Data and Functions ------------------------------------------ */
  const [exploreOptionsAndContentData, setExploreOptionsAndContentData] =
    useState(DEFAULT_EXPLORE_OPTIONS_AND_CONTENT_DATA);
  const [
    isExploreOptionsAndContentDataLoaded,
    setIsExploreOptionsAndContentDataLoaded,
  ] = useState(true);
  useEffect(() => {
    setIsExploreOptionsAndContentDataLoaded(true);
  }, [exploreOptionsAndContentData.filePath]);
  useEffect(() => {
    window.electron.receive("directory-data", (data) => {
      setExploreOptionsAndContentData(data);
    });
  }, []);
  const updateFileOnExploreOptionsAndContentData = (path, data) => {
    setExploreOptionsAndContentData((prevData) => {
      const updateNestedFiles = (currentData, pathArray, currentIndex) => {
        if (currentIndex === pathArray.length - 1) {
          return data;
        }
        const files = currentData.files ? [...currentData.files] : [];
        const nextIndex = files.findIndex(
          (file) => file.fileName === pathArray[currentIndex + 1]
        );
        if (nextIndex !== -1) {
          files[nextIndex] = updateNestedFiles(
            files[nextIndex],
            pathArray,
            currentIndex + 1
          );
        }
        if (currentIndex === pathArray.length - 2) {
          files.sort((a, b) => {
            if (a.fileType === b.fileType) {
              return a.fileName.localeCompare(b.fileName);
            }
            return a.fileType === "folder" ? -1 : 1;
          });
        }

        return { ...currentData, files };
      };

      const pathArray = path.split("/");
      const updatedData = updateNestedFiles(prevData, pathArray, 0);

      return updatedData;
    });
  };
  const removeFileOnExploreOptionsAndContentData = (path) => {
    setExploreOptionsAndContentData((prevData) => {
      const pathArray = path.split("/");
      const removeItemRecursively = (data, index = 0) => {
        if (index === pathArray.length - 2) {
          const filteredFiles = data.files.filter(
            (item) => item.fileName !== pathArray[pathArray.length - 1]
          );
          return { ...data, files: filteredFiles };
        }
        const nextIndex = data.files.findIndex(
          (item) => item.fileName === pathArray[index]
        );
        if (nextIndex === -1) {
          return data;
        }

        const updatedFiles = [...data.files];
        updatedFiles[nextIndex] = removeItemRecursively(
          updatedFiles[nextIndex],
          index + 1
        );

        return { ...data, files: updatedFiles };
      };

      return removeItemRecursively(prevData);
    });
  };
  const renameAndRepathAllSubFiles = (original_path, new_name) => {
    const renameAllSubFiles = (file, pathIndex, new_name) => {
      for (let i = 0; i < file.files.length; i++) {
        const path = file.files[i].filePath.split("/");
        path[pathIndex] = new_name;
        file.files[i].filePath = path.join("/");

        renameAllSubFiles(file.files[i], pathIndex, new_name);
      }
    };
    let target_file = accessFileByPath(original_path);

    target_file.fileName = new_name;
    let Path = target_file.filePath.split("/");
    Path[Path.length - 1] = new_name;
    target_file.filePath = Path.join("/");

    renameAllSubFiles(target_file, Path.length - 1, new_name);

    updateFileOnExploreOptionsAndContentData(original_path, target_file);
  };
  const checkDirNameExist = (path, pending_file_name) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pending_file_name) {
            return true;
          }
        }
        return false;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const accessFileByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return currentData;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const accessFileNameByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return currentData.fileName;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const accessFileTypeByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return currentData.fileType;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const accessFileAbsolutePathByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        if (currentData.fileAbsolutePath) {
          return currentData.fileAbsolutePath;
        } else {
          return currentData.filePath;
        }
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const accessFileExpandByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return currentData.fileExpend;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const updateFileExpandByPath = (path, expend) => {
    setExploreOptionsAndContentData((prevData) => {
      const updateNestedFiles = (data, pathArray, currentIndex) => {
        if (currentIndex === pathArray.length - 1) {
          return { ...data, fileExpend: expend };
        }
        const nextIndex = currentIndex + 1;
        const updatedFiles = data.files.map((file) => {
          if (file.fileName === pathArray[nextIndex]) {
            return updateNestedFiles(file, pathArray, nextIndex);
          }
          return file;
        });
        return { ...data, files: updatedFiles };
      };
      const pathArray = path.split("/");
      return updateNestedFiles(prevData, pathArray, 0);
    });
  };
  const accessFilesByPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return currentData.files;
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const getExpendedFilesAmountUnderPath = (path) => {
    const pathArray = path.split("/");
    let currentData = exploreOptionsAndContentData;
    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        return countExpendedFilesAmountUnderPath(currentData);
      } else {
        currentData = currentData.files;
        for (let j = 0; j < currentData.length; j++) {
          if (currentData[j].fileName === pathArray[i + 1]) {
            currentData = currentData[j];
            break;
          }
        }
      }
    }
  };
  const countExpendedFilesAmountUnderPath = (data) => {
    let count = 0;
    for (let i = 0; i < data.files.length; i++) {
      if (data.files[i].fileType === "folder" && data.files[i].fileExpend) {
        count += countExpendedFilesAmountUnderPath(data.files[i]) + 1;
      } else {
        count++;
      }
    }
    return count;
  };
  /* Explorer Data and Functions ------------------------------------------ */

  /* Stack Structure Data and Functions ============================================================== */
  const [stackStructureOptionsData, setStackStructureOptionsData] = useState(
    DEFAULT_STACK_STRUCTURE_OPTIONS_DATA
  );
  const updateStackStructureContainerIndex = (originalIndex, newIndex) => {
    setStackStructureOptionsData((prevData) => {
      const newOptionsData = [...prevData];
      const popedData = newOptionsData.splice(originalIndex, 1);
      newOptionsData.splice(newIndex, 0, popedData[0]);

      return newOptionsData;
    });
  };
  const removeStackStructureContainerIndex = (index) => {
    setStackStructureOptionsData((prevData) => {
      const newOptionsData = [...prevData];
      newOptionsData.splice(index, 1);

      return newOptionsData;
    });
  };
  /* Stack Structure Data and Functions ============================================================== */
  return (
    <vecoderEditorContexts.Provider
      value={{
        monacoEditorsOptionsData,
        setMonacoEditorsOptionsData,
        accessMonacoEditorOptionsByPath,
        updateMonacoEditorOptionsByPath,
        appendMonacoEditorOptionsByPath,
        removeMonacoEditorOptionsByPath,
        updateMonacoEditorViewStatesByPath,
        updateMonacoEditorModelsByPath,

        vecoderEditorsOptionsData,
        setVecoderEditorsOptionsData,
        updateOnSelectedMonacoIndexByEditorIndex,
        accessOnSelectedMonacoIndexByEditorIndex,
        updateMonacoEditorPathsByEditorIndex,
        accessMonacoEditorPathsByEditorIndex,
        accessMonacoEditorFileLanguageDataByEditorIndexAndOnSelectedIndex,
        accessMonacoEditorFileContentDataByEditorIndexAndOnSelectedIndex,

        vecoderEditorContentData,
        setVecoderEditorContentData,
        updateVecoderEditorFileContentDataByPath,
        accessVecoderEditorFileContentDataByPath,
        accessVecoderEditorFileLanguageDataByPath,
        accessVecoderEditorFileNameDataByPath,

        exploreOptionsAndContentData,
        setExploreOptionsAndContentData,
        isExploreOptionsAndContentDataLoaded,
        setIsExploreOptionsAndContentDataLoaded,
        updateFileOnExploreOptionsAndContentData,
        removeFileOnExploreOptionsAndContentData,
        renameAndRepathAllSubFiles,
        checkDirNameExist,
        accessFileByPath,
        accessFileNameByPath,
        accessFileTypeByPath,
        accessFileExpandByPath,
        updateFileExpandByPath,
        accessFilesByPath,
        getExpendedFilesAmountUnderPath,

        stackStructureOptionsData,
        setStackStructureOptionsData,
        updateStackStructureContainerIndex,
        removeStackStructureContainerIndex,
      }}
    >
      <StackStructure />
    </vecoderEditorContexts.Provider>
  );
};

export default VecoderEditorPage;
