import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
<<<<<<< HEAD
import { GameView } from './routes/Game';
import { PlayerList } from './routes/Login';
=======
import { GameView } from './Game';
import { PlayerList } from './Login';
>>>>>>> 757ab98 (front end board syncs with backend)

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
