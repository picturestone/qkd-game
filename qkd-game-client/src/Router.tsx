import { Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Lobbies from './pages/Lobbies';
import LobbyDetail from './pages/LobbyDetail';

function Router() {
  return (
    // TODO think about nested routes.
    <Routes>
      <Route path='/' element={<App/>}></Route>
      <Route path='/lobbies' element={<Lobbies/>}></Route>
      <Route path='/lobbies/:lobbyid' element={<LobbyDetail/>}></Route>
    </Routes>
  );
}

export default Router;
