import logo from "./logo.svg";
import Three from "./Component/Three.js";
import "./App.css";
import AlertButtons from "./Component/AlertButton.js";

function App() {
  return (
    <div className="App">
      <AlertButtons />
      <Three />
    </div>
  );
}

export default App;
