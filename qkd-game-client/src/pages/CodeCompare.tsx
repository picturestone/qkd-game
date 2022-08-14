import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';
import { useSocket } from '../helper/IO';
import IPublishedCodesData from '../models/api/IPublishedCodesData';
import Button from '../components/Button';

function CodeCompare() {
    const params = useParams();
    const socket = useSocket();
    const gameId = params.gameId;
    const [aliceCode, setAliceCode] = useState<string | undefined>(undefined);
    const [bobCode, setBobCode] = useState<string | undefined>(undefined);
    const isLeavingGameOnCleanup = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.then((s) => {
                s.on('allCodesPublished', setCodesFromPublishedCodesData);
            });
            return () => {
                socket.then((s) => {
                    s.off('allCodesPublished', setCodesFromPublishedCodesData);
                });
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && gameId) {
            socket.then((s) => {
                s.on('playerLeftGame', leaveGame);
            });

            return () => {
                socket.then((s) => {
                    s.off('playerLeftGame', leaveGame);
                    if (gameId && isLeavingGameOnCleanup.current) {
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

    function setCodesFromPublishedCodesData(codes: IPublishedCodesData) {
        setAliceCode(codes.aliceCode);
        setBobCode(codes.bobCode);
    }

    function isAliceAndBobCodeSet() {
        return aliceCode !== undefined && bobCode !== undefined;
    }

    function publishIsThinkingEveListenedIn(isThinkingEveListenedIn: boolean) {
        if (socket && gameId) {
            socket.then((s) => {
                s.emit(
                    'publishIsThinkingEveListenedIn',
                    gameId,
                    isThinkingEveListenedIn,
                    () => {
                        if (gameId) {
                            isLeavingGameOnCleanup.current = false;
                            navigate(`/games/${gameId}/result`);
                        }
                    }
                );
            });
        }
    }

    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <div className="flex flex-col mt-3">
                    <div className="flex text-base mb-10">
                        <div className="flex-none flex flex-col items-stretch whitespace-nowrap">
                            <div className="flex items-center w-28 h-6 mr-5 mb-2">
                                Alice's code:
                            </div>
                            <div className="flex items-center w-28 h-6 mr-5">
                                Bobs's code:
                            </div>
                        </div>
                        <div className="flex-auto flex flex-col items-stretch font-mono whitespace-nowrap overflow-auto">
                            <div className="flex items-center font-mono whitespace-nowrap h-6 mb-2">
                                {aliceCode
                                    ? aliceCode.split('').join(' ')
                                    : '<receiving...>'}
                            </div>
                            <div className="flex items-center font-mono whitespace-nowrap h-6">
                                {bobCode
                                    ? bobCode.split('').join(' ')
                                    : '<receiving...>'}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-3">
                            Do you think Eve was listening in on your
                            communciation?
                        </div>
                        <div className="flex">
                            <Button
                                className="mr-4"
                                disabled={!isAliceAndBobCodeSet()}
                                onClick={() => {
                                    publishIsThinkingEveListenedIn(true);
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                disabled={!isAliceAndBobCodeSet()}
                                onClick={() => {
                                    publishIsThinkingEveListenedIn(false);
                                }}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default CodeCompare;
