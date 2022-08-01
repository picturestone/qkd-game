import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteTable from '../components/game/NoteTable';
import Sender from '../components/game/Sender';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import Qbit from '../models/quantum/Qbit';

function GameAlice() {
    const params = useParams();
    const socket = useSocket();
    const gameId = params.gameId;

    function handlePolarizedPhotonTransported(qbit: Qbit) {
        if (gameId) {
            socket?.emit('sendQbit', gameId, qbit.toJson());
        }
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <Sender
                    onPolarizedPhotonTransported={
                        handlePolarizedPhotonTransported
                    }
                />
                <NoteTable noOfQubits={10}></NoteTable>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameAlice;
