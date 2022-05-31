import LobbyTable from '../components/LobbyTable';
import React from 'react';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';

function Lobbies() {
    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <h1 className="text-3xl font-mono py-3">Lobbies</h1>
                <LobbyTable></LobbyTable>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default Lobbies;
