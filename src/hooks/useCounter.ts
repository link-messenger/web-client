import { useEffect, useRef, useState } from "react";

export const useCountUp = (time: number) => {
  const [timer, setTimer] = useState<number>(time);
  const clearRef = useRef<number>();
  const countUp = () => {
    clearRef.current = setTimeout(() => {
      setTimer((prev) => prev + 1000);
      countUp();
    }, 1000);
  }
  useEffect(() => {
    countUp();

    return () => {
      clearTimeout(clearRef.current);
    }
  }, []);

  return timer;
}