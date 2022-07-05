import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Photon from '../components/game/Photon';
import Receiver from '../components/game/Receiver';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import Randomizer from '../helper/Randomizer';
import POLARIZATION from '../models/api/Polarization';
import Qbit from '../models/quantum/Qbit';

function GameBob() {
    const params = useParams();
    const socket = useSocket();
    const [receivedPhoton, setReceivedPhoton] = useState<React.ReactNode>(null);
    const gameId = params.gameId;

    useEffect(() => {
        if (socket) {
            socket.on('qbitEnqueued', qbitEnqueuedHandler);
            return () => {
                socket.off('qbitEnqueued', qbitEnqueuedHandler);
            };
        }
    }, [socket]);

    function qbitEnqueuedHandler() {
        setReceivedPhoton(
            <Photon qbit={new Qbit(Randomizer.getRandomEnum(POLARIZATION))} />
        );
    }

    // TODO up next: Add basis wheel, as soon as the photon passes send the request,
    // Then let the photon pass through the next cable, then add a box with 2 leds
    // and let the one corresponding light up as soon as the request is resolved.

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <Receiver
                    receivedPhoton={receivedPhoton}
                    onReceivedPhotonTransported={function (): void {
                        console.log('end of transport');
                    }}
                ></Receiver>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameBob;
