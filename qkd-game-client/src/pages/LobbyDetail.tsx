import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Button from '../components/Button';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import IO from '../helper/IO';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
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
    let socket: Socket<IServerToClientEvents, IClientToServerEvents>;

    useEffect(() => {
        chatTextRef.current = chatText;
    });

    useEffect(() => {
        refreshLobbies();
        socket = IO.getInstance().socket;

        const chatMessageHandler = (message: string) => {
            console.log(`${chatTextRef.current}`);
            setChatText(`${chatTextRef.current} ${message}`);
        };
        socket.on('chatMessage', chatMessageHandler);
        return () => {
            socket.off('chatMessage', chatMessageHandler);
        };
    }, []);

    function refreshLobbies() {
        if (lobbyId) {
            lobbiesService.get(lobbyId).then(
                (res) => {
                    setLobby(res);
                    socket.emit('joinRoom', lobbyId);
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
                <span>{chatText}</span>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
