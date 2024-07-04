import React, { useState, useRef, useEffect, useContext } from "react";
import MonacoEditor from "@monaco-editor/react";
import { MonacoDiffEditor, monaco } from "react-monaco-editor";
import { RootDataContexts } from "../../DATA_MANAGERs/root_data_manager/root_data_contexts";
import { globalDragAndDropContexts } from "../../CONTEXTs/globalDragAndDropContexts";
import { stackStructureDragAndDropContexts } from "../../CONTEXTs/stackStructureDragAndDropContexts";

const Editor = ({
  //Editor required parameters
  editor_filePath,
  code_editor_container_ref_index,
  //Editor function parameters
  onAppendContent,
  setOnAppendContent,
  setOnSelectedContent,
  onContextMenu,
  mode,
  display,
  //Diff Editor optional parameters
  editor_diffContent,
  editor_setDiffContent,
  onDeleteMonacoEditorPath,
  setOnDeleteMonacoEditorPath,
}) => {
  let EDITOR_FONT_SIZE;
  switch (window.osInfo.platform) {
    case "darwin": // macOS
      EDITOR_FONT_SIZE = 12;
      break;
    case "win32": // Windows
      EDITOR_FONT_SIZE = 14;
      break;
    default:
      EDITOR_FONT_SIZE = 13;
  }
  const {
    monacoEditorsOptionsData,
    accessMonacoEditorOptionsByPath,
    updateMonacoEditorViewStatesByPath,
    updateMonacoEditorModelsByPath,

    vecoderEditorContentData,
    updateVecoderEditorFileContentDataByPath,
    accessVecoderEditorFileContentDataByPath,
    accessVecoderEditorFileLanguageDataByPath,
  } = useContext(RootDataContexts);
  const { draggedItem, dragCommand, setDragCommand } = useContext(
    globalDragAndDropContexts
  );
  const { onDragIndex } = useContext(stackStructureDragAndDropContexts);

  /*MONACO EDITOR OPTIONS-----------------------------------------------------------------------*/
  const monacoRef = useRef();
  const baseEditorOptions = React.useMemo(
    () => ({
      contextmenu: false,
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      minimap: { enabled: false },
      roundedSelection: true,
      fontSize: EDITOR_FONT_SIZE,
      lineNumbers: "off",
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
      readOnly: false,
      overflow: "hidden",
    }),
    []
  );
  const [isMonacoEditorMounted, setIsMonacoEditorMounted] = useState(false);
  const [monacoContent, setMonacoContent] = useState(accessVecoderEditorFileContentDataByPath(editor_filePath));
  const [monacoLanguage, setMonacoLanguage] = useState(accessVecoderEditorFileLanguageDataByPath(editor_filePath));
  useEffect(() => {
    setMonacoContent(accessVecoderEditorFileContentDataByPath(editor_filePath));
    setMonacoLanguage(accessVecoderEditorFileLanguageDataByPath(editor_filePath));
  }, [vecoderEditorContentData]);

  const [monacoModel, setMonacoModel] = useState(null);
  const [monacoViewState, setMonacoViewState] = useState(null);
  /*MONACO EDITOR OPTIONS-----------------------------------------------------------------------*/

  /*MONACO EDITOR FUNCTIONs======================================================================*/
  ////On editor mount
  const onEditorMount = (editor, monaco) => {
    monacoRef.current = editor;

    applyEditorOptionsInMemory(
      editor,
      monaco,
      monacoRef,
      editor_filePath,
      accessVecoderEditorFileLanguageDataByPath(editor_filePath),
      monacoEditorsOptionsData,
      accessMonacoEditorOptionsByPath,
      draggedItem,
      dragCommand,
      setDragCommand
    );
    defineTheme(monaco);
    registerCompletionProvider(monaco);
    registerInlineCompletionProvider(monaco);
    registerStateChangeListeners(
      monaco,
      editor,
      editor_filePath,
      monacoEditorsOptionsData,
      updateMonacoEditorViewStatesByPath,
      updateMonacoEditorModelsByPath
    );
    setIsMonacoEditorMounted(true);
  };
  ////Get monaco editor on selected content
  const getEditorOnSelected = (monacoRef) => {
    const select_range = monacoRef.current.getSelection();
    const selectedText = monacoRef.current
      .getModel()
      .getValueInRange(select_range);

    setOnSelectedContent({
      selectedText: selectedText,
      select_range: select_range,
    });
  };
  useEffect(() => {
    if (onAppendContent && monacoRef.current && display) {
      const editor = monacoRef.current.editor || monacoRef.current;
      const selection = editor.getSelection();
      const range = new monaco.Range(
        // selection.startLineNumber,
        // selection.startColumn,
        selection.endLineNumber,
        selection.endColumn,
        selection.endLineNumber,
        selection.endColumn
      );

      const id = { major: 1, minor: 1 };
      const text = onAppendContent;
      const op = {
        identifier: id,
        range: range,
        text: text,
        forceMoveMarkers: true,
      };
      editor.executeEdits("my-source", [op]);

      setOnAppendContent(null);
    }
  }, [onAppendContent, monacoRef]);
  /*MONACO EDITOR FUNCTIONs======================================================================*/

  /*MONACO EDITOR OPTIONS-----------------------------------------------------------------------*/
  const diffEditorOptions = React.useMemo(
    () => ({
      ...baseEditorOptions,
      readOnly: true,
      enableSplitViewResizing: false,
      renderSideBySide: true,
    }),
    [baseEditorOptions]
  );
  const editorProps = {
    language: monacoLanguage,
    theme: "vs-dark",
    options: editor_diffContent ? diffEditorOptions : baseEditorOptions,
    onChange: (newValue, e) => {
      updateVecoderEditorFileContentDataByPath(editor_filePath, newValue);
    },
    onMount: onEditorMount,
  };
  /*MONACO EDITOR OPTIONS-----------------------------------------------------------------------*/

  /*Drag and Drop Save and Reload Model=================================*/
  useEffect(() => {
    if (
      draggedItem &&
      draggedItem.content === editor_filePath &&
      draggedItem.source ===
        "vecoder_editor" + "/" + code_editor_container_ref_index.toString()
    ) {
      setMonacoModel(monacoRef.current.getModel());
      setMonacoViewState(monacoRef.current.saveViewState());

      monacoRef.current.setModel(null);
    } else if (
      draggedItem === null &&
      dragCommand === null &&
      monacoModel &&
      monacoViewState
    ) {
      monacoRef.current.setModel(monacoModel);
      monacoRef.current.restoreViewState(monacoViewState);
      setMonacoModel(null);
      setMonacoViewState(null);
    }
  }, [draggedItem]);
  useEffect(() => {
    if (onDragIndex !== -1) {
      setMonacoModel(monacoRef.current.getModel());
      setMonacoViewState(monacoRef.current.saveViewState());
      monacoRef.current.setModel(null);
    } else if (onDragIndex === -1 && monacoModel && monacoViewState) {
      monacoRef.current.setModel(monacoModel);
      monacoRef.current.restoreViewState(monacoViewState);
      setMonacoModel(null);
      setMonacoViewState(null);
    }
  }, [onDragIndex]);
  /*Drag and Drop Save and Reload Model=================================*/

  /*Delete Monaco Editor Path===========================================*/
  useEffect(() => {
    if (onDeleteMonacoEditorPath === editor_filePath) {
      monacoRef.current.setModel(null);
      setOnDeleteMonacoEditorPath(null);
    }
  }, [onDeleteMonacoEditorPath]);
  /*Delete Monaco Editor Path===========================================*/

  return (
    <div
      className="MONACO_EDITOR_CONTAINER"
      style={{
        height: "100%",
        width: "100%",
        display: display && mode === "HORIZONTAL" ? "block" : "none",
      }}
      onContextMenu={(e) => {
        getEditorOnSelected(monacoRef);
        onContextMenu(e);
      }}
    >
      {editor_diffContent ? (
        <MonacoDiffEditor
          {...editorProps}
          original={monacoContent}
          value={editor_diffContent}
        />
      ) : (
        <MonacoEditor
          {...editorProps}
          value={monacoContent}
          loading={<></>}
          style={{ display: isMonacoEditorMounted ? "block" : "none"}}
        />
      )}
    </div>
  );
};

export default Editor;

/*INITIALIZE MONACO EDITOR FUNCTION GROUP----------------------------------------------------*/
////Define theme for monaco editor
const defineTheme = (monaco) => {
  monaco.editor.defineTheme("customTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {},
  });
  monaco.editor.setTheme("customTheme");
};
////Register snippet completion provider for monaco editor
const registerCompletionProvider = (monaco) => {
  monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: (model, position) => {
      const suggestions = getSuggestionsBasedOnPrefix(model, position);
      return { suggestions: suggestions };
    },
  });
};
////Register inline completion provider for monaco editor
const registerInlineCompletionProvider = (monaco) => {
  const inlineCompletionProvider = {
    provideInlineCompletions: (model, position, context, token) => {
      return {
        items: [
          {
            insertText: "InlineCompletion",
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          },
        ],
      };
    },
    freeInlineCompletions: () => {},
  };
  monaco.languages.registerInlineCompletionsProvider(
    "javascript",
    inlineCompletionProvider
  );
};
////Get suggestions based on prefix for monaco editor
const getSuggestionsBasedOnPrefix = (model, position) => {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });
  console.log(textUntilPosition);

  if (textUntilPosition.endsWith("utill")) {
    return [
      {
        label: "utillFunctionOne",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "utillFunctionOne()",
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 5,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
      },
      {
        label: "utillFunctionTwo",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "utillFunctionTwo()",
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 5,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
      },
    ];
  }

  return [];
};
////Register state change listeners for monaco editor
const registerStateChangeListeners = (
  monaco,
  editor,
  editor_filePath,
  monacoEditorsOptionsAndContentData,
  updateMonacoEditorViewStateByPath,
  updateMonacoEditorModelByPath
) => {
  editor.onDidScrollChange((e) => {
    const viewState = editor.saveViewState();
    updateMonacoEditorViewStateByPath(editor_filePath, viewState);
    const Model = editor.getModel();
    updateMonacoEditorModelByPath(editor_filePath, Model);
  });
  editor.onDidChangeModelContent((e) => {
    const viewState = editor.saveViewState();
    updateMonacoEditorViewStateByPath(editor_filePath, viewState);
    const Model = editor.getModel();
    updateMonacoEditorModelByPath(editor_filePath, Model);
  });
  editor.onMouseDown((e) => {
    const { position } = e.target;
    if (position) {
      // console.log(
      //   `Clicked at line ${position.lineNumber}, column ${position.column}`
      // );
    }
  });
};
////Apply editor options for monaco editor
const applyEditorOptionsInMemory = (
  editor,
  monaco,
  monacoRef,
  editor_filePath,
  editor_language,
  monacoEditorsOptionsAndContentData,
  accessMonacoEditorsDataByPath,
  draggedItem,
  dragCommand,
  setDragCommand
) => {
  if (
    editor_filePath in monacoEditorsOptionsAndContentData &&
    monacoEditorsOptionsAndContentData[editor_filePath].model
  ) {
    monacoRef.current.setModel(
      monacoEditorsOptionsAndContentData[editor_filePath].model
    );
  }
  if (
    editor_filePath in monacoEditorsOptionsAndContentData &&
    monacoEditorsOptionsAndContentData[editor_filePath].viewState
  ) {
    editor.restoreViewState(
      monacoEditorsOptionsAndContentData[editor_filePath].viewState
    );
  }
  if (dragCommand === "WAITING FOR MODEL APPEND THEN DELETE FROM SOURCE") {
    setDragCommand("DELETE FROM SOURCE");
  } else if (dragCommand === "WAITING FOR MODEL APPEND") {
    setDragCommand(null);
  }
};
////Append Content Widget for monaco editor
const appendContentWidget = (monaco, editor) => {
  editor.addContentWidget({
    getId: function () {
      return "my.content.widget";
    },
    getDomNode: function () {
      if (!this.domNode) {
        this.domNode = document.createElement("div");
        this.domNode.innerHTML = "Custom Content";
        this.domNode.style.background = "lightgrey";
        this.domNode.style.color = "black";
      }
      return this.domNode;
    },
    getPosition: function () {
      return {
        position: {
          lineNumber: 5,
          column: 1,
        },
        preference: ["above", "below"],
      };
    },
  });
};
/*INITIALIZE MONACO EDITOR FUNCTION GROUP----------------------------------------------------*/
