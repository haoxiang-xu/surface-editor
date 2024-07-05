# Development Guide

## [ Before Implement Your own Stack Div Component ]

### PARAMETERs:

- `mode` (TYPE: String)<span style="opacity: 0.64">( Basically you can check the value that is stored inside this `mode` variable, and base on the value to render the content inside this Stack Div )</span>

    - <span>"horizontal_stack_horizontal_mode"</sapn><span style="opacity: 0.64">( This object is inside a horizontal stack Div and under horizontal mode which means width > the boundary )</span>
    - <span>"horizontal_stack_vertical_mode"</sapn><span style="opacity: 0.64">( This object is inside a horizontal stack Div and under vertical mode which means width <= the boundary )</span>

### CONTEXTs:

#### Root Data Manager 

<span style="opacity: 0.64">Root Data Manager allows you to access, update, delete files under the repository that currently opened by this program.</span>

#### Global Drag and Drop Context

<span style="opacity: 0.64">`Global Drag and Drop Context` allows you to know the object that is currently being dragged, and what source that object is being dragged from. You need to implement a trigger by yourself to detect if that object is drop into your `Div Component` and clean the `Global Drag and Drop Context` Dragging Object after the Drop. To use `Global Drag and Drop Context` across the entire program, You must check the format can be receive by other `Div Component`, If you just want to use within your own `Div Component`, you can define your own format, but just remember to clean the object after drop.</span>

#### Context Menu Context

<span style="opacity: 0.64">`Context Menu Context` allows you to send and receive data to the global `Context Menu`, and by doing this you can easily build a customized `Context Menu`, You can disable this default `Context Menu` to make your own. The global `Context Menu` works as a flow. So after user made a right click event, user defined event listener should set the `onRightClickItem`, when `onRightClickItem` changed, base on what kind of object is being clicked, `Context Menu` will generate a command and send to the target object, and object will always listening for that, and react to that command.</span>

#### Global Command Context

```
{
    command_target: [Div_Component_Unique_ID],
    command_content: [JSON_Object],
}
```

## [ Implemented Your own Stack Div Component ]

### STEP 1 INITILIZE YOUR COMPONENT

Your Component should be created under `src/COMPONENTs/STACK_COMPONENTs`, under that folder you can create your own folder named as your root component, and under that you should create a same name json file exporting yout root componet. For example if your component called `test_component`, your component dir path should be `src/COMPONENTs/STACK_COMPONENTs/test_component/test_component`. Can then after you have created the component, the next step is to let the system know where your component is. In the file `src/CONSTs/stackComponentConfig.js` you should add a json variable at the end of the `STACK_COMPONENT_CONFIG` list variable like this 

```
  test_component: {
    component_type: "test_component",
    component_path: "test_component_folder_name",
  },
```

### STEP 2 HANDLE COMPONENT PARAMETERs

Since your own component will be packed inside the `stack_frame` component, your component should have several parameters need to be handled.

### PARAMETERs:

- `mode` (TYPE: String) <span style="opacity: 0.64"> (Basically you can check the value that is stored inside this `mode` variable, and base on the value to render the content inside this Stack Div) </span>

    - <span>"horizontal_stack_horizontal_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under horizontal mode which means width > the boundary) </span>
    - <span>"horizontal_stack_vertical_mode"</sapn><span style="opacity: 0.64"> (This object is inside a horizontal stack Div and under vertical mode which means width <= the boundary) </span>

- `stack_div_component_unique_tag` (TYPE: String, MAX LENGTH: 64) <span style="opacity: 0.64"> (Since your component may need to interact with other components, to differentiate them, and to receive and send command between component, we need this variable. `stack_div_component_unique_tag` will be assigned when this component be created and destoried after the component distoried, and once it created, it will be always the same.) </span>

### STEP 3 ACCESS TO SYSTEM DATA AND FUNCTIONs

### CONTEXTs & DATA MANAGERs

#### GLOBAL DATA ACCESS

- `root_data_manager` <span style="opacity: 0.64">Root Data Manager allows you to access, update, delete files under the repository that currently opened by this program.</span>

- `command_data_manager`

#### LOCAL DATA ACCESS

- `local_data_manager` <span style="opacity: 0.64">Local Data Manager Allows you to store and reload your component data by the `stack_div_component_unique_tag`, so that your component won't lose the data after disposed.</span>

- `received_command`