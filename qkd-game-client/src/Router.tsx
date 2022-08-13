import { Routes, Route } from 'react-router-dom';
import { PLAYERROLE } from './models/api/PlayerRole';
import App from './pages/App';
import CodeCompare from './pages/CodeCompare';
import GameAlice from './pages/GameAlice';
import GameBob from './pages/GameBob';
import GameEve from './pages/GameEve';
import GameResult from './pages/GameResult';
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
            <Route
                path={`/games/:gameId/${PLAYERROLE.eve}`}
                element={<GameEve />}
            ></Route>
            <Route
                path={`/games/:gameId/compare`}
                element={<CodeCompare />}
            ></Route>
            <Route
                path={`/games/:gameId/result`}
                element={<GameResult />}
            ></Route>
        </Routes>
    );
}

export default Router;
