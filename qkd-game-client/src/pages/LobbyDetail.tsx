import styles from "./Lobbies.module.scss";
import { Link } from 'react-router-dom';

function LobbyDetail() {
  return (
    <div className={styles.lobbies}>
      <h1>Lobby Detail Page</h1>

      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/lobbies'>Lobbies</Link></li>
      </ul>
    </div>
  );
}

export default LobbyDetail;