import { Routes, Route } from 'react-router-dom';
import App from './pages/App';
import GameSender from './pages/GameSender';
import Lobbies from './pages/Lobbies';
import LobbyDetail from './pages/LobbyDetail';
import LobbyNew from './pages/LobbyNew';

function Router() {
    return (
        // TODO think about nested routes.
        // TODO protect routes like lobbies
        <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/gamesender" element={<GameSender />}></Route>
            <Route path="/lobbies" element={<Lobbies />}></Route>
            <Route path="/lobbies/new" element={<LobbyNew />}></Route>
            <Route path="/lobbies/:lobbyId" element={<LobbyDetail />}></Route>
        </Routes>
    );
}

export default Router;
