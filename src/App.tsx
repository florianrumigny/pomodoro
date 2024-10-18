import { useEffect, useState } from "react";
import "./App.css";
import { Pause, Play, TimerReset, Coffee } from "lucide-react";
import { formatTime } from "./utils/formatLogTime";
import axios from "axios";
import { QuoteObject } from "./@types/quotesTypes";

function App() {
  const [clock, setClock] = useState<number>(24);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [logDuration, setLogDuration] = useState<number>(0);
  const [logBreaks, setLogBreaks] = useState<number>(0);

  const [quotes, setQuotes] = useState<QuoteObject | null>(null);

  const fiveMinutes = 5 * 60 * 1000;

  // Fetch a quote from dummyjson
  const getZenQuote = async () => {
    try {
      const result = await axios.get("https://dummyjson.com/quotes/random");
      setQuotes(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle the logs hurs and minutes (case if up to 60 minutes)
  const { hours: sessionHours, minutes: sessionMinutes } =
    formatTime(logDuration);
  const { hours: breakHours, minutes: breakMinutes } = formatTime(logBreaks);

  const hours = new Date().getHours().toString();
  const minutes = new Date().getMinutes().toString().padStart(2, "0");
  const today = new Date();

  const dayOfWeek = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  }).format(today);

  // Handle the greetings
  const clockDay = `${hours}:${minutes}`;

  const sayHello = () => {
    const trueHours = new Date().getHours();

    let greetings = "";

    switch (true) {
      case trueHours < 5:
        return (greetings = "Good Night");
      case trueHours < 12:
        return (greetings = "Good Morning");
      case trueHours < 18:
        return (greetings = "Good Afternoon");
      case trueHours < 23:
        return (greetings = "Good Evening");
      default:
        return (greetings = "Good Night");
    }

    return greetings;
  };

  // Handle all start/break logic

  // Set the start of the timer
  const handleStart = () => {
    setIsRunning(true);
  };

  // Set the break manually
  const handleStop = () => {
    setIsRunning(false);
    setIsOnBreak(true);
  };

  // Set a reset and clock to 0 minutes
  const handleReset = () => {
    setClock(0);
    setIsRunning(false);
  };

  // Ends the break, reset the timer and start a new 25 minutes
  const handleBreak = () => {
    setIsOnBreak(false);
    handleStart();
    handleReset();
  };

  // To prefetch a quote (refetching when a break ends)
  useEffect(() => {
    getZenQuote();
  }, []);

  // To Handle the pomodoro Timer / Break / Refetching data

  useEffect(() => {
    let intervalId: number | null = null;

    const startClock = () => {
      if (isRunning && !isOnBreak && clock < 25) {
        intervalId = setInterval(() => {
          setClock((prevTime) => prevTime + 1);
          setLogDuration((prevTime) => prevTime + 1);
          console.log(isRunning);
        }, 60000);
      } else if (clock === 25 && !isOnBreak) {
        setIsRunning(false);
        setIsOnBreak(true);
        if (intervalId) clearInterval(intervalId);
      }
    };

    startClock();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clock, isRunning, isOnBreak]);

  // To handle the break and restart function

  useEffect(() => {
    let breakTimeoutId: number | null = null;

    if (isOnBreak) {
      breakTimeoutId = setTimeout(() => {
        setIsOnBreak(false);
        setIsRunning(true);
        setClock(0);
        setLogBreaks((prevBreaks) => prevBreaks + 5);
        getZenQuote();
      }, fiveMinutes);
    }

    return () => {
      if (breakTimeoutId) clearTimeout(breakTimeoutId); // Clear timeout on cleanup
    };
  }, [isOnBreak, fiveMinutes]);

  return (
    <main className="container">
      {!isOnBreak ? (
        <>
          <div className="container-sidebar">
            <div className="sidebar-top">
              <p className="sidebar-title">{sayHello()}</p>
              <p className="sidebar-day">
                {" "}
                {dayOfWeek} {clockDay}
              </p>
            </div>

            <div className="sidebar-session">
              <h2 className="session-title">Session</h2>
              <div className="session-block">
                <p className="session-subtitle">Duration</p>
                <p>
                  {sessionHours > 0
                    ? `${sessionHours}h${sessionMinutes}m`
                    : `${sessionMinutes}m`}
                </p>
              </div>
              <div className="session-block">
                <p className="session-subtitle">Breaks</p>
                <p>
                  {" "}
                  {breakHours > 0
                    ? `${breakHours}h${breakMinutes}m`
                    : `${breakMinutes}m`}
                </p>
              </div>
            </div>
          </div>

          <div className="container-main">
            <div className="container-title">
              <div className="container-timer">
                <h1 className="timer-title">
                  {clock} {clock > 1 ? "minutes" : "minute"}
                </h1>
                <p className="timer-subtitle">FOCUS</p>
              </div>
            </div>
            <div className="container-button">
              <button
                onClick={handleReset}
                type="button"
                className="btn button-reset"
              >
                <TimerReset size={20} />
              </button>
              <button
                onClick={handleStart}
                type="button"
                disabled={isRunning}
                className="btn button-start"
              >
                <Play size={20} />
              </button>
              <button
                onClick={handleStop}
                type="button"
                className="btn button-stop"
              >
                <Pause size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <Coffee size={30} />
          <p>{quotes?.quote}</p>
          <p>{quotes?.author}</p>
          <button onClick={handleBreak} className="btn">
            Stop break
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
