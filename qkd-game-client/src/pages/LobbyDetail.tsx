import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import Lobby from '../models/Lobby';
import LobbiesService from '../services/LobbyService';

function LobbyDetail() {
    const params = useParams();
    const lobbyId = params.lobbyId;
    const lobbiesService = new LobbiesService();
    const [lobby, setLobby] = useState<Lobby>();

    useEffect(() => {
        refreshLobbies();
    }, []);

    function refreshLobbies() {
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
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
