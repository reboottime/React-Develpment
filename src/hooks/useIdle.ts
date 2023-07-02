/**
 * Date: Sunday, July 2, 2023
 * Description: Learn from  https://usehooks.com/useidle
 */

import throttle from "lodash/throttle";
import { useEffect, useState } from "react";

const USER_EVENTS = ["mousemove", "mousedown", "resize", "touchstart", "wheel"];

export default function useIdle(ms = 1000 * 60) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let boundEventHandlers: Array<() => void> = [];

    const handleTimeout = () => {
      setIsIdle(true);
    };

    // we need throttle just in cases user will do a lot of actions in a short period of time after landing on the page
    const handleEvent = throttle((e: Event) => {
      setIsIdle(false);

      window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(handleTimeout, ms);
    }, 500);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent();
      }
    };

    USER_EVENTS.forEach((e) => {
      // To avoid ts lint warning
      const handler = handleEvent.bind(null, e);
      boundEventHandlers.push(handler);

      window.addEventListener(e, handler);
    });

    // though I tested Mac chrome that the visibilitychange can be trakced on window, I still prefer to add it to document
    // just follow other dev's practice
    // References:
    // 1. https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
    // 2. https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
    // 3. https://caniuse.com/?search=visibilitychange
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      USER_EVENTS.forEach((e, index) => {
        window.removeEventListener(e, boundEventHandlers[index]);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      clearTimeout(timeoutId);
      boundEventHandlers.length = 0;
    };
  }, [ms]);

  return isIdle;
}
