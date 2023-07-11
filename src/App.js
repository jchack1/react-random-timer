import "./App.css";
import React, {useState} from "react";
import ShowRemainingTime from "./components/ShowRemainingTime";
import styled from "styled-components";

function App() {
  const [minimumTime, updateMinimumTime] = useState(12);
  const [maximumTime, updateMaximumTime] = useState(30);

  const [timeComplete, updateTimeComplete] = useState(false);
  const [validationError, updateValidationError] = useState("");
  const [timeEnd, updateTimeEnd] = useState(0);
  const [showRemaining, updateShowRemaining] = useState(false);
  const [stopCounting, updateStopCounting] = useState(false);

  const handleBeginTimer = (min, max) => {
    updateStopCounting(false);
    if (max < min) {
      updateValidationError("maximum time must be greater than minimum time");
      setTimeout(() => {
        updateValidationError("");
      }, 4000);
      return;
    }

    //do math to get the random time, save to variable
    const randomTimeMilliSeconds =
      // Math.floor(Math.random() * (max - min + 1) + min) * 1000; //seconds
      Math.floor(Math.random() * (max - min + 1) + min) * 1000 * 60; //minutes

    console.log(`randomTimeMilliSeconds: ${randomTimeMilliSeconds}`);

    //save timeEnd
    const timerEndsAt = Date.now() + randomTimeMilliSeconds;
    console.log(`timerEndsAt: ${timerEndsAt}`);
    updateTimeEnd(timerEndsAt);

    //setTimeout
    setTimeout(() => {
      updateTimeComplete(true);
      updateTimeEnd(0);
      updateStopCounting(true);
      updateShowRemaining(false);
    }, randomTimeMilliSeconds);
  };

  const handleReset = () => {
    updateStopCounting(true);
    updateShowRemaining(false);
    updateTimeComplete(false);
    updateTimeEnd(0);
  };

  return (
    <div className="app-background">
      <h1>random timer</h1>
      <p>will go off between</p>

      <div>
        <input
          type="number"
          min={1}
          max={55}
          value={minimumTime}
          onChange={(e) => updateMinimumTime(Number(e.target.value))}
        />
        and
        <input
          type="number"
          min={2}
          max={60}
          value={maximumTime}
          onChange={(e) => updateMaximumTime(Number(e.target.value))}
        />
        minutes
        {timeEnd === 0 && (
          <button onClick={() => handleBeginTimer(minimumTime, maximumTime)}>
            Start!
          </button>
        )}
        <button onClick={() => handleReset()}>reset</button>
        {timeEnd > 0 && (
          <button onClick={() => updateShowRemaining(!showRemaining)}>
            show remaining time?
          </button>
        )}
        {validationError.length > 0 && <p>{validationError}</p>}
        {timeComplete && (
          <div style={{fontSize: "6rem"}}>you're done yay!!!!!!!!!!!</div>
        )}
        {showRemaining && (
          <ShowRemainingTime
            timestampEnd={timeEnd}
            stopCounting={stopCounting}
            timeComplete={timeComplete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
