# Development Guide

## [ Table of Contents ]

- [Implemented Your own Stack Component](#Implemented_Your_own_Stack_Component)
  1. [Initilize your component](#Initilize_your_component)
  2. [Handle component parameters](#Handle_component_parameters)
  3. [Access to system data and functions (Optional)](#Access_to_system_data_and_functions)
  4. [Define your own context menu (Optional)](#Define_your_own_context_menu)
- [Data Manager Variables and Functions](#Data_manager_variables_and_functions)
- [Variable Formating Guide](#Variable_formating_guide)
  <a id="Implemented_Your_own_Stack_Component"></a>

## [ Implemented Your own Stack Component ]

<a id="Initilize_your_component"></a>

### STEP 1 INITILIZE YOUR COMPONENT

ADD YOUR COMPONENT TO `src/CONSTs/stackComponentConfig.js`

<span style="opacity: 0.64">Your Component should be created under `src/COMPONENTs/STACK_COMPONENTs`, under that folder you can create your own folder named as your root component, and under that you should create a same name .js file exporting yout root componet. For example if your component called `test_component`, your component dir path should be `src/COMPONENTs/STACK_COMPONENTs/test_component/test_component`. And then after you have created the component, the next step is to let the system know where your component is. In the file `src/CONSTs/stackComponentConfig.js` you should add a json variable at the end of the `STACK_COMPONENT_CONFIG` list variable like this</span> [`SAMPLE 000_001`](#000_001) <span style="opacity: 0.64">.</span>

<a id="Handle_component_parameters"></a>

### STEP 2 HANDLE COMPONENT PARAMETERs

<span style="opacity: 0.64">Since your own component will be packed inside the `stack_frame` component, your component should have several parameters need to be handled.</span>

### PARAMETERs:

- `id` (TYPE: String, MAX LENGTH: 64) <span style="opacity: 0.64"> (Since your component may need to interact with other components, to differentiate them, and to receive and send command between component, you need this variable. `id` will be assigned when this component be created and destoried after the component distoried, and once it created, it will be always the same.) </span>

- `mode` (TYPE: String) <span style="opacity: 0.64"> (Basically you can check the value that is stored inside this `mode` variable, and base on the value to render the content inside this Stack Div) </span>

  - <span>"horizontal*stack*/\_horizontal_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under horizontal mode which means width > the boundary) </span>

  - <span>"horizontal*stack*/\_vertical_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under vertical mode which means width <= the boundary) </span>

  - <span>"vertical*stack*/\_horizontal_mode"</sapn>

  - <span>"vertical*stack*/\_vertical_mode"</sapn>

  - <span>"horizontal*space*/\_horizontal_mode"</sapn>

  - <span>"horizontal*space*/\_vertical_mode"</sapn>

  - <span>"vertical*space*/\_horizontal_mode"</sapn>

  - <span>"vertical*space*/\_vertical_mode"</sapn>

- `command` & `setCommand` (TYPE: List) <span style="opacity: 0.64">To receive commands from outside for example the `context_menu` or other kind of `stack_component` you need to keep listening on value that is storing inside `command`, it will store the oldest command that is pending for this `stack_componet` to be execute. You should write your own logic to handle that command and after the command is executed, you should empty the `command` variable like this `setCommand([]);` so that a new pending command will be set into this variable.</span>

- `load_contextMenu()`

- `data` & `setData` (TYPE: Json) <span style="opacity: 0.64"> data allows you to store and reload your component data, so that your component won't lose the data after disposed. You can define any Json structure you like to store inside this variable.</span>

<a id="Access_to_system_data_and_functions"></a>

### STEP 3 ACCESS TO SYSTEM DATA AND FUNCTIONs (Optional)

### GLOBAL CONTEXTs & DATA MANAGERs:

- [`root_data_manager`](#root_data_manager) <span style="opacity: 0.64">Root Data Manager allows you to access, update, delete files under the repository that currently opened by this program.</span>

  - [`dir`](#dir) <span style="opacity: 0.64">Opened Folder and all subfolder will store recusively inside this variable as one single JSON structure.</span>
  - [`file`](#file) <span style="opacity: 0.64">You can access any file under opened root folder by passing relative path.</span>
  - [`storage`](#storage) <span style="opacity: 0.64">storage allows you to store and reload your component data by the `id`, but different with `data` which is just a local data storage. This variable allows you to access all component data by their id. You can see this</span> [`SAMPLE 000_006`](#000_006) <span style="opacity: 0.64">to have a basic picture of how this useState variable be formatted for `monaco_editor` component.</span>

- [`root_command_manager`](#root_command_manager) (inorder to access this variable, you will need to get the premission from the user)

  - [`cmd`](#cmd) <span style="opacity: 0.64">Basically this variable is acting like a communication channel across all component, Since the system is not running parallel, by using your component `id` for accessing the command, you will see a json stack, each is one command. See how each command is structured in this</span> [`SAMPLE 000_002`](#000_002)<span style="opacity: 0.64">.</span>
  - [`context_menu`](#context_menu)
  - [`drag and drop`](#drag_and_drop)

- [`root_stack_manager`](#root_stack_manager)

<a id="Define_your_own_context_menu"></a>

### STEP 4 DEFINE YOUR OWN CONTEXT MENU (Optional)

#### STEP 4.1 Declare Context Menu Structure

<span style="opacity: 0.64">You can see this</span> [`SAMPLE 000_007`](#000_007) <span style="opacity: 0.64">to get a basic understand of how to declare a conext menu structure. </span>

#### STEP 4.2 Handle Parameters

<span style="opacity: 0.64">If you want to define a component inside of your context menu, you need to handle just 1 parameter so you can send a json back to your component. </span>

- `progress_context_menu_item` <span style="opacity: 0.64">it takes a json as variable and after you call this function it will generate a command just like `button` type context menu item will do.</span>

### STEP 5 DEFINE OTHER REQURIED FILES

### STEP 6 DONE

<a id="Data_manager_variables_and_functions"></a>

## [ Data Manager Variables and Functions ]

### ROOT_DATA_MANAGER <a id="root_data_manager"></a>

#### [dir] <a id="dir"></a>

- `dir`
- `isDirLoaded` & `setIsDirLoaded` <span style="opacity: 0.64">After `surface_explorer` opened a new folder or file, it will be set to `false` and after loading finish it will be set to `true`. You can access this value to see if the demand dir is opened but never try to use `setIsDirLoaded` to set a cusomized value.</span>
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

- `file`
- `update_file_content_by_path`
- `access_file_name_by_path_in_file`
- `access_file_content_by_path`
- `access_file_language_by_path`

#### [storage] <a id="storage"></a>

- `access_storage_by_id`
- `update_storage_by_id`
- `remove_storage_by_id`

### ROOT_COMMAND_MANAGER <a id="root_command_manager"></a>

#### [cmd] <a id="cmd"></a>

- `cmd`
- `push_command_by_id`
- `pop_command_by_id`

#### [context menu] <a id="context_menu"></a>

- `load_context_menu`
- `unload_context_menu`

#### [drag and drop] <a id="drag_and_drop"></a>

- `item_on_drag` <span style="opacity: 0.64">when you need to call this function you must declare the `on_drag_item` as one of the input for this function, you can check out the formation of how you should define this json variable by this </span>[`SAMPLE 000_008`](#000_008)<span style="opacity: 0.64">.</span>

<a id="Variable_formating_guide"></a>

## [ Variable Formating Guide ]

#### [ variable naming rules ]

- `UpperCaseSplitVariables` -> <span style="opacity: 0.64">useContext() variables</span>
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

#### [000_008] <a id="000_008"></a> On drag Item Structure

```
{
  source: 'component_id',
  ghost_image: 'url',
  content: {},
}

{
  source: id,
  ghost_image: 'tag',
  content: {
    type: "file",
    path: filePath,
  },
}
```

- `ghost_image` on drag image, will be the original item in default, otherwise you can define your own image to display or even component to display.
