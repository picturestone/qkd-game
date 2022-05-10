import { useEffect } from "react";
import { useState } from "react";
import Lobby from "../models/Lobby";
import LobbiesService from "../services/LobbiesService";
import styles from "./Lobbies.module.scss";
import { Link} from 'react-router-dom';

function Lobbies() {
  const lobbiesService = new LobbiesService();
  const [lobbies, setLobbies] = useState(new Array<Lobby>());

  // Note: Empty dependency array means this will run once just like componentDidMount().
  // TODO check if any other useEffect() should run only once.
  useEffect(() => {
    lobbiesService.getAll()
    .then(
      (res) => {
        setLobbies(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return (
    <div className={styles.lobbies}>
      <h1>Lobbies</h1>

      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/lobbies'>Lobbies</Link></li>
      </ul>

      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby, i) => {
            return (<tr key={i}><td>{lobby.name}</td></tr>);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Lobbies;