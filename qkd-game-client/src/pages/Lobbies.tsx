import LobbyTable from '../components/LobbyTable';
import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import Button from '../components/Button';
import { HiRefresh } from 'react-icons/hi';
import LobbiesService from '../services/LobbyService';
import Lobby from '../models/Lobby';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../helper/IO';

function Lobbies() {
    const lobbiesService = new LobbiesService();
    const [lobbies, setLobbies] = useState(new Array<Lobby>());
    const navigate = useNavigate();
    // Try opening socket here to reduce the number of failures.
    useSocket();

    useEffect(() => {
        refreshLobbies();
    }, []);

    function refreshLobbies() {
        lobbiesService.getAll().then(
            (res) => {
                setLobbies(res);
            },
            (err) => {
                console.error(err);
            }
        );
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <h1 className="text-3xl font-mono py-3">Lobbies</h1>

                <div className="relative">
                    <div className="py-4 flex justify-between">
                        <Button
                            className="flex items-center"
                            type="button"
                            onClick={() => {
                                // TODO maybe add loader to table
                                refreshLobbies();
                            }}
                        >
                            <HiRefresh></HiRefresh>
                            <span className="ml-1">Refresh</span>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                navigate('/lobbies/new');
                            }}
                        >
                            New Game
                        </Button>
                    </div>
                    <LobbyTable lobbies={lobbies}></LobbyTable>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default Lobbies;
