import { useEffect, useState } from "react";
import "./App.css";
import { Pause, Play } from "lucide-react";

function App() {
  const [clock, setClock] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // const seconds = 1;
  // const minutes = seconds * 60;

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    let intervalId: number | null = null;
    const startClock = () => {
      if (isRunning && clock < 25) {
        intervalId = setInterval(() => {
          setClock((prevTime) => prevTime + 1);
          console.log(isRunning);
        }, 60000);
      } else {
        setIsRunning(false);
      }
      // en gros je set interval à 1 minute (en milliseconde) de set clock, d'1 minute chaque minute
      // quand le compteur est à 25, je stop ?
      // si le bouton (donc il faudra un useState boolean) stop est appuyé, je stop. Si le bouton play est réappuyé et que les 25 ne sont pas passés, ça reprend ?
    };

    startClock();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clock, isRunning]);

  return (
    <main className="container">
      <div
        className={isRunning ? "container-main is-on" : "container-main is-off"}
      >
        <div className="container-title">
          <h1 className="title-clock">
            {clock} {clock > 1 ? "minutes" : "minute"}
          </h1>
        </div>
        <div className="container-button">
          <button
            onClick={handleStart}
            type="button"
            className="btn button-start"
          >
            <Play size={20} /> Clock in
          </button>
          <button
            onClick={handleStop}
            type="button"
            className="btn button-stop"
          >
            <Pause size={20} /> Break time
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
