import { AxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import MessageLog from '../components/MessageLog';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import AuthStorage from '../helper/AuthStorage';
import { useSocket } from '../helper/IO';
import IGameJson from '../models/api/IGameJson';
import ILobbyJson from '../models/api/ILobbyJson';
import { PLAYERROLE } from '../models/api/PlayerRole';
import Game from '../models/Game';
import Lobby from '../models/Lobby';
import LobbiesService from '../services/LobbyService';

function LobbyDetail() {
    const authStorage = new AuthStorage();
    const loggedInUser = authStorage.getLoggedInUser();
    const params = useParams();
    const socket = useSocket();
    const lobbyId = params.lobbyId;
    const lobbiesService = new LobbiesService();
    const navigate = useNavigate();
    const isLeavingLobbyOnCleanup = useRef(true);
    const [lobby, setLobby] = useState<Lobby>();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        loadLobby();
    }, []);

    useEffect(() => {
        if (socket && !socket.connected) {
            socket?.connect();
        }
    }, [socket]);

    useEffect(() => {
        if (socket && lobbyId) {
            socket.on('updatedLobby', updatedLobbyHandler);
            socket.on('chatMessage', appendMessage);
            socket.on('ownerLeftLobby', leaveLobby);

            return () => {
                socket.off('updatedLobby', updatedLobbyHandler);
                socket.off('chatMessage', appendMessage);
                socket.off('ownerLeftLobby', leaveLobby);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && lobbyId) {
            socket.emit('joinLobby', lobbyId);

            return () => {
                if (lobbyId && isLeavingLobbyOnCleanup.current) {
                    socket.emit('leaveLobby', lobbyId);
                }
            };
        }
    }, [socket, lobbyId]);

    useEffect(() => {
        if (socket && lobby) {
            socket.on('startedGame', startedGameHandler);
            return () => {
                socket.off('startedGame', startedGameHandler);
            };
        }
    }, [socket, lobby]);

    function appendMessage(message: string) {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function updatedLobbyHandler(lobbyJson: ILobbyJson) {
        setLobby(Lobby.fromJson(lobbyJson));
    }

    function startedGameHandler(gameJson: IGameJson) {
        const game = Game.fromJson(gameJson);
        isLeavingLobbyOnCleanup.current = false;
        navigate(`/games/${game.id}/${lobby?.selectedRole}`);
    }

    function selectLobbyRole(lobbyRole: PLAYERROLE | undefined) {
        if (lobby && lobby.id) {
            socket?.emit('selectLobbyRole', lobby.id, lobbyRole);
        }
    }

    function leaveLobby() {
        // TODO show popup that the lobby does not exist anymore after redirecting to the lobby browser.
        navigate(`/lobbies`);
    }

    function loadLobby() {
        if (lobbyId) {
            lobbiesService.get(lobbyId).then(
                (res) => {
                    setLobby(res);
                },
                (err: AxiosError) => {
                    if (err.response?.status === 404) {
                        leaveLobby();
                    } else {
                        console.log(err);
                    }
                }
            );
        }
    }

    function getButton() {
        let button: JSX.Element = <div></div>;

        if (lobby?.owner.id === loggedInUser?.id) {
            button = (
                <Button
                    onClick={() => {
                        if (lobby && lobby.id) {
                            socket?.emit('startGame', lobby.id);
                        }
                    }}
                >
                    Start Game
                </Button>
            );
        } else {
            button = <Button disabled={true}>Wait for host to start</Button>;
        }

        return button;
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <h1 className="text-3xl font-mono py-3">{lobby?.name}</h1>
                <div className="flex flex-col items-stretch w-1/2">
                    <div className="flex mb-10 items-center">
                        <div className="w-1/3 flex-none">Select your role:</div>
                        <div className="w-2/3 flex-none flex flex-col items-start">
                            <Button
                                className="mb-1"
                                onClick={() => {
                                    selectLobbyRole(PLAYERROLE.alice);
                                }}
                                disabled={lobby?.reservedAlice ? true : false}
                            >
                                {lobby?.reservedAlice
                                    ? lobby.selectedRole === PLAYERROLE.alice
                                        ? `You play as `
                                        : `${lobby.reservedAlice.name} plays as `
                                    : ''}
                                Alice
                            </Button>
                            {lobby?.isEveAllowed ? (
                                <Button
                                    className="mb-1"
                                    onClick={() => {
                                        selectLobbyRole(PLAYERROLE.eve);
                                    }}
                                    disabled={lobby?.reservedEve ? true : false}
                                >
                                    {lobby?.reservedEve
                                        ? lobby.selectedRole === PLAYERROLE.eve
                                            ? `You play as `
                                            : `${lobby.reservedEve.name} plays as `
                                        : ''}
                                    Eve
                                </Button>
                            ) : (
                                ''
                            )}
                            <Button
                                className="mb-1"
                                onClick={() => {
                                    selectLobbyRole(PLAYERROLE.bob);
                                }}
                                disabled={lobby?.reservedBob ? true : false}
                            >
                                {lobby?.reservedBob
                                    ? lobby.selectedRole === PLAYERROLE.bob
                                        ? `You play as `
                                        : `${lobby.reservedBob.name} plays as `
                                    : ''}
                                Bob
                            </Button>
                            <Button
                                onClick={() => {
                                    selectLobbyRole(undefined);
                                }}
                            >
                                Deselect
                            </Button>
                        </div>
                    </div>
                    <div className="flex mb-6">
                        <div className="w-1/3 flex-none"></div>
                        <div className="w-2/3 flex-none">{getButton()}</div>
                    </div>
                </div>
                <MessageLog messages={messages}></MessageLog>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
