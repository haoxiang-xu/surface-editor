import React, { useState, useEffect, useCallback } from "react";
import { RootConfigContexts } from "./root_config_contexts";

const RootConfigManager = ({ children }) => {
  const [R, setR] = useState(24);
  const [G, setG] = useState(24);
  const [B, setB] = useState(24);
  const [A, setA] = useState(1);

  const is_light_color = (r, g, b) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 127;
  };
  const adjust_lightness = (r, g, b, factor) => {
    return {
      r: Math.min(255, Math.max(0, r * factor)),
      g: Math.min(255, Math.max(0, g * factor)),
      b: Math.min(255, Math.max(0, b * factor)),
    };
  };
  const customize_offset = (R, G, B, offset) => {
    const factor = is_light_color(R, G, B) ? 1 - offset : 1 + offset;
    const { r, g, b } = adjust_lightness(R, G, B, factor);

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };
  const on_hover = useCallback((R, G, B) => {
    const factor = is_light_color(R, G, B) ? 0.8 : 1.6;
    const { r, g, b } = adjust_lightness(R, G, B, factor);

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }, []);
  const on_click = useCallback((R, G, B) => {
    const factor = is_light_color(R, G, B) ? 0.6 : 3.2;
    const { r, g, b } = adjust_lightness(R, G, B, factor);

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }, []);

  return (
    <RootConfigContexts.Provider
      value={{ R, setR, G, setG, B, setB, A, setA, customize_offset, on_hover, on_click }}
    >
      {children}
    </RootConfigContexts.Provider>
  );
};

export default RootConfigManager;
