import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CodeComparator from '../components/game/CodeComparator';
import DecisionCommunicator from '../components/game/DecisionCommunicator';
import NoteTable from '../components/game/NoteTable';
import Photon from '../components/game/Photon';
import Receiver from '../components/game/Receiver';
import MessageLog from '../components/MessageLog';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import Randomizer from '../helper/Randomizer';
import BASIS from '../models/api/Basis';
import IBasisComparisonData from '../models/api/IBasisComparisonData';
import IQbitDiscardData from '../models/api/IQbitDiscardedData';
import POLARIZATION from '../models/api/Polarization';
import Game from '../models/Game';
import Qbit from '../models/quantum/Qbit';
import GameService from '../services/GameServices';

function GameBob() {
    const params = useParams();
    const socket = useSocket();
    const gameService = new GameService();
    const [receivedPhoton, setReceivedPhoton] = useState<React.ReactNode>(null);
    const [measuredPolarization, setMeasuredPolarization] =
        useState<POLARIZATION | null>(null);
    const [showPolarization, setShowPolarization] = useState<
        POLARIZATION | undefined
    >(undefined);
    const [isMeasuredPhotonTransported, setIsMeasuredPhotonTransported] =
        useState(false);
    const gameId = params.gameId;
    const [messages, setMessages] = useState<string[]>([]);
    const [game, setGame] = useState<Game>();
    const [code, setCode] = useState<string>('');
    const [codeComperatorDisabled, setCodeComperatorDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadGame();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.then((s) => {
                s.on('qbitEnqueued', qbitEnqueuedHandler);
                s.on('basisPublished', appendBasisComparisonMessage);
            });

            return () => {
                socket.then((s) => {
                    s.off('qbitEnqueued', qbitEnqueuedHandler);
                    s.off('basisPublished', appendBasisComparisonMessage);
                });
            };
        }
    }, [socket]);

    useEffect(() => {
        if (measuredPolarization !== null && isMeasuredPhotonTransported) {
            setShowPolarization(measuredPolarization);
        }
    }, [measuredPolarization, isMeasuredPhotonTransported]);

    useEffect(() => {
        if (socket) {
            socket.then((s) => {
                s.on('playerLeftGame', leaveGame);
            });

            return () => {
                socket.then((s) => {
                    s.off('playerLeftGame', leaveGame);
                    if (gameId) {
                        s.emit('leaveGame', gameId);
                    }
                });
            };
        }
    }, [socket, gameId]);

    function leaveGame() {
        // TODO show popup that a player left the game.
        navigate(`/lobbies`);
    }

    function loadGame() {
        if (gameId) {
            gameService.get(gameId).then(
                (res) => {
                    setGame(res);
                },
                (err) => {
                    console.error(err);
                }
            );
        }
    }

    function appendMessage(message: string) {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function appendBasisComparisonMessage(
        basisComparison: IBasisComparisonData
    ) {
        let readableBasis = '';
        switch (basisComparison.basis) {
            case BASIS.diagonal:
                readableBasis = 'diagonal';
                break;
            case BASIS.horizontalVertical:
                readableBasis = 'horizontal-vertical';
                break;
        }
        appendMessage(
            `Alice: Qubit no. ${basisComparison.qbitNo} was sent with ${readableBasis} basis.`
        );
    }

    function appendQbitDiscardMessage(qbitDiscard: IQbitDiscardData) {
        if (qbitDiscard.isDiscarded) {
            appendMessage(
                `You: I used a different basis than Alice for qubit no. ${qbitDiscard.qbitNo} - discard it.`
            );
        } else {
            appendMessage(
                `You: I used the same basis than Alice for qubit no. ${qbitDiscard.qbitNo} - keep it.`
            );
        }

        if (game?.noOfQbits && qbitDiscard.qbitNo >= game.noOfQbits) {
            setCodeComperatorDisabled(false);
        }
    }

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
            socket?.then((s) => {
                s.emit('measureEnqueuedQbit', gameId, basis, (polarization) => {
                    if (polarization !== undefined) {
                        setMeasuredPolarization(polarization);
                    }
                });
            });
        }
    }

    function handleMeasuredPhotonTransported() {
        setIsMeasuredPhotonTransported(true);
    }

    function handleKeepButtonClicked(curQbitNo: number) {
        if (gameId) {
            const qbitDiscard = {
                qbitNo: curQbitNo,
                isDiscarded: false,
            };
            socket?.then((s) => {
                s.emit(
                    'publishDiscard',
                    gameId,
                    qbitDiscard,
                    appendQbitDiscardMessage
                );
            });
        }
    }

    function handleDiscardButtonClicked(curQbitNo: number) {
        if (gameId) {
            const qbitDiscard = {
                qbitNo: curQbitNo,
                isDiscarded: true,
            };
            socket?.then((s) => {
                s.emit(
                    'publishDiscard',
                    gameId,
                    qbitDiscard,
                    appendQbitDiscardMessage
                );
            });
        }
    }

    function handleCodeComperatorSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (gameId) {
            socket?.then((s) => {
                s.emit('publishCode', gameId, code, () => {
                    if (gameId) {
                        navigate(`/games/${gameId}/compare`);
                    }
                });
            });
        }
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <div className="flex justify-between">
                    <div className="flex-none">
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
                    </div>
                    <div className="flex flex-col flex-1 w-full min-w-0 ml-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-initial w-full min-w-0">
                                <div className="flex overflow-x-auto overflow-y-hidden pt-11 pb-20 pl-2 pr-20 border-2 shadow-inner">
                                    <NoteTable
                                        noOfQubits={
                                            game?.noOfQbits
                                                ? game?.noOfQbits
                                                : 0
                                        }
                                    ></NoteTable>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6">
                            <CodeComparator
                                disabled={codeComperatorDisabled}
                                value={code}
                                onChange={setCode}
                                handleSubmit={handleCodeComperatorSubmit}
                            ></CodeComparator>
                        </div>
                        <div className="flex mt-10">
                            <div className="flex-1 mr-6">
                                <div className="p-2 shadow-inner border-2">
                                    <DecisionCommunicator
                                        text={
                                            'Did you use the same basis as Alice for qubit no. ...?'
                                        }
                                        onButtonOneClicked={
                                            handleKeepButtonClicked
                                        }
                                        onButtonTwoClicked={
                                            handleDiscardButtonClicked
                                        }
                                        buttonOneContent={<div>Same</div>}
                                        buttonTwoContent={<div>Different</div>}
                                        noOfQbits={
                                            game?.noOfQbits ? game.noOfQbits : 1
                                        }
                                    ></DecisionCommunicator>
                                </div>
                            </div>
                            <div className="flex-initial w-full">
                                <MessageLog messages={messages}></MessageLog>
                            </div>
                        </div>
                    </div>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameBob;
