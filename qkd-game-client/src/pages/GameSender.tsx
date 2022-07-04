import React from 'react';
import Sender from '../components/game/Sender';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';

function GameSender() {
    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <Sender />
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameSender;
