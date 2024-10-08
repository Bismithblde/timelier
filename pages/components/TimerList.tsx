import React, { useEffect } from 'react';
import Timer from './Timer';
import { useStopwatch } from '../contexts/stopwatchContext';
export default function TimerList() {
  const { stopwatches } = useStopwatch();
  console.log(stopwatches);
  return (
    <div>
      {stopwatches.map((stopwatch, index) => {
        return <Timer key={index} stopwatch={stopwatch} />;
      })}
    </div>
  );
}
