import React, { useEffect, useState } from 'react';
import { FaArrowsAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
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

function GameAlice() {
    const params = useParams();
    const socket = useSocket();
    const gameService = new GameService();
    const [messages, setMessages] = useState<string[]>([]);
    const gameId = params.gameId;
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        loadGame();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('discardPublished', appendQbitDiscardMessage);
            return () => {
                socket.off('discardPublished', appendQbitDiscardMessage);
            };
        }
    }, [socket]);

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

    function handlePolarizedPhotonTransported(qbit: Qbit) {
        if (gameId) {
            socket?.emit('sendQbit', gameId, qbit.toJson());
        }
    }

    // TODO set correct qbit numbers!
    function handleHorizontalVerticalBasisButtonClicked() {
        if (gameId) {
            const basisComparison = {
                qbitNo: 1,
                basis: BASIS.horizontalVertical,
            };
            socket?.emit(
                'publishBasis',
                gameId,
                basisComparison,
                appendBasisComparisonMessage
            );
        }
    }

    // TODO set correct qbit numbers!
    function handleDiagonalBasisButtonClicked() {
        if (gameId) {
            const basisComparison = {
                qbitNo: 1,
                basis: BASIS.diagonal,
            };
            socket?.emit(
                'publishBasis',
                gameId,
                basisComparison,
                appendBasisComparisonMessage
            );
        }
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
            `You: Qubit no. ${basisComparison.qbitNo} was sent with ${readableBasis} basis.`
        );
    }

    function appendQbitDiscardMessage(qbitDiscard: IQbitDiscardData) {
        if (qbitDiscard.isDiscarded) {
            appendMessage(`Bob: Discard qubit no. ${qbitDiscard.qbitNo}.`);
        } else {
            appendMessage(`Bob: Keep qubit no. ${qbitDiscard.qbitNo}.`);
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
                        <div className="flex mt-10">
                            <div className="flex-none mr-6 w-44">
                                <div className="p-2 shadow-inner border-2">
                                    <DecisionCommunicator
                                        text={
                                            'Which basis was used for qubit no i?'
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
                                    ></DecisionCommunicator>
                                </div>
                            </div>
                            <div className="flex-1">
                                <MessageLog messages={messages}></MessageLog>
                            </div>
                        </div>
                    </div>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameAlice;
