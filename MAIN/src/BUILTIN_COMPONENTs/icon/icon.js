import React, { useState, useEffect, useRef } from "react";
import { iconManifest } from "./icon_manifest";

const Icon = ({ path, ...props }) => {
  const [svg, setSVG] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchSVG = async () => {
      const svg = await iconManifest[path]();
      setSVG(svg.default);
      setIsLoaded(true);
    };

    fetchSVG();
  }, [path]);

  if (!isLoaded) return null;
  return <img ref={svgRef} src={svg} alt={path} {...props} />;
};

export default Icon;
