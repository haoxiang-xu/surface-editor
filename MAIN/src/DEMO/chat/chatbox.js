import React, { useState, useEffect, useRef } from "react";
import Markdown from "../../BUILTIN_COMPONENTs/markdown/markdown";

const R = 30;
const G = 30;
const B = 30;

const default_forground_color_offset = 12;
const default_font_color_offset = 128;
const default_font_size = 12;
const default_border_radius = 7;

const fake_assistant_msg = `Here’s a step-by-step demo on how to install Homebrew on your Mac:

## Step-by-Step Guide:

### 1. Open Terminal

- Use \`Cmd + Space\` to open Spotlight Search, type Terminal, and press Enter.
- Alternatively, you can open the Terminal from \`Applications > Utilities > Terminal\`.

### 2. Run the Homebrew Installation Command

- In your terminal, paste the following command and press Enter:

\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

- This command fetches and runs the official Homebrew installation script.

### 3. Enter Your Password

- During the installation process, you may be prompted to enter your macOS password. Type your password and press Enter. (Note: The password will not be visible as you type.)

### 4. Follow the On-Screen Instructions

- Homebrew will provide some prompts during the installation, such as asking for permission to install developer tools (if not already installed). If you see this prompt, select Install and proceed.

### 5. Add Homebrew to Your PATH

- After the installation completes, Homebrew will suggest adding the Homebrew directory to your PATH. This step ensures that you can run Homebrew commands from anywhere in the terminal.
- Follow the instructions provided by Homebrew to add it to your shell configuration file:

\`\`\`bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
\`\`\``;
const fake_terminal_msg = `\`\`\`bash
(base)  red@RedMac  ~/desktop  cd CLONERepo
(base)  red@RedMac  ~/desktop/CLONERepo  ls
Icon?          audio-slicer   so-vits-svc    surface-editor
(base)  red@RedMac  ~/desktop/CLONERepo  cd surface-editor
(base)  red@RedMac  ~/desktop/CLONERepo/surface-editor   version_0.0.2  cd f
rontend_application/component_lib_testing_application
(base)  red@RedMac  ~/desktop/CLONERepo/surface-editor/frontend_application/component_lib_testing_application   version_0.0.2  npm start
\`\`\``;
const FAKE_DATA = [
  { role: "user", message: "Do me a demo on how to install homebrew on Mac" },
  { role: "assistant", message: fake_assistant_msg },
  { role: "terminal", message: fake_terminal_msg },
];

const Message = ({ role, message }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (role === "assistant") {
      setStyle({
        backgroundColor: `rgba(${R}, ${G}, ${B},0)`,
      });
    } else if (role === "terminal") {
      setStyle({
        backgroundColor: `#b45200`,
      });
    } else {
      setStyle({
        plainText: true,
      });
    }
  }, [role]);

  return (
    <div
      style={{
        position: "relative",
        width: role === "user" ? "50%" : "100%",
        marginLeft: role === "user" ? "50%" : "0",
        marginBottom: 32,
        borderRadius: default_border_radius,
      }}
    >
      <Markdown style={style}>{message}</Markdown>
    </div>
  );
};
const ScrollingSpace = ({ imported_messages, set_imported_messages }) => {
  const [messages, setMessages] = useState(
    imported_messages !== undefined ? imported_messages : FAKE_DATA
  );
  useEffect(() => {
    if (!imported_messages) return;
    setMessages(imported_messages);
  }, [imported_messages]);

  return (
    <div
      style={{
        position: "absolute",

        top: "0",
        left: "50%",
        width: "100%",
        height: "100%",
        padding: 16,

        transform: "translateX(-50%)",

        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {messages
        ? messages.map((msg, index) => (
            <Message key={index} role={msg.role} message={msg.message} />
          ))
        : null}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 64,
        }}
      ></div>
    </div>
  );
};
const Chat = ({ messages, setMessages }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",

        width: "100%",
        height: "100%",

        backgroundColor: `rgb(${R}, ${G}, ${B})`,
      }}
    >
      <ScrollingSpace
        imported_messages={messages}
        set_imported_messages={setMessages}
      />
    </div>
  );
};

export default Chat;
