import { useEffect } from "react";
import { useState } from "react";
import Lobby from "../models/Lobby";
import LobbiesService from "../services/LobbiesService";
import styles from "./Lobbies.module.scss";
import { Link} from 'react-router-dom';

function LobbyDetail() {
  const lobbiesService = new LobbiesService();
  const [lobby, setLobby] = useState(null);

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