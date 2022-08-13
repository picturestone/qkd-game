import React, { useEffect, useState } from 'react';
import { FaArrowsAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import DecisionCommunicator from '../components/game/DecisionCommunicator';
import NoteTable from '../components/game/NoteTable';
import PolarizationTable from '../components/game/PolarizationTable';
import Sender from '../components/game/Sender';
import MessageLog from '../components/MessageLog';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import Qbit from '../models/quantum/Qbit';
import BASIS from '../models/api/Basis';
import IBasisComparisonData from '../models/api/IBasisComparisonData';
import IQbitDiscardData from '../models/api/IQbitDiscardedData';
import GameService from '../services/GameServices';
import Game from '../models/Game';
import POLARIZATION from '../models/api/Polarization';
import Photon from '../components/game/Photon';
import Randomizer from '../helper/Randomizer';
import Receiver from '../components/game/Receiver';
import CodeComparator from '../components/game/CodeComparator';

function GameEve() {
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
    const [messages, setMessages] = useState<string[]>([]);
    const gameId = params.gameId;
    const [game, setGame] = useState<Game>();
    const [code, setCode] = useState<string>('');
    const [codeComperatorDisabled, setCodeComperatorDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadGame();
    }, []);

    // game state is used in handler, which makes it a dependency.
    useEffect(() => {
        if (socket && game) {
            socket.on('discardPublished', appendReceivedQbitDiscardMessage);
            return () => {
                socket.off(
                    'discardPublished',
                    appendReceivedQbitDiscardMessage
                );
            };
        }
    }, [socket, game]);

    useEffect(() => {
        if (socket) {
            socket.on('qbitEnqueued', qbitEnqueuedHandler);
            socket.on('basisPublished', appendReceivedBasisComparisonMessage);
            return () => {
                socket.off('qbitEnqueued', qbitEnqueuedHandler);
                socket.off(
                    'basisPublished',
                    appendReceivedBasisComparisonMessage
                );
            };
        }
    }, [socket]);

    useEffect(() => {
        if (measuredPolarization !== null && isMeasuredPhotonTransported) {
            setShowPolarization(measuredPolarization);
        }
    }, [measuredPolarization, isMeasuredPhotonTransported]);

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

    function getReadableBasis(basis: BASIS) {
        let readableBasis = '';
        switch (basis) {
            case BASIS.diagonal:
                readableBasis = 'diagonal';
                break;
            case BASIS.horizontalVertical:
                readableBasis = 'horizontal-vertical';
                break;
        }
        return readableBasis;
    }

    function appendReceivedBasisComparisonMessage(
        basisComparison: IBasisComparisonData
    ) {
        const readableBasis = getReadableBasis(basisComparison.basis);
        appendMessage(
            `Alice to you: Qubit no. ${basisComparison.qbitNo} was sent with ${readableBasis} basis.`
        );
    }

    function appendSentBasisComparisonMessage(
        basisComparison: IBasisComparisonData
    ) {
        const readableBasis = getReadableBasis(basisComparison.basis);
        appendMessage(
            `You to Bob: Qubit no. ${basisComparison.qbitNo} was sent with ${readableBasis} basis.`
        );
    }

    function appendReceivedQbitDiscardMessage(qbitDiscard: IQbitDiscardData) {
        if (qbitDiscard.isDiscarded) {
            appendMessage(
                `Bob to you: I used a different basis than you for qubit no. ${qbitDiscard.qbitNo} - discard it.`
            );
        } else {
            appendMessage(
                `Bob to you: I used the same basis than you for qubit no. ${qbitDiscard.qbitNo} - keep it.`
            );
        }
    }

    function appendSentQbitDiscardMessage(qbitDiscard: IQbitDiscardData) {
        if (qbitDiscard.isDiscarded) {
            appendMessage(
                `You to Alice: I used a different basis than you for qubit no. ${qbitDiscard.qbitNo} - discard it.`
            );
        } else {
            appendMessage(
                `You to Alice: I used the same basis than you for qubit no. ${qbitDiscard.qbitNo} - keep it.`
            );
        }

        if (game?.noOfQbits && qbitDiscard.qbitNo >= game.noOfQbits) {
            setCodeComperatorDisabled(false);
        }
    }

    function handlePolarizedPhotonTransported(qbit: Qbit) {
        if (gameId) {
            socket?.emit('sendQbit', gameId, qbit.toJson());
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

    function handleHorizontalVerticalBasisButtonClicked(curQbitNo: number) {
        if (gameId) {
            const basisComparison = {
                qbitNo: curQbitNo,
                basis: BASIS.horizontalVertical,
            };
            socket?.emit(
                'publishBasis',
                gameId,
                basisComparison,
                appendSentBasisComparisonMessage
            );
        }
    }

    function handleDiagonalBasisButtonClicked(curQbitNo: number) {
        if (gameId) {
            const basisComparison = {
                qbitNo: curQbitNo,
                basis: BASIS.diagonal,
            };
            socket?.emit(
                'publishBasis',
                gameId,
                basisComparison,
                appendSentBasisComparisonMessage
            );
        }
    }

    function handleKeepButtonClicked(curQbitNo: number) {
        if (gameId) {
            const qbitDiscard = {
                qbitNo: curQbitNo,
                isDiscarded: false,
            };
            socket?.emit(
                'publishDiscard',
                gameId,
                qbitDiscard,
                appendSentQbitDiscardMessage
            );
        }
    }

    function handleDiscardButtonClicked(curQbitNo: number) {
        if (gameId) {
            const qbitDiscard = {
                qbitNo: curQbitNo,
                isDiscarded: true,
            };
            socket?.emit(
                'publishDiscard',
                gameId,
                qbitDiscard,
                appendSentQbitDiscardMessage
            );
        }
    }

    function handleCodeComperatorSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (gameId) {
            socket?.emit('publishCode', gameId, code, () => {
                if (gameId) {
                    navigate(`/games/${gameId}/result`);
                }
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
                    <div className="flex-none">
                        <Sender
                            onPolarizedPhotonTransported={
                                handlePolarizedPhotonTransported
                            }
                        />
                    </div>
                    <div className="flex flex-col flex-1 w-full min-w-0 ml-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-initial mr-6 w-full min-w-0">
                                <div className="flex overflow-x-auto overflow-y-hidden pt-11 pb-20 pl-2 pr-20 border-2 shadow-inner">
                                    <NoteTable
                                        noOfQubits={
                                            game?.noOfQbits ? game.noOfQbits : 0
                                        }
                                    ></NoteTable>
                                </div>
                            </div>
                            <div className="flex-none py-10">
                                <PolarizationTable></PolarizationTable>
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
                            <div className="flex flex-col items-stretch flex-1 mr-6">
                                <div className="p-2 shadow-inner border-2 mb-5">
                                    <DecisionCommunicator
                                        text={
                                            'Which basis was used for qubit no. ...?'
                                        }
                                        onButtonOneClicked={
                                            handleHorizontalVerticalBasisButtonClicked
                                        }
                                        onButtonTwoClicked={
                                            handleDiagonalBasisButtonClicked
                                        }
                                        buttonOneContent={
                                            <div>
                                                <FaArrowsAlt />
                                            </div>
                                        }
                                        buttonTwoContent={
                                            <div
                                                style={{
                                                    transform: 'rotate(45deg)',
                                                }}
                                            >
                                                <FaArrowsAlt />
                                            </div>
                                        }
                                        noOfQbits={
                                            game?.noOfQbits ? game.noOfQbits : 1
                                        }
                                    ></DecisionCommunicator>
                                </div>
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
                                {/* TODO place compare code button here which opens popup. Should activat once last qbit discard message arrived */}
                            </div>
                            <div className="flex-initial w-full">
                                <MessageLog
                                    messages={messages}
                                    className="h-full"
                                ></MessageLog>
                            </div>
                        </div>
                    </div>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameEve;
