<a id="top"></a>

# <span style="font-size: 32px;">Development Guide</span>

## [ Table of Contents ]

- [Customized Componet Implementation](#Customized_Componet_Implementation)
  1. [Initilize your component](#Initilize_your_component)
  2. [Handle component parameters](#Handle_component_parameters)
  3. [Access to system data and functions (Optional)](#Access_to_system_data_and_functions)
  4. [Define your own context menu (Optional)](#Define_your_own_context_menu)
- [Data Managers](#Data_managers)
- [Built-in Components](#Built-in_Components)
- [Variable Formating Guide](#Variable_formating_guide)
  <a id="Customized_Componet_Implementation"></a>

<a id="Initilize_your_component"></a>

## [ Customized Componet Implementation ] [$\uparrow$](#top)

### STEP 1 COMPONENT INITILIZATION [`^`](#Initilize_your_component)

ADD YOUR COMPONENT TO `src/CONSTs/stackComponentConfig.js`

<span style="opacity: 0.64">Your Component should be created under `src/COMPONENTs`, under that folder you can create your own folder named as your root component, and under that you should create a same name .js file exporting yout root componet. For example if your component called `test_component`, your component dir path should be `src/COMPONENTs/test_component/test_component.js`. And then after you have created the component, the next step is to let the system know where your component is. In the file `src/CONSTs/stackComponentConfig.js` you should add a json variable at the end of the `STACK_COMPONENT_CONFIG` list variable like this</span> [`SAMPLE 000_001`](#000_001) <span style="opacity: 0.64">.</span>

<a id="Handle_component_parameters"></a>

### STEP 2 HANDLE COMPONENT PARAMETERs [`^`](#Initilize_your_component)

<span style="opacity: 0.64">Since your own component will be packed inside the `stack_frame` component, your component should have several parameters need to be handled.</span>

### PARAMETERs:

- `id` (TYPE: String, MAX LENGTH: 64) <span style="opacity: 0.64"> (Since your component may need to interact with other components, to differentiate them, and to receive and send command between component, you need this variable. `id` will be assigned when this component be created and destoried after the component distoried, and once it created, it will be always the same.) </span>

- `width` & `height` (TYPE: Number) <span style="opacity: 0.64"> This variable is the dimension of the component, and it will be set by the `root_stack_manager` component, so you don't need to worry about this variable. (Notice: this variables won't changing continuously during resizing, it will only change after the window size change finished or the component is created or destoried.) </span>

- `mode` (TYPE: String) <span style="opacity: 0.64"> (Basically you can check the value that is stored inside this `mode` variable, and base on the value to render the content inside this Stack Div) </span>

  - <span>"horizontal*stack*/\_horizontal_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under horizontal mode which means width > the boundary) </span>

  - <span>"horizontal*stack*/\_vertical_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under vertical mode which means width <= the boundary) </span>

  - <span>"vertical*stack*/\_horizontal_mode"</sapn>

  - <span>"vertical*stack*/\_vertical_mode"</sapn>

  - <span>"horizontal*space*/\_horizontal_mode"</sapn>

  - <span>"horizontal*space*/\_vertical_mode"</sapn>

  - <span>"vertical*space*/\_horizontal_mode"</sapn>

  - <span>"vertical*space*/\_vertical_mode"</sapn>

- `command` & `setCommand` & `load_contextMenu()` & `command_executed()` (TYPE: List) <span style="opacity: 0.64">To receive commands from outside for example the `context_menu` or other kind of `component` you need to keep listening on value that is storing inside `command`, it will store the oldest command that is pending for this `componet` to be execute. You should write your own logic to handle that command and after the command is executed, you should empty the `command` variable like this `setCommand([]);` or just call `command_executed()` so that a new pending command will be set into this variable.</span>

  - <span style="opacity: 0.64">`load_contextMenu()` [`SAMPLE` $\downarrow$](<#load_contextMenu()>)</span>

- `privateData` & `setPrivateData` (TYPE: JSON) <span style="opacity: 0.64">This variable is used to store the data that is only used by this component, and it will be set by the `root_stack_manager` component, so you don't need to worry about this variable. (stored using ID)</span>

- `publicData` & `setPublicData` (TYPE: JSON) <span style="opacity: 0.64">This variable is used to store the data that is shared by all components, and it will be set by the `root_stack_manager` component, so you don't need to worry about this variable. (stored using Type)</span>

- `item_on_drag()` & `item_on_drag_over()` & `item_on_drop()` <span style="opacity: 0.64">Set of functions that will be called when the item is on drag, on drag over and on drop.
  - <span style="opacity: 0.64">`item_on_drag()` [`SAMPLE` $\downarrow$](<#item_on_drag()>)</span>
  - <span style="opacity: 0.64">`item_on_drag_over()` [`SAMPLE` $\downarrow$](<#item_on_drag_over()>)</span>

<a id="Access_to_system_data_and_functions"></a>

### STEP 3 ACCESS TO SYSTEM DATA AND FUNCTIONs (Optional) [`^`](#Initilize_your_component)

### GLOBAL CONTEXTs & DATA MANAGERs:

- [`root_data_manager`](#root_data_manager) <span style="opacity: 0.64">Root Data Manager allows you to access, update, delete files under the repository that currently opened by this program.</span>

  - [`dir`](#dir) <span style="opacity: 0.64">Opened Folder and all subfolder will store recusively inside this variable as one single JSON structure.</span>
  - [`file`](#file) <span style="opacity: 0.64">You can access any file under opened root folder by passing relative path.</span>
  - [`storage`](#storage) <span style="opacity: 0.64">storage allows you to store and reload your component data by the `id` or `type`, but different with `data` which is just a local data storage. This variable allows you to access all component data by their id. You can see this</span> [`SAMPLE 000_006`](#000_006) <span style="opacity: 0.64">to have a basic picture of how this useState variable be formatted for `monaco_editor` component.</span>

- [`root_command_manager`](#root_command_manager) (inorder to access this variable, you will need to get the premission from the user)

  - [`cmd`](#cmd) <span style="opacity: 0.64">Basically this variable is acting like a communication channel across all component, Since the system is not running parallel, by using your component `id` for accessing the command, you will see a json stack, each is one command. See how each command is structured in this</span> [`SAMPLE 000_002`](#000_002)<span style="opacity: 0.64">.</span>
  - [`context_menu`](#context_menu)
  - [`drag and drop`](#drag_and_drop)

- [`root_stack_manager`](#root_stack_manager)

<a id="Define_your_own_context_menu"></a>

### STEP 4 DEFINE CUSTOMIZED CONTEXT MENU (Optional) [`^`](#Initilize_your_component)

#### STEP 4.1 Declare Context Menu Structure

<span style="opacity: 0.64">You can see this</span> [`SAMPLE 000_007`](#000_007) <span style="opacity: 0.64">to get a basic understand of how to declare a conext menu structure. </span>

#### STEP 4.2 Handle Parameters

<span style="opacity: 0.64">If you want to define a component inside of your context menu, you need to handle just 1 parameter so you can send a json back to your component. </span>

- `progress_context_menu_item` <span style="opacity: 0.64">it takes a json as variable and after you call this function it will generate a command just like `button` type context menu item will do.</span>

### STEP 5 DEFINE OTHER REQURIED FILES [`^`](#Initilize_your_component)

### STEP 6 DONE [`^`](#Initilize_your_component)

<a id="Data_managers"></a>

## [ Data Managers ] [$\uparrow$](#top)

This system is wrapped by several data managers level by level, and you can access them by using `useContext()` hook. Below is the list of all data managers that you can access.

Here is the project structure digram that shows how the data managers are structured and how your customized components are wrapped by them.

```
  ROOT
  └── ROOT_CONFIG_MANAGER
      └── ROOT_EVENT_LISTENER
          └── ROOT_DATA_MANAGER
              └── ROOT_COMMAND_MANAGER
                  └── ROOT_STACK_MANAGER
                      └── CUSTOMIZED_COMPONENT
```

### ROOT_EVENT_LISTENER <a id="root_event_listener"></a>

- `pressedKeys` & `setPressedKeys` <span style="background-color: red; color: black">Forbiden to update</span>
- `mouseActive` & `setMouseActive` <span style="background-color: red; color: black">Forbiden to update</span>
- `mousePosition` & `setMousePosition` <span style="background-color: red; color: black">Forbiden to update</span>

### ROOT_DATA_MANAGER <a id="root_data_manager"></a>

#### [dir] <a id="dir"></a>

- `dir` & `setDir` <span style="background-color: red; color: black">Forbiden to update</span>
- `isDirLoaded` & `setIsDirLoaded`
- `update_path_under_dir`
- `remove_path_under_dir`
- `rename_file_under_dir`
- `check_is_file_name_exist_under_path`
- `access_file_subfiles_by_path`
- `access_file_name_by_path_in_dir`
- `access_file_type_by_path`
- `access_file_absolute_path_by_path`
- `access_folder_expand_status_by_path`
- `update_folder_expand_status_by_path`
- `access_subfiles_by_path`
- `access_subfile_length_recusively_by_path`

#### [file] <a id="file"></a>

- `file` & `setFile` <span style="background-color: red; color: black">Forbiden to update</span>
- `update_file_content_by_path`
- `access_file_name_by_path_in_file`
- `access_file_content_by_path`
- `access_file_language_by_path`

#### [storage] <a id="storage"></a>

- `storage` & `setStorage` <span style="background-color: red; color: black">Forbiden to update</span>
- `access_storage_by_id`
- `update_storage_by_id`
- `remove_storage_by_id`

### ROOT_COMMAND_MANAGER <a id="root_command_manager"></a>

#### [cmd] <a id="cmd"></a>

- `cmd` & `setCmd` <span style="background-color: red; color: black">Forbiden to update</span>
- `push_command_by_id()`
- `pop_command_by_id()`

#### [context menu] <a id="context_menu"></a>

- `load_context_menu()`
- `unload_context_menu()`

#### [drag and drop] <a id="drag_and_drop"></a>

- `item_on_drag()` [`SAMPLE` $\downarrow$](<#item_on_drag()>)
- `item_on_drag_over()` [`SAMPLE` $\downarrow$](<#item_on_drag_over()>)
- `item_on_drop()`

### ROOT_STACK_MANAGER <a id="root_stack_manager"></a>

#### [stackStructure] <a id="stackStructure"></a>

- `stackStructure` & `setStackStructure` <span style="background-color: red; color: black">Forbiden to update</span>
- `containers` & `setContainers` <span style="background-color: red; color: black">Forbiden to update</span>
- `filters` & `setFilters` <span style="background-color: red; color: black">Forbiden to update</span>
- `componentCallbacks` & `setComponentCallbacks`

<a id="Variable_formating_guide"></a>

<a id="Built-in_Components"></a>

## [ Built-in Components ] [$\uparrow$](#top)

There are various built-in components that you can use to build your own customized component. They might be called by `Data_Manager`s in some cases, but you still can use them in your own component. Below is the list of all built-in components that you can use. The benefit of using these components includes:

- <span style="opacity: 0.64">You don't need to worry about the styling of the component, since the default styling of this component will be the same as the system, and dynamicallly change based on the system theme.</span>
- <span style="opacity: 0.64">All built-in components are tested, optimized and work well with the system and other components.</span>

## [ Variable Formating Guide ] [$\uparrow$](#top)

#### [ variable naming rules ]

- `UpperCaseSplitVariables` -> <span style="opacity: 0.64">Component Name & useContext() variables</span>
- `lowerCaseSplitVariables` -> <span style="opacity: 0.64">useState() variables</span>
- `under_score_split_variables` -> <span style="opacity: 0.64">folders, files, json keys and functions</span>

#### [ 000_001 ] <a id="000_001"></a> Declare your compnent inside `src/CONSTs/stackComponentConfig.js`, So the system will recognize your component.

```
  test_component: {
    type: "test_component",
    path: "test_component_folder_name/test_component_file_name",
  },
```

```
  monaco_editor: {
    type: "monaco_editor",
    path: "monaco_editor/monaco_editor",
  },
```

<span style="opacity: 0.64">`type` should have the same value as the key, and you need to make sure that is unique across the list</span>

#### [ 000_002 ] <a id="000_002"></a> Command are store in a dic, you can access the command received by using your own `id`, and you will get a list of json like below:

```
{
  source: 'id_from',
  target: 'id_to',
  content: {}
}
```

#### [000_003] <a id="000_003"></a> To structure a list of context menu items

#### [000_004] <a id="000_004"></a> To receive context Menu command

```
{
  source: 'context_menu',
  target: 'id_to',
  content: {
    command_id: 'String',
    command_content: {}
  }
}
```

#### [000_005] <a id="000_005"></a> on Drag and Drop Item Format

```
{
  source: 'id_from',
  content: {}
}
```

#### [000_006] <a id="000_006"></a> Storage Foramt Sample for monaco_editor

```
{
  id: {
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
  id: {
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
}
```

#### [000_007] <a id="000_007"></a> Context Menu Structure

```
[
  root: {
    type: 'root',
    sub_items: ['id1', 'id2'],
  },
  copy: {
    type: 'button'
    id: 'copy',
    clickable: true,
    height: 100,
    width: 512,
    label: 'Copy',
    short_cut_label: `Ctrl+C`
    icon: 'url',
    quick_view_background: `url`,
    sub_items: ['id1', 'id2'],
  },
  component: {
    type: `component`,
    id: 'component',
    path: `path_to_that_component`,
  }
]
```

- `type` (TYPE: String, DEFAULT VALUE: 'button')<span style="opacity: 0.64"> There are several context menu item type, you must declare the type so that the system will know how to render this item. Below is the list of all avaliable types:</span>

  - `root` in your context menu strcuture declaration, a root type object is a must have, and you should have only one root. which list all root context menu items.
  - `button`
  - `br`
  - `component`

- `id` (TYPE: String, MAX LENGTH: 256)<span style="opacity: 0.64"> Should be unique, you must define this. This variable will be used in 2 cases:</span>
  - <span style="opacity: 0.64"> When user click on your some context item, context menu will return to your componet this id, so that you know how to handle this event</span>
  - <span style="opacity: 0.64"> When you declare a sub context menu, you will use this id for that. </span>
- `label` (TYPE: String, MAX LENGTH: 25)<span style="opacity: 0.64"> (Optional) this label is optional since not every type of item will need this. For button type item, label will be the displaying text letting user know what function is this button.</span>
- `sub_label` (TYPE: String) <span style="opacity: 0.64"> (Optional) this variable will displayed as a low opacity text after label</span>
- `icon` <span style="opacity: 0.64">(Optional)</span>
- `quick_view_background` <span style="opacity: 0.64">(Optional)</span>
- `height` <span style="opacity: 0.64">(Optional) A button component default height will be 28, and br componet default height will be 8.</span>
- `width` <span style="opacity: 0.64">(Optional) `context_menu` default width is 220.</span>

<a id="item_on_drag()"></a>

#### <span style="font-size: 20px">`item_on_drag()` [$\uparrow$](#top)</span>

- `item_on_drag()` should be called when desired item is on drag, below is a sample code to show how to call this function.
  ```jsx
  <component
    onDragStart={(e) => {
      item_on_drag(e, {
        source: 'component_id',
        ghost_image: 'url',
        content: {
          type: "on_drag_item_type",
          ...
        },
        callback_to_delete: () => {}
      });
    }}
  ></component>
  ```
- below is how you should call the `item_on_drag()` function inside your component.
  ```jsx
  item_on_drag(e, on_drag_item);
  ```
- the `on_drag_item` should be a json object with the following structure:
  ```jsx
    {
      "source": "component_id",
      "ghost_image": "url",
      "content": {
        "type": "on_drag_item_type",
        ...
      },
      "callback_to_delete": () => {}
    }
  ```
  - `source` (TYPE: String) <span style="opacity: 0.64"> This variable is used to identify the source of the drag item, and it should be unique. And it will be provided as prop `id` for your component</span>
  - `ghost_image` optional (TYPE: String) <span style="opacity: 0.64"> This variable is used to display the image when the item is on drag, it should be a url of the image, a customized `tag` or customized component</span>
  - `content` (TYPE: JSON) <span style="opacity: 0.64"> This variable is used to store the data that you want to pass to the target component, and it should be a json object, the only required element inside of this JSON is type</span>
  - `callback_to_delete` (TYPE: Function) <span style="opacity: 0.64"> This function is used to delete the item after the drag is finished, and it will be called after the drag is finished.</span>
- here is a sample `on_drag_item` that is actually used in this project:
  ```jsx
  item_on_drag(e, {
    source: id,
    ghost_image: "tag",
    content: {
      type: "file",
      path: file_path,
    },
    callback_to_delete: (onDragItem, onDropItem) => {
      setOnSelectedMonacoIndex(-1);
      if (
        monacoCallbacks[onDragItem.content.path]?.callback_to_delete !==
          undefined &&
        onDragItem?.source !== onDropItem?.source
      ) {
        monacoCallbacks[onDragItem.content.path].callback_to_delete();
      }
      const to_delete_index = monacoPaths.indexOf(onDragItem.content.path);
      setMonacoPaths((prevData) => {
        return prevData.filter((path, index) => index !== to_delete_index);
      });
      setTagPositions((prevData) => {
        const new_data = { ...prevData };
        delete new_data[onDragItem.content.path];
        return new_data;
      });
    },
  });
  ```

<a id="item_on_drag_over()"></a>

#### <span style="font-size: 20px">`item_on_drag_over()` [$\uparrow$](#top)</span>

- `item_on_drag_over()` should be called when desired item is on drag over, below is a sample code to show how to call this function.
  ```jsx
  <component
    onDragOver={(e) => {
      item_on_drag_over(e, {
        source: 'component_id',
        content: {
          type: "on_drag_over_item_type",
          ...
        },
        accept: ['accept_type1', 'accept_type2'],
        callback_to_append: () => {}
      });
    }}
  ></component>
  ```
- below is how you should call the `item_on_drag_over()` function inside your component.
  ```jsx
  item_on_drag_over(e, on_drag_over_item);
  ```
- the `on_drag_over_item` should be a json object with the following structure:
  ```jsx
  {
    "source": "component_id",
    "content": {
      "type": "on_drag_over_item_type",
      ...
    },
    "accept": ['accept_type1', 'accept_type2'],
    "callback_to_append": () => {}
  }
  ```
  - `source` (TYPE: String) <span style="opacity: 0.64"> This variable is used to identify the source of the drag item, and it should be unique. And it will be provided as prop `id` for your component</span>
  - `content` (TYPE: JSON) <span style="opacity: 0.64"> This variable is used to store the data that you want to pass to the target component, and it should be a json object, the only required element inside of this JSON is type</span>
  - `accept` (TYPE: List) <span style="opacity: 0.64"> This variable is used to identify the type of the item that you want to accept, and it should be a list of string</span>
  - `callback_to_append` (TYPE: Function) <span style="opacity: 0.64"> This function is used to append the item after the drag is over, and it will be called after the drag is over.</span>
- here is a sample `on_drag_over_item` that is actually used in this project:
  ```jsx
  item_on_drag_over(null, {
    source: id,
    content: {
      type: "file",
      path: monacoPaths[onDragOveredMonacoIndex],
      append_to_left:
        onDragOverPosition.x <
        (tagPositions[monacoPaths[onDragOveredMonacoIndex]].width +
          default_tag_max_width) /
          2,
    },
    accepts: ["file"],
    callback_to_append: (onDragItem, onDropItem) => {
      if (!onDragItem || !onDropItem) return;
      if (onDragItem.content.type !== "file") return;
      let on_drop_index = monacoPaths.indexOf(onDropItem.content.path);
      if (onDropItem.content.append_to_left) {
        if (onDragedMonacoIndex !== -1 && onDragedMonacoIndex < on_drop_index) {
          on_drop_index -= 1;
        }
        setMonacoPaths((prevData) => {
          return [
            ...prevData.slice(0, on_drop_index),
            onDragItem.content.path,
            ...prevData.slice(on_drop_index),
          ];
        });
      } else {
        if (onDragedMonacoIndex !== -1 && onDragedMonacoIndex < on_drop_index) {
          on_drop_index -= 1;
        }
        on_drop_index += 1;
        setMonacoPaths((prevData) => {
          return [
            ...prevData.slice(0, on_drop_index),
            onDragItem.content.path,
            ...prevData.slice(on_drop_index),
          ];
        });
      }
      setRequiredRerender(true);
      setOnSelectedMonacoIndex(-1);
      setOnDragOverMonacoIndex(-1);
    },
  });
  ```

<a id="load_contextMenu()"></a>

#### <span style="font-size: 20px">`load_contextMenu()` [$\uparrow$](#top)</span>

- `load_contextMenu()` should be called when you want to load a context menu, below is a sample code to show how to call this function.
  ```jsx
  load_contextMenu(e, contextStructure);
  ```
  - `e` (TYPE: Event) <span style="opacity: 0.64"> This variable is the event that you want to load the context menu, and it should be a event object which is necessary for the system to know where to display the context menu</span>
  - `contextStructure` (TYPE: JSON) <span style="opacity: 0.64"> This variable is the structure of the context menu, and it should be a json object which is necessary for the system to know how to render the context menu</span>
- here is a sample `contextStructure` that is actually used in this project:
  ```json
  [
    root: {
      type: 'root',
      sub_items: ['copy', 'component'],
    },
    copy: {
      type: 'button'
      id: 'copy',
      clickable: true,
      height: 100,
      width: 512,
      label: 'Copy',
      short_cut_label: `Ctrl+C`
      icon: 'url',
      quick_view_background: `url`,
      sub_items: ['id1', 'id2'],
    },
    component: {
      type: `component`,
      id: 'component',
      path: `path_to_that_component`,
    }
  ]
  ```
