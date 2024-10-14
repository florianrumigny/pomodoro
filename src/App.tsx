import "./App.css";

function App() {
  return (
    <main className="container">
      <div className="container-title">
        <h1 className="title-clock">0 minute</h1>
      </div>
      <div className="container-button">
        <button type="button" className="button-start">
          Clock in
        </button>
        <button type="button" className="button-stop">
          Break time
        </button>
      </div>
    </main>
  );
}

export default App;
