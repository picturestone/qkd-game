import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArcSelector from '../components/game/ArcSelector';
import Sender from '../components/game/Sender';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import BASIS from '../models/api/Basis';
import Qbit from '../models/quantum/Qbit';
import { FaArrowsAlt } from 'react-icons/fa';

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
                <ArcSelector<BASIS>
                    onArcSelected={(selectedArc: BASIS | null) => {
                        console.log(selectedArc);
                    }}
                    arcs={[
                        {
                            arcType: BASIS.horizontalVertical,
                            content: <FaArrowsAlt />,
                            contentRotation: 0,
                        },
                        {
                            arcType: BASIS.diagonal,
                            content: <FaArrowsAlt />,
                            contentRotation: 45,
                        },
                    ]}
                ></ArcSelector>

                <Sender
                    onPolarizedPhotonTransported={
                        handlePolarizedPhotonTransported
                    }
                />
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameAlice;
