import React, { useState, useEffect, useRef } from "react";
import Span from "../../BUILTIN_COMPONENTs/span/span";

const R = 30;
const G = 30;
const B = 30;

const default_forground_color_offset = 12;
const default_font_color_offset = 128;
const default_font_size = 12;
const default_border_radius = 7;

const ScrollingSpace = () => {
  return (
    <div
      style={{
        position: "absolute",

        top: "0",
        left: "50%",
        width: "50%",
        height: "100%",
        padding: 16,

        transform: "translateX(-50%)",

        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Span>
        {`1. Wrapped CodeBlock in a div with the custom-scrollbar Class: \$\\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}}\$

        \`\`\`html
<style>
  .custom-scrollbar {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    box-sizing: border-box;
  }
</style>
        \`\`\`

        kyggkjygkhdktdk f yfyfthtf
        
        2. Added a div with the custom-scrollbar Class to the CodeBlock: 
        
         <style>
    table {
      width: 50%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 18px;
      text-align: left;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f4f4f4;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  </style>
  
  <h1>Sample HTML Table</h1>

<table>
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Apples</td>
      <td>$1.50</td>
      <td>10</td>
    </tr>
    <tr>
      <td>Oranges</td>
      <td>$2.00</td>
      <td>8</td>
    </tr>
    <tr>
      <td>Bananas</td>
      <td>$0.75</td>
      <td>15</td>
    </tr>
  </tbody>
</table>
        
        `}
      </Span>
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

const Chat = () => {
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
      <ScrollingSpace />
    </div>
  );
};

export default Chat;
