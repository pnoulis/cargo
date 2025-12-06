import { React } from "react";

export type TThrotteldFn = (...args: unknown[]) => any;

export function useThrottle(fn: TThrottledFn, tInterval: number): void {
  const [args, setArgs] = React.useState([]);
  const lastCallRef = React.useRef(0);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const now = Date.now();
    /* const tElapsed = now - lastCallRef.current; */

    log("args changed");

    timeoutRef.current = setTimeout(() => {
      fn(...args);
      lastCallRef.current = Date.now();
    }, tInterval);

    /* if (tElapsed >= tInterval) {
     *   fn(...args);
     *   lastCallRef.current = now;
     * } else {
     * }
     */
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [args, setArgs, fn]);

  function ensureArray(...args) {
    setArgs(args);
  }

  return { args, setArgs: ensureArray };
}

export function useThrottledValue(tInterval: number): void {
  const [value, setValue] = React.useState(null);
  const cb = React.useCallback((...args) => setValue(args), [tInterval]);
  const { setArgs } = useThrottle(cb, tInterval);

  return [value, setArgs];
}
