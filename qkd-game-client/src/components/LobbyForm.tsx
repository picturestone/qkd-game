import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStorage from '../helper/AuthStorage';
import Lobby from '../models/Lobby';
import LobbyService from '../services/LobbyService';
import Button from './Button';
import Checkbox from './Checkbox';
import Input from './Input';
import NumberInput from './NumberInput';

interface IProps {
    lobby?: Lobby;
}

function LobbyForm(props: IProps) {
    const authStorage = new AuthStorage();
    const loggedInUser = authStorage.getLoggedInUser();
    const lobbyService = new LobbyService();
    let initialLobbyName = '';
    if (props.lobby) {
        initialLobbyName = props.lobby.name;
    } else if (loggedInUser) {
        initialLobbyName = `${loggedInUser.name}s Lobby`;
    }

    const [lobbyName, setLobbyName] = useState(initialLobbyName);
    const [noOfQbits, setNoOfQbits] = useState(10);
    const [isEveAllowed, setIsEveAllowed] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loggedInUser) {
            // TODO handle validation in a seperate function.
            if (lobbyName) {
                // TODO check if a new lobby is required or if an old one is updated.
                lobbyService
                    .create(
                        new Lobby(
                            lobbyName,
                            loggedInUser,
                            noOfQbits,
                            isEveAllowed
                        )
                    )
                    .then((lobby) => {
                        navigate('/lobbies/' + lobby.id);
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
                <label className="flex items-center">
                    <span>No. of qbits</span>
                    <NumberInput
                        value={noOfQbits}
                        onChange={(newVal) => setNoOfQbits(newVal)}
                    ></NumberInput>
                </label>
            </div>
            <div className="flex flex-row">
                <Checkbox
                    defaultChecked={isEveAllowed}
                    onChange={() => {
                        setIsEveAllowed(!isEveAllowed);
                    }}
                >
                    Is Eve role allowed?
                </Checkbox>
            </div>
            <div className="flex flex-row">
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}

export default LobbyForm;
