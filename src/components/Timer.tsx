import React from "react";

const formatToDoubleDigit = (num: number): string => {
  const numStr = `${Math.floor(num)}`;
  if (numStr.length > 99) {
    return `99`;
  }
  if (numStr.length >= 2) {
    return numStr;
  }
  return `0${numStr}`;
};

export const Timer: React.FunctionComponent = () => {
  const [elapsedTimeSec, setElapsedTimeSec] = React.useState(0);
  React.useEffect(() => {
    let elapsedTime = 0;
    const id = setInterval(() => {
      elapsedTime++;
      setElapsedTimeSec(elapsedTime);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const hours = elapsedTimeSec / (60 * 60);
  const minutes = (elapsedTimeSec % (60 * 60)) / 60;
  const seconds = elapsedTimeSec % 60;

  return (
    <span className="timer">{`${formatToDoubleDigit(
      hours
    )}:${formatToDoubleDigit(minutes)}:${formatToDoubleDigit(seconds)}`}</span>
  );
};
