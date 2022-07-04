import React from 'react';
import { useParams } from 'react-router-dom';
import Sender from '../components/game/Sender';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';

function GameBob() {
    const params = useParams();
    const gameId = params.gameId;

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <span>Hello bob. Here the receiver will be!</span>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameBob;
