# Development Guide

## [ Implemented Your own Stack Component ]

### STEP 1 INITILIZE YOUR COMPONENT

ADD YOUR COMPONENT TO `src/CONSTs/stackComponentConfig.js`

<span style="opacity: 0.64">Your Component should be created under `src/COMPONENTs/STACK_COMPONENTs`, under that folder you can create your own folder named as your root component, and under that you should create a same name json file exporting yout root componet. For example if your component called `test_component`, your component dir path should be `src/COMPONENTs/STACK_COMPONENTs/test_component/test_component`. Can then after you have created the component, the next step is to let the system know where your component is. In the file `src/CONSTs/stackComponentConfig.js` you should add a json variable at the end of the `STACK_COMPONENT_CONFIG` list variable like this</span>

```
  test_component: {
    component_type: "test_component",
    component_path: "test_component_folder_name",
  },
```

<span style="opacity: 0.64">`component_type` should have the same value as the key, and you need to make sure that is unique across the list</span>

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

#### LOCAL DATA ACCESS

- `local_data_manager` <span style="opacity: 0.64">Local Data Manager Allows you to store and reload your component data by the `stack_div_component_unique_tag`, so that your component won't lose the data after disposed.</span>

- `received_command`
