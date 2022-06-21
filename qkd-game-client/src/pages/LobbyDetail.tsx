import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import AuthStorage from '../helper/AuthStorage';
import getSocket from '../helper/IO';
import ILobbyJson from '../models/api/ILobbyJson';
import Lobby from '../models/Lobby';
import LobbiesService from '../services/LobbyService';

function LobbyDetail() {
    const params = useParams();
    const lobbyId = params.lobbyId;
    const lobbiesService = new LobbiesService();
    const [lobby, setLobby] = useState<Lobby>();
    const [chatText, setChatText] = useState('');
    // Ref necessary because we want to register event handlers only once, but have a dependecy to chatText.
    // Adding chatText as a dependency would repeatetly register the handler with every chatText update.
    const chatTextRef = React.useRef(chatText);
    const socket = getSocket();

    useEffect(() => {
        chatTextRef.current = chatText;
    });

    useEffect(() => {
        refreshLobbies();

        socket.on('updatedLobby', updatedLobbyHandler);
        socket.on('chatMessage', chatMessageHandler);
        return () => {
            socket.off('updatedLobby', updatedLobbyHandler);
            socket.off('chatMessage', chatMessageHandler);
        };
    }, []);

    function chatMessageHandler(message: string) {
        setChatText(`${chatTextRef.current} ${message}`);
    }

    function updatedLobbyHandler(lobbyJson: ILobbyJson) {
        setLobby(Lobby.fromJson(lobbyJson));
    }

    function selectLobbyRole(lobbyRole: 'alice' | 'bob') {
        if (lobby && lobby.id) {
            socket.emit('selectLobbyRole', lobby.id, lobbyRole);
        }
    }

    function refreshLobbies() {
        if (lobbyId) {
            lobbiesService.get(lobbyId).then(
                (res) => {
                    setLobby(res);
                    socket.emit('joinLobby', lobbyId);
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
                        selectLobbyRole('alice');
                    }}
                    disabled={lobby?.reservedAlice ? true : false}
                >
                    {lobby?.reservedAlice
                        ? lobby.reservedAlice.id ==
                          new AuthStorage().getLoggedInUser()?.id
                            ? `You play as `
                            : `${lobby.reservedAlice.name} plays as `
                        : 'Select role: '}
                    Alice
                </Button>
                <Button
                    onClick={() => {
                        selectLobbyRole('bob');
                    }}
                    disabled={lobby?.reservedBob ? true : false}
                >
                    {lobby?.reservedBob
                        ? lobby.reservedBob.id ==
                          new AuthStorage().getLoggedInUser()?.id
                            ? `You play as `
                            : `${lobby.reservedBob.name} plays as `
                        : 'Select role: '}
                    Bob
                </Button>
                <span>{chatText}</span>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
