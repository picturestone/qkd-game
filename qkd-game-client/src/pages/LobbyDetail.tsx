import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import IGameJson from '../models/api/IGameJson';
import ILobbyJson from '../models/api/ILobbyJson';
import { PLAYERROLE } from '../models/api/PlayerRole';
import Game from '../models/Game';
import Lobby from '../models/Lobby';
import LobbiesService from '../services/LobbyService';

function LobbyDetail() {
    const params = useParams();
    const socket = useSocket();
    const lobbyId = params.lobbyId;
    const lobbiesService = new LobbiesService();
    const navigate = useNavigate();
    const [lobby, setLobby] = useState<Lobby>();
    const [chatText, setChatText] = useState('');
    // Ref necessary because we want to register event handlers only once, but have a dependecy to chatText.
    // Adding chatText as a dependency would repeatetly register the handler with every chatText update.
    const chatTextRef = React.useRef(chatText);

    useEffect(() => {
        chatTextRef.current = chatText;
    });

    useEffect(() => {
        loadLobby();
    }, []);

    useEffect(() => {
        if (socket && lobby?.id) {
            socket.on('updatedLobby', updatedLobbyHandler);
            socket.on('chatMessage', chatMessageHandler);
            socket.on('startedGame', startedGameHandler);
            socket.emit('joinLobby', lobby.id);
            return () => {
                socket.off('updatedLobby', updatedLobbyHandler);
                socket.off('chatMessage', chatMessageHandler);
                socket.off('startedGame', startedGameHandler);
            };
        }
    }, [socket, lobby]);

    function chatMessageHandler(message: string) {
        setChatText(`${chatTextRef.current} ${message}`);
    }

    function updatedLobbyHandler(lobbyJson: ILobbyJson) {
        setLobby(Lobby.fromJson(lobbyJson));
    }

    function startedGameHandler(gameJson: IGameJson) {
        const game = Game.fromJson(gameJson);
        navigate(`/games/${game.id}/${lobby?.selectedRole}`);
    }

    function selectLobbyRole(lobbyRole: PLAYERROLE) {
        if (lobby && lobby.id) {
            socket?.emit('selectLobbyRole', lobby.id, lobbyRole);
        }
    }

    function loadLobby() {
        if (lobbyId) {
            lobbiesService.get(lobbyId).then(
                (res) => {
                    setLobby(res);
                },
                (err) => {
                    console.error(err);
                }
            );
        }
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <h1 className="text-3xl font-mono py-3">{lobby?.name}</h1>
                <Button
                    onClick={() => {
                        selectLobbyRole(PLAYERROLE.alice);
                    }}
                    disabled={lobby?.reservedAlice ? true : false}
                >
                    {lobby?.reservedAlice
                        ? lobby.selectedRole === PLAYERROLE.alice
                            ? `You play as `
                            : `${lobby.reservedAlice.name} plays as `
                        : 'Select role: '}
                    Alice
                </Button>
                <Button
                    onClick={() => {
                        selectLobbyRole(PLAYERROLE.bob);
                    }}
                    disabled={lobby?.reservedBob ? true : false}
                >
                    {lobby?.reservedBob
                        ? lobby.selectedRole === PLAYERROLE.bob
                            ? `You play as `
                            : `${lobby.reservedBob.name} plays as `
                        : 'Select role: '}
                    Bob
                </Button>
                {/* TODO make a "ready" feature for the player that are not hosting the lobby. */}
                <Button
                    onClick={() => {
                        if (lobby) {
                            lobbiesService.startGame(lobby);
                        }
                    }}
                >
                    Start Game
                </Button>
                <span>{chatText}</span>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
