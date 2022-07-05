import { Routes, Route } from 'react-router-dom';
import { PLAYERROLE } from './models/api/PlayerRole';
import App from './pages/App';
import GameAlice from './pages/GameAlice';
import GameBob from './pages/GameBob';
import Lobbies from './pages/Lobbies';
import LobbyDetail from './pages/LobbyDetail';
import LobbyNew from './pages/LobbyNew';

function Router() {
    return (
        // TODO think about nested routes.
        // TODO protect routes like lobbies
        <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/lobbies" element={<Lobbies />}></Route>
            <Route path="/lobbies/new" element={<LobbyNew />}></Route>
            <Route path="/lobbies/:lobbyId" element={<LobbyDetail />}></Route>
            <Route
                path={`/games/:gameId/${PLAYERROLE.alice}`}
                element={<GameAlice />}
            ></Route>
            <Route
                path={`/games/:gameId/${PLAYERROLE.bob}`}
                element={<GameBob />}
            ></Route>
        </Routes>
    );
}

export default Router;
