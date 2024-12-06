import React, { useState, useEffect } from 'react';
import './App.css';  // For styling (optional)

function App() {
  // States to manage work/break duration and timer
  const [workMinutes, setWorkMinutes] = useState(25); // Default: 25 minutes for work
  const [breakMinutes, setBreakMinutes] = useState(5); // Default: 5 minutes for break
  const [currentSeconds, setCurrentSeconds] = useState(workMinutes * 60); // Timer in seconds
  const [isActive, setIsActive] = useState(false); // Is the timer running?
  const [isWorkMode, setIsWorkMode] = useState(true); // Is the current mode "work"?

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  // Timer logic using useEffect
  useEffect(() => {
    let timer;
    
    // Only run the timer if the timer is active
    if (isActive) {
      timer = setInterval(() => {
        setCurrentSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            // When the timer hits 0, switch modes and reset the timer
            if (isWorkMode) {
              setIsWorkMode(false);
              return breakMinutes * 60; // Set to break duration
            } else {
              setIsWorkMode(true);
              return workMinutes * 60; // Set to work duration
            }
          }
          return prevSeconds - 1; // Decrement the timer
        });
      }, 1000);
    } else {
      // Clean up the timer if paused
      clearInterval(timer);
    }

    // Clean up the interval when component is unmounted or state changes
    return () => clearInterval(timer);
  }, [isActive, isWorkMode, workMinutes, breakMinutes]);

  // Handle the start/stop functionality
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Handle reset functionality
  const resetTimer = () => {
    setIsActive(false);
    setIsWorkMode(true);
    setCurrentSeconds(workMinutes * 60);
  };

  // Handle input changes for work and break durations
  const handleWorkChange = (e) => {
    const value = Math.max(1, Math.min(60, parseInt(e.target.value))); // Limits between 1-60 minutes
    setWorkMinutes(value);
    if (isWorkMode) setCurrentSeconds(value * 60);
  };

  const handleBreakChange = (e) => {
    const value = Math.max(1, Math.min(60, parseInt(e.target.value))); // Limits between 1-60 minutes
    setBreakMinutes(value);
    if (!isWorkMode) setCurrentSeconds(value * 60);
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>

      <div className="timer">
        <h2>{isWorkMode ? 'Work Time' : 'Break Time'}</h2>
        <div className="time-display">{formatTime(currentSeconds)}</div>
      </div>

      <div className="controls">
        <button onClick={toggleTimer} disabled={isActive}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} disabled={!isActive}>
          Reset
        </button>
      </div>

      <div className="settings">
        <div>
          <label>Work Duration (minutes):</label>
          <input
            type="number"
            value={workMinutes}
            onChange={handleWorkChange}
            min="1"
            max="60"
            disabled={isActive}
          />
        </div>
        <div>
          <label>Break Duration (minutes):</label>
          <input
            type="number"
            value={breakMinutes}
            onChange={handleBreakChange}
            min="1"
            max="60"
            disabled={isActive}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
