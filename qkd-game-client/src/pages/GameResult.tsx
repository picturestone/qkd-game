import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import IGameResultsData from '../models/api/IGameResultsData';
import Typewriter from 'typewriter-effect';
import Button from '../components/Button';

function GameResult() {
    const params = useParams();
    const socket = useSocket();
    const gameId = params.gameId;
    const [aliceCode, setAliceCode] = useState<string>('');
    const [bobCode, setBobCode] = useState<string>('');
    const [eveCode, setEveCode] = useState<string | undefined>(undefined);
    const [isAliceThinkingEveListenedIn, setIsAliceThinkingEveListenedIn] =
        useState<boolean>(false);
    const [isBobThinkingEveListenedIn, setIsBobThinkingEveListenedIn] =
        useState<boolean>(false);
    const [isResultReceived, setIsResultReceived] = useState<boolean>(false);
    const [isResultShown, setIsResultShown] = useState<boolean>(false);
    const typewriterOptions = {
        delay: 50,
    };

    useEffect(() => {
        if (socket) {
            socket.on('resultsPublished', setDataFromResults);
            return () => {
                socket.off('resultsPublished', setDataFromResults);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && gameId) {
            socket.emit('getPublishedResults', gameId, setDataFromResults);
        }
    }, [socket, gameId]);

    function setDataFromResults(results: IGameResultsData) {
        setAliceCode(results.aliceCode);
        setBobCode(results.bobCode);
        setEveCode(results.eveCode);
        setIsAliceThinkingEveListenedIn(results.isAliceThinkingEveListenedIn);
        setIsBobThinkingEveListenedIn(results.isBobThinkingEveListenedIn);
        setIsResultReceived(true);
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <div className="flex flex-col mt-3 font-mono">
                    <div className="text-3xl">Results</div>
                    {isResultReceived ? (
                        <div className="mt-4">
                            <Typewriter
                                options={typewriterOptions}
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString('hello')
                                        .pauseFor(1000)
                                        .callFunction(() => {
                                            setIsResultShown(true);
                                        })
                                        .start();
                                }}
                            />
                        </div>
                    ) : (
                        ''
                    )}
                    {isResultShown ? <Button>TODO Back to lobbies</Button> : ''}
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameResult;
