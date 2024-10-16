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

  const getZenQuote = async () => {
    try {
      const result = await axios.get("https://dummyjson.com/quotes/random");
      setQuotes(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { hours: sessionHours, minutes: sessionMinutes } =
    formatTime(logDuration);
  const { hours: breakHours, minutes: breakMinutes } = formatTime(logBreaks);

  const hours = new Date().getHours().toString();
  const minutes = new Date().getMinutes().toString().padStart(2, "0");
  const today = new Date();

  const dayOfWeek = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  }).format(today);

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

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsOnBreak(true);
  };

  const handleReset = () => {
    setClock(0);
    setIsRunning(false);
  };

  const handleBreak = () => {
    setIsOnBreak(false);
    handleStart();
    handleReset();
  };

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
        getZenQuote();
        if (intervalId) clearInterval(intervalId);
      }
    };

    startClock();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clock, isRunning, isOnBreak]);

  useEffect(() => {
    let breakTimeoutId: number | null = null;

    if (isOnBreak) {
      breakTimeoutId = setTimeout(() => {
        setIsOnBreak(false);
        setIsRunning(true);
        setClock(0);
        setLogBreaks((prevBreaks) => prevBreaks + 5);
      }, fiveMinutes);
    }

    return () => {
      if (breakTimeoutId) clearTimeout(breakTimeoutId); // Clear timeout on cleanup
    };
  }, [isOnBreak, fiveMinutes]);

  return (
    <main className="container">
      {!isOnBreak ? (
        <div
          className={
            isRunning ? "container-main is-on" : "container-main is-off"
          }
        >
          <div className="container-title">
            <div>
              <p className="title-hello">{sayHello()}</p>
              <p className="title-calendar">
                {" "}
                {dayOfWeek} {clockDay}
              </p>
            </div>
            <h1 className="title-clock">
              {clock} {clock > 1 ? "minutes" : "minute"}
            </h1>
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
          {isOnBreak && <p>Vous êtes en pause pour 5 minutes</p>}
          <div className="container-session">
            <h2 className="session-title">Session</h2>
            <p>Duration</p>
            <p>
              {sessionHours > 0
                ? `${sessionHours}h${sessionMinutes}m`
                : `${sessionMinutes}m`}
            </p>
            <p>Breaks</p>
            <p>
              {" "}
              {breakHours > 0
                ? `${breakHours}h${breakMinutes}m`
                : `${breakMinutes}m`}
            </p>
          </div>
        </div>
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
