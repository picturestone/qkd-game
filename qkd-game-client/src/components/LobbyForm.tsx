import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStorage from '../helper/AuthStorage';
import Lobby from '../models/Lobby';
import LobbyService from '../services/LobbyService';
import Button from './Button';
import Input from './Input';

interface IProps {
    lobby?: Lobby;
}

function LobbyForm(props: IProps) {
    const authStorage = new AuthStorage();
    const lobbyService = new LobbyService();
    const [lobbyName, setLobbyName] = useState(
        props.lobby ? props.lobby.name : ''
    );
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const loggedInUser = authStorage.getLoggedInUser();
        if (loggedInUser) {
            // TODO handle validation in a seperate function.
            if (lobbyName) {
                // TODO check if a new lobby is required or if an old one is updated.
                lobbyService
                    .create(new Lobby(lobbyName, loggedInUser))
                    .then(() => {
                        navigate('/lobbies');
                    });
            }
        } else {
            navigate('/');
        }
    }

    return (
        <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col"
        >
            <div className="flex flex-row">
                <label className="flex items-center">
                    <span>Lobby name</span>
                    <Input
                        value={lobbyName}
                        onChange={(event) => setLobbyName(event.target.value)}
                        type="text"
                    ></Input>
                </label>
            </div>
            <div className="flex flex-row">
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}

export default LobbyForm;
