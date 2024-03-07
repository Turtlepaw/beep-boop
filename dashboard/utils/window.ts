import { useEffect, useState } from "react";

const PHONE_WIDTH = 700;

export function useWindowSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setMobile(window.innerWidth < PHONE_WIDTH);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  return {
    width,
    height,
    isMobile,
  };
}
