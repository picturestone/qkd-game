import { Server, Socket } from 'socket.io';
import GameDb from '../database/GameDb';
import Validator from '../helper/Validator';
import Game from '../models/Game';
import HumanAlicePlayer from '../models/player/HumanAlicePlayer';
import HumanBobPlayer from '../models/player/HumanBobPlayer';
import HumanEvePlayer from '../models/player/HumanEvePlayer';
import Qbit from '../models/quantum/Qbit';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';

const validator = new Validator();

function getGame(gameId: string): Promise<Game | undefined> {
    return new GameDb().findById(gameId);
}

function getUserId(
    socket: Socket<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
): string | undefined {
    return socket.request.user?.id;
}

function isUserAlice(
    inGame: Game,
    userId: string | undefined
): HumanAlicePlayer | undefined {
    let player: HumanAlicePlayer | undefined = undefined;
    if (userId) {
        const aliceUserId = inGame.alicePlayer.humanPlayer?.userId;
        if (userId === aliceUserId) {
            player = inGame.alicePlayer as HumanAlicePlayer;
        }
    }
    return player;
}

function isUserBob(
    inGame: Game,
    userId: string | undefined
): HumanBobPlayer | undefined {
    let player: HumanBobPlayer | undefined = undefined;
    if (userId) {
        const bobUserId = inGame.bobPlayer.humanPlayer?.userId;
        if (userId === bobUserId) {
            player = inGame.bobPlayer as HumanBobPlayer;
        }
    }
    return player;
}

function isUserEve(
    inGame: Game,
    userId: string | undefined
): HumanEvePlayer | undefined {
    let player: HumanEvePlayer | undefined = undefined;
    if (userId) {
        const eveUserId = inGame.evePlayer?.humanPlayer?.userId;
        if (userId === eveUserId) {
            player = inGame.evePlayer as HumanEvePlayer;
        }
    }
    return player;
}

export default function registerSocketIOEvents(
    server: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
) {
    server.on('connect', (socket) => {
        socket.on('leaveGame', (gameId) => {
            if (validator.isId(gameId)) {
                getGame(gameId).then((game) => {
                    game?.leave(socket);
                });
            }
        });
        socket.on('sendQbit', (gameId, qbitJson) => {
            if (validator.isId(gameId) && validator.isIQbitJson(qbitJson)) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const alicePlayer = isUserAlice(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        const sentQbit = Qbit.fromJson(qbitJson);
                        if (alicePlayer) {
                            alicePlayer.sendQbit(sentQbit);
                        } else if (evePlayer) {
                            evePlayer.sendQbit(sentQbit);
                        }
                    }
                });
            }
        });
        socket.on('measureEnqueuedQbit', (gameId, basis, cb) => {
            if (validator.isId(gameId) && validator.isBasis(basis)) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const bobPlayer = isUserBob(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        if (bobPlayer) {
                            const measuredPolarization =
                                bobPlayer.measureEnqueuedQbit(basis);
                            cb(measuredPolarization);
                        } else if (evePlayer) {
                            const measuredPolarization =
                                evePlayer.measureEnqueuedQbit(basis);
                            cb(measuredPolarization);
                        }
                    }
                });
            }
        });
        socket.on('publishBasis', (gameId, basisComparisonData, cb) => {
            if (
                validator.isId(gameId) &&
                validator.isIBasisComparisonData(basisComparisonData)
            ) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const alicePlayer = isUserAlice(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        if (alicePlayer) {
                            alicePlayer.sendBasisComparison(
                                basisComparisonData
                            );
                            cb(basisComparisonData);
                        } else if (evePlayer) {
                            evePlayer.sendBasisComparison(basisComparisonData);
                            cb(basisComparisonData);
                        }
                    }
                });
            }
        });
        socket.on('publishDiscard', (gameId, qbitDiscardedData, cb) => {
            if (
                validator.isId(gameId) &&
                validator.isIQbitDiscardData(qbitDiscardedData)
            ) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const bobPlayer = isUserBob(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        if (bobPlayer) {
                            bobPlayer.sendQbitDiscard(qbitDiscardedData);
                            cb(qbitDiscardedData);
                        } else if (evePlayer) {
                            evePlayer.sendQbitDiscard(qbitDiscardedData);
                            cb(qbitDiscardedData);
                        }
                    }
                });
            }
        });
        socket.on('publishCode', (gameId, code, cb) => {
            if (validator.isId(gameId) && validator.isCode(code)) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const alicePlayer = isUserAlice(game, userId);
                        const bobPlayer = isUserBob(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        if (
                            alicePlayer &&
                            alicePlayer.publishedCode === undefined
                        ) {
                            alicePlayer.publishedCode = code;
                            cb();
                        } else if (
                            bobPlayer &&
                            bobPlayer.publishedCode === undefined
                        ) {
                            bobPlayer.publishedCode = code;
                            cb();
                        } else if (
                            evePlayer &&
                            evePlayer.publishedCode === undefined
                        ) {
                            evePlayer.publishedCode = code;
                            cb();
                        }
                    }
                });
            }
        });
        socket.on('getPublishedCodes', (gameId, cb) => {
            if (validator.isId(gameId)) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const alicePlayer = isUserAlice(game, userId);
                        const bobPlayer = isUserBob(game, userId);
                        if (alicePlayer || bobPlayer) {
                            const aliceCode = game.alicePlayer.publishedCode;
                            const bobCode = game.bobPlayer.publishedCode;
                            cb({
                                aliceCode: aliceCode,
                                bobCode: bobCode,
                            });
                        }
                    }
                });
            }
        });
        socket.on(
            'publishIsThinkingEveListenedIn',
            (gameId, isThinkingEveListenedIn, cb) => {
                if (
                    validator.isId(gameId) &&
                    validator.isBoolean(isThinkingEveListenedIn)
                ) {
                    getGame(gameId).then((game) => {
                        if (game) {
                            const userId = getUserId(socket);
                            const alicePlayer = isUserAlice(game, userId);
                            const bobPlayer = isUserBob(game, userId);
                            if (
                                alicePlayer &&
                                alicePlayer.isThinkingEveListenedIn ===
                                    undefined
                            ) {
                                alicePlayer.isThinkingEveListenedIn =
                                    isThinkingEveListenedIn;
                                cb();
                            } else if (
                                bobPlayer &&
                                bobPlayer.isThinkingEveListenedIn === undefined
                            ) {
                                bobPlayer.isThinkingEveListenedIn =
                                    isThinkingEveListenedIn;
                                cb();
                            }
                        }
                    });
                }
            }
        );
        socket.on('getGameResults', (gameId, cb) => {
            if (validator.isId(gameId)) {
                getGame(gameId).then((game) => {
                    if (game) {
                        const userId = getUserId(socket);
                        const alicePlayer = isUserAlice(game, userId);
                        const bobPlayer = isUserBob(game, userId);
                        const evePlayer = isUserEve(game, userId);
                        if (alicePlayer || bobPlayer || evePlayer) {
                            const results = game.getGameResults();
                            if (results) {
                                cb({
                                    aliceCode: results.aliceCode,
                                    bobCode: results.bobCode,
                                    isAliceThinkingEveListenedIn:
                                        results.isAliceThinkingEveListenedIn,
                                    isBobThinkingEveListenedIn:
                                        results.isBobThinkingEveListenedIn,
                                    eveCode: results.eveCode,
                                });
                            } else {
                                cb(undefined);
                            }
                        }
                    }
                });
            }
        });
    });
}
