import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { GameView } from './Game';
import { PlayerList } from './Login';

let _GameView = new GameView({});
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={PlayerList()} />
          <Route path="/game" element={<GameView />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
