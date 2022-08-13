import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import IGameResultsData from '../models/api/IGameResultsData';
import Typewriter from 'typewriter-effect';
import Button from '../components/Button';

interface IResult {
    aliceCode: string;
    bobCode: string;
    isAliceThinkingEveListenedIn: boolean;
    isBobThinkingEveListenedIn: boolean;
    eveCode?: string;
}

function GameResult() {
    const params = useParams();
    const socket = useSocket();
    const gameId = params.gameId;
    const [result, setResult] = useState<IResult | undefined>(undefined);
    const [isResultShown, setIsResultShown] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.then((s) => {
                s.on('allPlayersDoneWithGame', setDataFromResults);
            });
            return () => {
                socket.then((s) => {
                    s.off('allPlayersDoneWithGame', setDataFromResults);
                });
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && gameId && result === undefined) {
            socket.then((s) => {
                s.emit('getGameResults', gameId, (gameResultData) => {
                    if (gameResultData) {
                        setDataFromResults(gameResultData);
                    }
                });
            });
        }
    }, [socket, gameId, result]);

    function setDataFromResults(results: IGameResultsData) {
        if (result === undefined) {
            setResult({
                aliceCode: results.aliceCode,
                bobCode: results.bobCode,
                isAliceThinkingEveListenedIn:
                    results.isAliceThinkingEveListenedIn,
                isBobThinkingEveListenedIn: results.isBobThinkingEveListenedIn,
                eveCode: results.eveCode,
            });
        }
    }

    function getAliceListeningText() {
        return `Alice thinks Eve ${
            result?.isAliceThinkingEveListenedIn
                ? 'listend in'
                : 'did not listen in'
        } on the communication.`;
    }

    function getBobListeningText() {
        let text = '';
        if (
            result?.isAliceThinkingEveListenedIn &&
            !result?.isBobThinkingEveListenedIn
        ) {
            text = 'Bob does not think so.';
        } else if (
            !result?.isAliceThinkingEveListenedIn &&
            result?.isBobThinkingEveListenedIn
        ) {
            text =
                'Opposing this, Bob thinks Eve did listen in on their communication.';
        } else if (
            result?.isAliceThinkingEveListenedIn ===
            result?.isBobThinkingEveListenedIn
        ) {
            text = 'Bob agrees.';
        }
        return text;
    }

    function getEveListeningText() {
        let text = '';
        if (result?.eveCode) {
            if (
                !result?.isAliceThinkingEveListenedIn &&
                !result?.isBobThinkingEveListenedIn
            ) {
                text = 'They are wrong.';
            } else if (
                result?.isAliceThinkingEveListenedIn &&
                !result?.isBobThinkingEveListenedIn
            ) {
                text = 'Alice is right.';
            } else if (
                !result?.isAliceThinkingEveListenedIn &&
                result?.isBobThinkingEveListenedIn
            ) {
                text = 'Bob is right.';
            } else if (
                result?.isAliceThinkingEveListenedIn &&
                result?.isBobThinkingEveListenedIn
            ) {
                text = 'They are right.';
            }
        } else {
            if (
                !result?.isAliceThinkingEveListenedIn &&
                !result?.isBobThinkingEveListenedIn
            ) {
                text = 'They are right.';
            } else if (
                result?.isAliceThinkingEveListenedIn &&
                !result?.isBobThinkingEveListenedIn
            ) {
                text = 'Bob is right.';
            } else if (
                !result?.isAliceThinkingEveListenedIn &&
                result?.isBobThinkingEveListenedIn
            ) {
                text = 'Alice is right.';
            } else if (
                result?.isAliceThinkingEveListenedIn &&
                result?.isBobThinkingEveListenedIn
            ) {
                text = 'They are wrong.';
            }
        }
        return text;
    }

    function getEveCodeCompareText() {
        let text = '';
        const addMoreText =
            ' Try sending more Qubits next time to reduce the chance that Eve guesses the code of Alice or Bob.';
        if (
            result?.eveCode === result?.aliceCode &&
            result?.eveCode !== result?.bobCode
        ) {
            text =
                'By chance, Eve got the same code as Alice. If Alice sends anything with this code then Eve could decrypt it.';
            text = text + addMoreText;
        } else if (
            result?.eveCode !== result?.aliceCode &&
            result?.eveCode === result?.bobCode
        ) {
            text =
                'By chance, Eve got the same code as Bob. If Bob sends anything with this code then Eve could decrypt it.';
            text = text + addMoreText;
        } else if (
            result?.eveCode === result?.aliceCode &&
            result?.eveCode === result?.bobCode
        ) {
            text =
                'By chance, Eve got the same code as Alice and Bob. Eve could decrypt anything Alice and Bob send with this code.';
            text = text + addMoreText;
        } else if (
            result?.eveCode !== undefined &&
            result?.eveCode !== result?.aliceCode &&
            result?.eveCode !== result?.bobCode
        ) {
            text = `Eve's code does not match with neiter Alice's nor Bob's code. Alice and Bob can securily send data with their code.`;
        }
        return text;
    }

    function getTypewriter() {
        if (result !== undefined) {
            return getResultReceivedTypewriter();
        } else {
            return getWaitingMessage();
        }
    }

    function getResultReceivedTypewriter() {
        const codeDelay = 150;
        const shortDelay = 700;
        const mediumDelay = 1000;
        const longDelay = 2000;
        const textDelay = 40;
        return (
            <Typewriter
                options={{
                    delay: textDelay,
                }}
                onInit={(t) => {
                    let typewriter = t
                        .typeString(`Alice's code is: `)
                        .pauseFor(shortDelay)
                        .changeDelay(codeDelay)
                        .typeString(`${result?.aliceCode.split('').join(' ')}`)
                        .pauseFor(mediumDelay)
                        .changeDelay(textDelay)
                        .typeString(`<br/>Bobs's code is:&nbsp;&nbsp;`)
                        .pauseFor(shortDelay)
                        .changeDelay(codeDelay)
                        .typeString(`${result?.bobCode.split('').join(' ')}`)
                        .changeDelay(textDelay)
                        .pauseFor(mediumDelay)
                        .typeString(
                            result?.aliceCode === result?.bobCode
                                ? '<br/>Alice and Bob have the same code.'
                                : '<br/>The codes of Alice and Bob do not match.'
                        )
                        .pauseFor(longDelay)
                        .typeString(`<br/><br/><br/>${getAliceListeningText()}`)
                        .pauseFor(mediumDelay)
                        .typeString(`<br/>${getBobListeningText()}`)
                        .pauseFor(longDelay)
                        .typeString(`<br/><br/>${getEveListeningText()}`)
                        .pauseFor(longDelay)
                        .typeString(
                            result?.eveCode
                                ? ' Eve was listening in.'
                                : ' Eve did not listen in.'
                        );
                    if (result?.eveCode) {
                        typewriter = typewriter
                            .pauseFor(mediumDelay)
                            .typeString(
                                `<br/><br/>Eves's code is:&nbsp;&nbsp;&nbsp;`
                            )
                            .pauseFor(shortDelay)
                            .changeDelay(codeDelay)
                            .typeString(
                                `${result?.eveCode.split('').join(' ')}`
                            )
                            .changeDelay(textDelay)
                            .pauseFor(mediumDelay)
                            .typeString(`<br/><br/>${getEveCodeCompareText()}`);
                    }
                    typewriter
                        .pauseFor(3000)
                        .typeString(
                            '<br/><br/><br/><br/>Thank you for participating.'
                        )
                        .callFunction(() => {
                            setTimeout(() => {
                                setIsResultShown(true);
                            }, longDelay);
                        })
                        .start();
                }}
            />
        );
    }

    function getWaitingMessage() {
        return 'Waiting for other players to finish...';
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <div className="flex flex-col mt-3 font-mono">
                    <div className="text-3xl mb-4">Results</div>
                    {getTypewriter()}
                    {isResultShown ? (
                        <div className="mt-12">
                            <Button
                                onClick={() => {
                                    navigate('/lobbies');
                                }}
                            >
                                Back to lobbies
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default GameResult;
