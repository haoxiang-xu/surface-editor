import React, { useState, useEffect, useCallback } from "react";
import { RootDataContexts } from "./root_data_contexts";

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
    id: "surface_explorer_0004",
    type: "surface_explorer",
    stack_component_unique_tag: "surface_explorer_0004",
  },
  {
    id: "monaco_editor_0002",
    type: "monaco_editor",
    stack_component_unique_tag: "monaco_editor_0002",
    code_editor_container_ref_index: 1,
  },
  {
    id: "monaco_editor_0003",
    type: "monaco_editor",
    stack_component_unique_tag: "monaco_editor_0003",
    code_editor_container_ref_index: 2,
  },
];
const DIRs = {
  root: {
    file_name: "demo",
    file_type: "folder",
    file_path: "demo",
    file_expand: false,
    sub_items: ["demo/index", "demo/src", "demo/main.java", "demo/main.py"],
  },
  "demo/index": {
    file_name: "index",
    file_type: "folder",
    file_path: "demo/index",
    file_expand: false,
    sub_items: ["demo/index/style", "demo/index/index.html"],
  },
  "demo/index/style": {
    file_name: "style",
    file_type: "folder",
    file_path: "demo/index/style",
    file_expand: false,
    sub_items: ["demo/index/style/code_editor.css"],
  },
  "demo/index/index.html": {
    file_name: "index.html",
    file_type: "file",
    file_path: "demo/index/index.html",
    file_expand: false,
  },
  "demo/index/style/code_editor.css": {
    file_name: "code_editor.css",
    file_type: "file",
    file_path: "demo/index/style/code_editor.css",
    file_expand: false,
  },
  "demo/src": {
    file_name: "src",
    file_type: "folder",
    file_path: "demo/src",
    file_expand: false,
    sub_items: ["demo/src/code_editor.js"],
  },
  "demo/src/code_editor.js": {
    file_name: "code_editor.js",
    file_type: "file",
    file_path: "demo/src/code_editor.js",
    file_expand: false,
  },
  "demo/main.java": {
    file_name: "main.java",
    file_type: "file",
    file_path: "demo/main.java",
    file_expand: false,
  },
  "demo/main.py": {
    file_name: "main.py",
    file_type: "file",
    file_path: "demo/main.py",
    file_expand: false,
  },
};

const FAKE_STORAGE = {
  monaco_editor_0002: {
    on_selected_monaco_core_index: -1,
    monaco_paths: [
      "demo/src/code_editor.js",
      "demo/index/style/code_editor.css",
      "demo/main.py",
    ],
    monaco_cores: {
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
    },
  },
  monaco_editor_0003: {
    on_selected_monaco_core_index: -1,
    monaco_paths: ["demo/index/index.html", "demo/main.java"],
    monaco_cores: {
      "demo/index/index.html": {
        viewState: null,
        model: null,
      },
      "demo/main.java": {
        viewState: null,
        model: null,
      },
    },
  },
};

const RootDataManager = ({ children }) => {
  //console.log("RDM", new Date().getTime());

  /* { FILE } ========================================================================================================================== */
  const [file, setFile] = useState(DEFAULT_VECODER_EDITORS_CONTENT_DATA);
  useEffect(() => {
    window.electronAPI.onFileContent((content, relativePath) => {
      const newFile = { [relativePath]: content };
      setFile((prevData) => {
        return {
          ...prevData,
          ...newFile,
        };
      });
    });
    window.electronAPI.onFileError((error) => {
      console.error("Error:", error);
    });
  }, [file]);
  const update_file_content_by_path = useCallback(
    (path, data) => {
      setFile((prevData) => {
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
    },
    [file]
  );
  const access_file_name_by_path_in_file = useCallback(
    (path) => {
      if (path in file) {
        return file[path].fileName;
      } else {
        return path.split("/")[path.split("/").length - 1];
      }
    },
    [file]
  );
  const access_file_content_by_path = (path) => {
    if (path in file) {
      return file[path].fileContent;
    } else {
      //AWAIT ELECTRONJS TO LOAD THAT PATH IN SYSTEM
      window.electronAPI.readFile(
        access_file_absolute_path_by_path(path),
        path
      );
      return path;
    }
  };
  const access_file_language_by_path = useCallback(
    (path) => {
      if (path in file) {
        return file[path].fileLanguage;
      } else {
        return "UNKNOWN LANGUAGE";
      }
    },
    [file]
  );
  /* { FILE } ========================================================================================================================== */

  /* { DIR } =========================================================================================================================== */
  const [dir, setDir] = useState(DIRs);
  const [isDirLoaded, setIsDirLoaded] = useState(true);
  useEffect(() => {
    window.electron.receive("directory-data", (data) => {
      if (data.is_dir_successfully_loaded) {
        setDir(data.dirs);
        setIsDirLoaded(true);
      } else {
        setIsDirLoaded(true);
      }
    });
    return () => {
      window.electron.receive("directory-data", () => {});
    };
  }, []);
  const read_dir_from_system = useCallback(() => {
    setIsDirLoaded(false);
    window.electronAPI.triggerReadDir();
  }, []);
  const access_dir_name_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem) {
        return currentItem.file_name;
      } else {
        return path.split("/")[path.split("/").length - 1];
      }
    },
    [dir]
  );
  const access_dir_type_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem) {
        return currentItem.file_type;
      } else {
        return "UNKNOWN TYPE";
      }
    },
    [dir]
  );
  const access_dir_absolute_path_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem && currentItem.file_absolute_path) {
        return currentItem.file_absolute_path;
      } else {
        return path;
      }
    },
    [dir]
  );
  const access_dir_expand_status_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem) {
        return currentItem.file_expand;
      } else {
        return false;
      }
    },
    [dir]
  );
  const update_dir_expand_status_by_path = useCallback(
    (path, expand) => {
      setDir((prevData) => {
        let newDir = { ...prevData };
        newDir[path] = { ...newDir[path], file_expand: expand };
        return newDir;
      });
    },
    [dir]
  );
  const access_dir_sub_items_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem) {
        return currentItem.sub_items;
      } else {
        return [];
      }
    },
    [dir]
  );
  const order_sub_items = useCallback(
    (path) => {
      let newDir = { ...dir };
      let sub_items = newDir[path].sub_items;
      sub_items.sort((a, b) => {
        if (newDir[a].file_type === newDir[b].file_type) {
          return newDir[a].file_name.localeCompare(newDir[b].file_name);
        } else {
          return newDir[a].file_type === "folder" ? -1 : 1;
        }
      });
      newDir[path].sub_items = sub_items;
      setDir(newDir);
    },
    [dir]
  );
  const delete_file_by_path = useCallback(
    (path) => {
      if (path === "root") return;
      let parentPath = path.split("/").slice(0, -1);
      if (parentPath.length === 1) {
        parentPath = ["root"];
      }
      parentPath = parentPath.join("/");

      let newDir = { ...dir };
      const new_parent_sub_items = newDir[parentPath].sub_items.filter(
        (item) => item !== path
      );
      newDir[parentPath].sub_items = new_parent_sub_items;
      for (let key in newDir) {
        if (key.includes(path)) {
          delete newDir[key];
        }
      }
      setDir(newDir);
    },
    [dir]
  );
  const check_if_file_name_duplicate = useCallback(
    (parent_path, new_name) => {
      const parent_sub_items = dir[parent_path]?.sub_items;
      if (!parent_sub_items) {
        return true;
      }
      for (let i = 0; i < parent_sub_items.length; i++) {
        if (parent_sub_items[i].split("/").pop() === new_name) {
          return true;
        }
      }
      return false;
    },
    [dir]
  );
  const generate_on_copy_file = useCallback(
    (on_copy_path) => {
      const recursive_get_all_subitems = (path) => {
        const currentItem = dir[path];
        if (currentItem.file_type === "file") {
          return [path];
        } else {
          let subItems = [path];
          for (let i = 0; i < currentItem.sub_items.length; i++) {
            subItems = subItems.concat(
              recursive_get_all_subitems(currentItem.sub_items[i])
            );
          }
          return subItems;
        }
      };
      let to_remove_path = on_copy_path.split("/");
      to_remove_path.pop();
      to_remove_path = to_remove_path.join("/");

      let new_dir = {};
      const all_subitems = recursive_get_all_subitems(on_copy_path);
      for (let i = 0; i < all_subitems.length; i++) {
        const path = all_subitems[i];
        const currentItem = dir[path];
        const new_path = path.replace(to_remove_path, "");
        let sub_items = [];
        if (dir[path].file_type === "folder") {
          sub_items = currentItem.sub_items.map((item) => {
            return item.replace(to_remove_path, "");
          });
        }
        new_dir[new_path] = {
          file_name: currentItem.file_name,
          file_type: currentItem.file_type,
          file_path: new_path,
          file_expand: currentItem.file_expand,
          sub_items: sub_items,
        };
      }
      new_dir["root"] = {
        file_path: on_copy_path.replace(to_remove_path, ""),
      };
      return new_dir;
    },
    [dir]
  );
  const paste_on_copy_dir = useCallback(
    (on_copy_dir, under_path) => {
      let newDir = { ...dir };
      for (let key in on_copy_dir) {
        if (key === "root") continue;
        let new_path = under_path + key;
        let new_sub_items = [];
        if (on_copy_dir[key].file_type === "folder") {
          new_sub_items = on_copy_dir[key].sub_items.map((item) => {
            return under_path + item;
          });
        }
        newDir[new_path] = {
          ...on_copy_dir[key],
          file_path: new_path,
          sub_items: new_sub_items,
        };
      }
      let new_sub_items = newDir[under_path].sub_items.concat(
        under_path + on_copy_dir["root"].file_path
      );
      new_sub_items.sort((a, b) => {
        if (newDir[a].file_type === newDir[b].file_type) {
          return newDir[a].file_name.localeCompare(newDir[b].file_name);
        } else {
          return newDir[a].file_type === "folder" ? -1 : 1;
        }
      });
      newDir[under_path].sub_items = new_sub_items;

      setDir(newDir);
    },
    [dir]
  );
  const rename_file_by_path = useCallback(
    (path, new_name) => {
      const recursive_replace_path = (dir, original_path, new_path) => {
        let newDir = { ...dir };
        let current_item = newDir[original_path];
        if (current_item.file_type === "file") {
          const new_name = new_path.split("/").pop();
          current_item.file_name = new_name;
          current_item.file_path = new_path;
          delete newDir[original_path];
          newDir[new_path] = current_item;
        } else {
          const new_name = new_path.split("/").pop();
          current_item.file_name = new_name;
          current_item.file_path = new_path;
          current_item.sub_items = current_item.sub_items.map((item) => {
            const sub_item_original_path = item;
            let sub_item_new_path = item.replace(original_path, new_path);
            newDir = recursive_replace_path(
              newDir,
              sub_item_original_path,
              sub_item_new_path
            );
            return item.replace(original_path, new_path);
          });
          delete newDir[original_path];
          newDir[new_path] = current_item;
        }
        return newDir;
      };
      let new_path = path.split("/");
      new_path.pop();
      let parent_path = "";
      if (new_path.length === 1) {
        parent_path = "root";
      } else {
        parent_path = new_path.join("/");
      }
      new_path.push(new_name);
      new_path = new_path.join("/");

      let newDir = { ...dir };
      newDir = recursive_replace_path(newDir, path, new_path);
      newDir[parent_path].sub_items = newDir[parent_path].sub_items.map(
        (item) => {
          return item.replace(path, new_path);
        }
      );
      newDir[parent_path].sub_items.sort((a, b) => {
        if (newDir[a].file_type === newDir[b].file_type) {
          return newDir[a].file_name.localeCompare(newDir[b].file_name);
        } else {
          return newDir[a].file_type === "folder" ? -1 : 1;
        }
      });
      setDir(newDir);
    },
    [dir]
  );
  const create_file_by_path = useCallback(
    (path, file_name, file_type) => {
      let newDir = { ...dir };
      let new_path = path + "/" + file_name;

      newDir[new_path] = {
        file_name: file_name,
        file_type: file_type,
        file_path: new_path,
        file_expand: false,
        sub_items: [],
      };
      newDir[path].sub_items.push(new_path);
      newDir[path].file_expand = true;
      newDir[path].sub_items.sort((a, b) => {
        if (newDir[a].file_type === newDir[b].file_type) {
          return newDir[a].file_name.localeCompare(newDir[b].file_name);
        } else {
          return newDir[a].file_type === "folder" ? -1 : 1;
        }
      });
      setDir(newDir);
    },
    [dir]
  );
  const access_file_absolute_path_by_path = useCallback(
    (path) => {
      const currentItem = dir[path];
      if (currentItem && currentItem.absolute_path) {
        return currentItem.absolute_path;
      } else {
        return path;
      }
    },
    [dir]
  );
  /* { DIR } =========================================================================================================================== */

  /* { STORAGE } ======================================================================================================================= */
  const [storage, setStorage] = useState(FAKE_STORAGE);
  const access_storage_by_id = useCallback(
    (id) => {
      return storage[id];
    },
    [storage]
  );
  const update_storage_by_id = useCallback(
    (id, data) => {
      setStorage((prevData) => {
        return { ...prevData, [id]: data };
      });
    },
    [storage]
  );
  const remove_storage_by_id = useCallback(
    (id) => {
      setStorage((prevData) => {
        const newData = { ...prevData };
        delete newData[id];
        return newData;
      });
    },
    [storage]
  );
  /* { STORAGE } ======================================================================================================================= */

  /* Stack Structure Data and Functions ============================================================== */
  const [stackStructureOptionsData, setStackStructureOptionsData] = useState(
    DEFAULT_STACK_STRUCTURE_OPTIONS_DATA
  );
  const updateStackStructureContainerIndex = useCallback(
    (originalIndex, newIndex) => {
      setStackStructureOptionsData((prevData) => {
        const newOptionsData = [...prevData];
        const popedData = newOptionsData.splice(originalIndex, 1);
        newOptionsData.splice(newIndex, 0, popedData[0]);

        return newOptionsData;
      });
    },
    []
  );
  const removeStackStructureContainerIndex = useCallback((index) => {
    setStackStructureOptionsData((prevData) => {
      const newOptionsData = [...prevData];
      newOptionsData.splice(index, 1);

      return newOptionsData;
    });
  }, []);
  /* Stack Structure Data and Functions ============================================================== */
  return (
    <RootDataContexts.Provider
      value={{
        dir,
        setDir,
        isDirLoaded,
        setIsDirLoaded,
        read_dir_from_system,
        access_dir_name_by_path,
        access_dir_type_by_path,
        access_dir_absolute_path_by_path,
        access_dir_expand_status_by_path,
        update_dir_expand_status_by_path,
        access_dir_sub_items_by_path,
        delete_file_by_path,
        check_if_file_name_duplicate,
        generate_on_copy_file,
        paste_on_copy_dir,
        order_sub_items,
        rename_file_by_path,
        create_file_by_path,
        access_file_absolute_path_by_path,

        file,
        update_file_content_by_path,
        access_file_name_by_path_in_file,
        access_file_content_by_path,
        access_file_language_by_path,

        storage,
        access_storage_by_id,
        update_storage_by_id,
        remove_storage_by_id,

        stackStructureOptionsData,
        setStackStructureOptionsData,
        updateStackStructureContainerIndex,
        removeStackStructureContainerIndex,
      }}
    >
      {children}
    </RootDataContexts.Provider>
  );
};

export default RootDataManager;
