import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Photon from '../components/game/Photon';
import Receiver from '../components/game/Receiver';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import Randomizer from '../helper/Randomizer';
import BASIS from '../models/api/Basis';
import POLARIZATION from '../models/api/Polarization';
import Qbit from '../models/quantum/Qbit';

function GameBob() {
    const params = useParams();
    const socket = useSocket();
    const [receivedPhoton, setReceivedPhoton] = useState<React.ReactNode>(null);
    const [measuredPolarization, setMeasuredPolarization] =
        useState<POLARIZATION | null>(null);
    const [showPolarization, setShowPolarization] = useState<
        POLARIZATION | undefined
    >(undefined);
    const [isMeasuredPhotonTransported, setIsMeasuredPhotonTransported] =
        useState(false);
    const gameId = params.gameId;

    useEffect(() => {
        if (socket) {
            socket.on('qbitEnqueued', qbitEnqueuedHandler);
            return () => {
                socket.off('qbitEnqueued', qbitEnqueuedHandler);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (measuredPolarization !== null && isMeasuredPhotonTransported) {
            setShowPolarization(measuredPolarization);
        }
    }, [measuredPolarization, isMeasuredPhotonTransported]);

    function qbitEnqueuedHandler() {
        setReceivedPhoton(
            <Photon qbit={new Qbit(Randomizer.getRandomEnum(POLARIZATION))} />
        );
        setMeasuredPolarization(null);
        setShowPolarization(undefined);
        setIsMeasuredPhotonTransported(false);
    }

    function handlePhotonPassing(basis: BASIS) {
        if (gameId) {
            socket?.emit(
                'measureEnqueuedQbit',
                gameId,
                basis,
                (polarization) => {
                    if (polarization !== undefined) {
                        setMeasuredPolarization(polarization);
                    }
                }
            );
        }
    }

    function handleMeasuredPhotonTransported() {
        setIsMeasuredPhotonTransported(true);
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <Receiver
                    receivedPhoton={receivedPhoton}
                    showPolarization={showPolarization}
                    onReceivedPhotonTransported={function (): void {
                        setReceivedPhoton(null);
                    }}
                    onPhotonPassing={handlePhotonPassing}
                    onMeasuredPhotonTransported={
                        handleMeasuredPhotonTransported
                    }
                ></Receiver>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameBob;
