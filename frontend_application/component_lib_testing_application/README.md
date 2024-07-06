# Development Guide

## [ Implemented Your own Stack Component ]

### STEP 1 INITILIZE YOUR COMPONENT

ADD YOUR COMPONENT TO `src/CONSTs/stackComponentConfig.js`

<span style="opacity: 0.64">Your Component should be created under `src/COMPONENTs/STACK_COMPONENTs`, under that folder you can create your own folder named as your root component, and under that you should create a same name .js file exporting yout root componet. For example if your component called `test_component`, your component dir path should be `src/COMPONENTs/STACK_COMPONENTs/test_component/test_component`. And then after you have created the component, the next step is to let the system know where your component is. In the file `src/CONSTs/stackComponentConfig.js` you should add a json variable at the end of the `STACK_COMPONENT_CONFIG` list variable like this</span> [`json sample`](#000_001) <span style="opacity: 0.64">.</span>

### STEP 2 HANDLE COMPONENT PARAMETERs

<span style="opacity: 0.64">Since your own component will be packed inside the `stack_frame` component, your component should have several parameters need to be handled.</span>

### PARAMETERs:

- `mode` (TYPE: String) <span style="opacity: 0.64"> (Basically you can check the value that is stored inside this `mode` variable, and base on the value to render the content inside this Stack Div) </span>

  - <span>"horizontal_stack_horizontal_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under horizontal mode which means width > the boundary) </span>
  - <span>"horizontal_stack_vertical_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under vertical mode which means width <= the boundary) </span>

- `stack_component_unique_tag` (TYPE: String, MAX LENGTH: 64) <span style="opacity: 0.64"> (Since your component may need to interact with other components, to differentiate them, and to receive and send command between component, you need this variable. `stack_component_unique_tag` will be assigned when this component be created and destoried after the component distoried, and once it created, it will be always the same.) </span>

### STEP 3 ACCESS TO SYSTEM DATA AND FUNCTIONs

### CONTEXTs & DATA MANAGERs

#### GLOBAL DATA ACCESS

- `root_data_manager` <span style="opacity: 0.64">Root Data Manager allows you to access, update, delete files under the repository that currently opened by this program.</span>

  - <span style="opacity: 0.64">`dir` Opened Folder and all subfolder will store recusively inside this variable as one single JSON structure.</span>
  - <span style="opacity: 0.64">`file` You can access any file under opened root folder by passing relative path.</span>

- `command_data_manager` (inorder to access this variable, you will need to get the premission from the user)

  - <span style="opacity: 0.64">`command` Basically this variable is acting like a communication channel across all component, Since the system is not running parallel, by using your component `stack_component_unique_tag` for accessing the command, you will see a json stack, each is one command. See how each command is structured in this</span> [`json sample`](#000_002)<span style="opacity: 0.64">.</span>

  - <span style="opacity: 0.64">`context menu` A major component of the `command_data_manager`


#### LOCAL DATA ACCESS

- `local_data_manager` <span style="opacity: 0.64">Local Data Manager Allows you to store and reload your component data by the `stack_div_component_unique_tag`, so that your component won't lose the data after disposed.</span>

- `local_command_manager`

## [ VARIABLE FORMATING GUIDE ]

#### [ 000_001 ] <a id="000_001"></a> Declare your compnent inside `src/CONSTs/stackComponentConfig.js`, So the system will recognize your component.

```
  test_component: {
    component_type: "test_component",
    component_path: "test_component_folder_name",
  },
```

<span style="opacity: 0.64">`component_type` should have the same value as the key, and you need to make sure that is unique across the list</span>

#### [ 000_002 ] <a id="000_002"></a> Command are store in a dic, you can access the command received by using your own `stack_component_unique_tag`, and you will get a list of json like below:

```
{
  command_source: 'stack_component_unique_tag_from'
  command_target: 'stack_component_unique_tag_to'
  command_content: {}
}
```

#### [000_003] <a id="000_003"></a> To structure a context menu item