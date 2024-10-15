import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'; // Import xterm styles

const TerminalComponent = () => {
  const terminalRef = useRef(null);  // Ref for the terminal DOM element
  const xtermRef = useRef(null);     // Ref for the xterm instance

  useEffect(() => {
    // Check if communicationAPI is available
    if (!window.communicationAPI) {
      console.error("communicationAPI is not available");  // Add error handling
      return;
    }

    // Initialize xterm
    const xterm = new Terminal({
      cursorBlink: true, // Optional: enables blinking cursor
      rows: 30,          // Optional: number of rows in the terminal
      cols: 80,          // Optional: number of columns in the terminal
    });

    // Attach the terminal to the div element
    xterm.open(terminalRef.current);
    xtermRef.current = xterm;

    // Listen for data coming from the backend (node-pty)
    window.communicationAPI.onMessage('terminal-output', (data) => {
      xterm.write(data);  // Write the output to the terminal
    });

    // Send data from the terminal to the backend
    xterm.onData((input) => {
      window.communicationAPI.sendMessage('terminal-input', input);  // Send user input to node-pty
    });

    // Cleanup on component unmount
    return () => {
      window.communicationAPI.removeMessageListener('terminal-output', () => {});
      xterm.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ height: '100%', width: '100%', backgroundColor: 'black' }} // Styling the terminal
    />
  );
};

export default TerminalComponent;
