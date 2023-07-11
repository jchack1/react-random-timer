import "./App.css";
import React, {useState} from "react";
import ShowRemainingTime from "./components/ShowRemainingTime";
import styled from "styled-components";
import useSound from "use-sound";

import alarmSound from "./sound/clock-alarm-8761.mp3";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Press Start 2P", monospace;
  font-size: 3rem;
  text-align: center;
  text-shadow: 2px 6px rgb(152, 85, 148);

  @media (max-width: 400px) {
    font-size: 2.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 400px) {
  }
`;

const Button = styled.button`
  font-family: "Courier New", Courier, monospace;

  padding: 15px 35px;
  background: ${(props) => props.backgroundColor};
  box-shadow: 6px 6px;
  border: none;
  margin: 40px;
  transition: 0.2s ease-in-out;

  &:hover {
    box-shadow: 3px 3px;

    transition: 0.2s ease-in-out;
  }

  @media (max-width: 400px) {
    padding: 10px 25px;
    margin: 40px 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: 10px 15px;
  margin: 20px;
  text-align: center;
  width: 70px;
  font-family: "Courier New", Courier, monospace;

  &:focus {
    outline: 2px solid #ffc414;
  }

  @media (max-width: 400px) {
    padding: 8px 12px;
    margin: 15px;
  }
`;

function App() {
  const [minimumTime, updateMinimumTime] = useState(12);
  const [maximumTime, updateMaximumTime] = useState(30);

  const [timeComplete, updateTimeComplete] = useState(false);
  const [validationError, updateValidationError] = useState("");
  const [timeEnd, updateTimeEnd] = useState(0);
  const [showRemaining, updateShowRemaining] = useState(false);
  const [stopCounting, updateStopCounting] = useState(false);
  const [setTimeoutId, updateSetTimeoutId] = useState(null);

  const [playSound] = useSound(alarmSound);

  const handleBeginTimer = (min, max) => {
    updateTimeComplete(false);
    updateStopCounting(false);

    if (
      isNaN(min) ||
      isNaN(max) ||
      typeof min !== "number" ||
      typeof max !== "number"
    ) {
      updateValidationError("input must be a number");
      setTimeout(() => {
        updateValidationError("");
      }, 4000);
      return;
    }

    if (max < min) {
      updateValidationError("maximum time must be greater than minimum time");
      setTimeout(() => {
        updateValidationError("");
      }, 4000);
      return;
    }

    //do math to get the random time
    const randomTimeMilliSeconds =
      Math.floor(Math.random() * (max - min + 1) + min) * 1000 * 60; //minutes

    //save timeEnd
    const timerEndsAt = Date.now() + randomTimeMilliSeconds;
    updateTimeEnd(timerEndsAt);

    //setTimeout
    const id = setTimeout(() => {
      updateTimeComplete(true);
      updateTimeEnd(0);
      updateStopCounting(true);
      updateShowRemaining(false);
      playSound();
    }, randomTimeMilliSeconds);

    //update timeout id so we can clear later on reset
    updateSetTimeoutId(id);
  };

  const handleReset = () => {
    updateStopCounting(true);
    updateShowRemaining(false);
    updateTimeComplete(false);
    updateTimeEnd(0);
    clearTimeout(setTimeoutId);
    updateSetTimeoutId(null);
  };

  return (
    <div className="app-background">
      <Title>random timer</Title>
      <p>will go off between</p>

      <FlexContainer>
        {/* time inputs */}

        <InputContainer>
          <Input
            value={minimumTime}
            onChange={(e) => updateMinimumTime(Number(e.target.value))}
          />
          and
          <Input
            value={maximumTime}
            onChange={(e) => updateMaximumTime(Number(e.target.value))}
          />
          minutes
        </InputContainer>

        <FlexContainer>
          {/* buttons, which change depending on different conditions */}

          <ButtonContainer>
            {timeEnd === 0 && (
              <Button
                onClick={() => handleBeginTimer(minimumTime, maximumTime)}
                backgroundColor="#ffc414"
              >
                start!
              </Button>
            )}

            {timeEnd > 0 && (
              <Button
                onClick={() => updateShowRemaining(!showRemaining)}
                backgroundColor="#ffc414"
              >
                {showRemaining ? "hide remaining time" : "show remaining time"}
              </Button>
            )}

            {(timeEnd > 0 || timeComplete) && (
              <Button onClick={() => handleReset()} backgroundColor="#ccc">
                reset
              </Button>
            )}
          </ButtonContainer>

          {validationError.length > 0 && (
            <div style={{textAlign: "center"}}>{validationError}</div>
          )}

          {timeComplete && <div style={{textAlign: "center"}}>done!</div>}

          {/* show spinner if timer running but not showing remaining time */}
          {timeEnd > 0 && !showRemaining && (
            <div className="spinner">
              <i className="fa fa-spinner" aria-hidden="true"></i>
            </div>
          )}

          {showRemaining && (
            <ShowRemainingTime
              timestampEnd={timeEnd}
              stopCounting={stopCounting}
            />
          )}
        </FlexContainer>
      </FlexContainer>
    </div>
  );
}

export default App;
