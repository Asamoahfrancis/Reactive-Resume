import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import webfontloader from "webfontloader";

import { useArtboardStore } from "../store/artboard";

export const ArtboardPage = () => {
  const metadata = useArtboardStore((state) => state.resume.metadata);

  const fontString = useMemo(() => {
    const family = metadata.typography.font.family;
    const variants = metadata.typography.font.variants.join(",");
    const subset = metadata.typography.font.subset;

    return `${family}:${variants}:${subset}`;
  }, [metadata.typography.font]);

  useEffect(() => {
    webfontloader.load({
      google: { families: [fontString] },
      active: () => {
        const height = window.document.body.offsetHeight;
        const message = { type: "PAGE_LOADED", payload: { height } };
        window.postMessage(message, "*");
      },
    });
  }, [fontString]);

  // Font Size & Line Height
  useEffect(() => {
    document.documentElement.style.setProperty("font-size", `${metadata.typography.font.size}px`);
    document.documentElement.style.setProperty("line-height", `${metadata.typography.lineHeight}`);
  }, [metadata]);

  // Underline Links
  useEffect(() => {
    if (metadata.typography.underlineLinks) {
      document.querySelector("#root")!.classList.add("underline-links");
    } else {
      document.querySelector("#root")!.classList.remove("underline-links");
    }
  }, [metadata]);

  return <Outlet />;
};