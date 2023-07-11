import React, {useState, useEffect} from "react";

const ShowRemainingTime = ({timestampEnd, stopCounting, timeComplete}) => {
  const [remainingTime, updateRemainingTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();

      const newDate = new Date(timestampEnd - now);

      console.log(newDate);

      const minutes = String(newDate.getMinutes());
      const seconds = String(newDate.getSeconds());

      //   updateRemainingTime(
      //     `${newDate.getMinutes()}:${newDate.getSeconds()}`
      //   );

      updateRemainingTime(`${minutes}:${seconds.padStart(2, "0")}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [stopCounting]);

  console.log(`stopCounting: ${stopCounting}`);

  return (
    <div>
      <p style={{textAlign: "center"}}>{remainingTime}</p>
    </div>
  );
};

export default ShowRemainingTime;
