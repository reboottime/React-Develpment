/**
 * Date: Sunday, July 2, 2023
 * @description Clicking outside of the target element and trigger the callback function
 * @see https://usehooks.com/useClickAway/, https://github.com/uidotdev/usehooks/blob/main/index.js#L97
 */
import { useRef, useEffect } from "react";

export default function useOnClickOutside(callback: CallableFunction) {
  const funcRef = useRef<CallableFunction>(callback);
  const elemRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elem = elemRef.current;

    if (elem) return;

    const handleClick = (e: MouseEvent) => {
      // @todo: what if the element contains a react portal that renders outside of the element yet visually inside of the element?
      // @todo: check maintine UI the Select component
      if (elem.contains(e.target as Node)) return;

      funcRef.current(e);
    };

    // @todo
    // Why the original code uses mousedown and touchstart instead of click?
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return elemRef;
}

/**
 * Usage example:
 * 
 * const ref = useOnClickOutside(() => {
 *  console.log("clicked outside of the element");
 * });
 * 
 * return (
    <div ref={ref}>Click to demo</div>
 * )
 */