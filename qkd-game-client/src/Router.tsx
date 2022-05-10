import { Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Lobbies from './pages/Lobbies';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<App/>}></Route>
      <Route path='/lobbies' element={<Lobbies/>}></Route>
    </Routes>
  );
}

export default Router;
