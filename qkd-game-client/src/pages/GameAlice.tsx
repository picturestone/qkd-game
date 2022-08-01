import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteTable from '../components/game/NoteTable';
import PolarizationTable from '../components/game/PolarizationTable';
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
                <div className="flex justify-between">
                    <div className="flex-none">
                        <Sender
                            onPolarizedPhotonTransported={
                                handlePolarizedPhotonTransported
                            }
                        />
                    </div>
                    <div className="flex flex-1 justify-between ml-6 w-full min-w-0 items-start">
                        <div className="flex-initial mr-6 w-full min-w-0">
                            <div className="flex overflow-x-auto overflow-y-hidden pt-11 pb-20 pl-2 pr-20 border-2 shadow-inner">
                                <NoteTable noOfQubits={20}></NoteTable>
                            </div>
                        </div>
                        <div className="flex-none py-10">
                            <PolarizationTable></PolarizationTable>
                        </div>
                    </div>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameAlice;
