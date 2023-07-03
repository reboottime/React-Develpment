/**
 * Date: Sunday, July 2, 2023
 * @see https://usehooks.com/useScript/
 * Description: call a function after loading its external dependency
 */
import { useState, useEffect } from "react";

export default function useScript(src: string, callback?: CallableFunction): Status {
  const [status, setStatus] = useState<Status>((src) => {
    return !src ? "idle" : "loading";
  });

  useEffect(() => {
    // Consider edge case that the url could be an empty string
    if (!src) return;

    setStatus("loading");

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    const handleScriptLoad = () => setStatus("ready");
    const handleScriptError = () => setStatus("error");

    script.addEventListener("load", handleScriptLoad);
    script.addEventListener("error", handleScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
      script.removeEventListener("error", handleScriptError);
    };
  }, [src]);

  useEffect(() => {
    if(status === "ready") {
        callback?.();
    }
  }, [status, callback]);

  return status;
}

export type Status = "idle" | "loading" | "ready" | "error";
