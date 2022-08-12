import { Server, Socket } from 'socket.io';
import GameDb from '../database/GameDb';
import Game from '../models/Game';
import HumanAlicePlayer from '../models/player/HumanAlicePlayer';
import HumanBobPlayer from '../models/player/HumanBobPlayer';
import HumanEvePlayer from '../models/player/HumanEvePlayer';
import Qbit from '../models/quantum/Qbit';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';

function isGameExisting(gameId: string): Promise<Game> {
    return new Promise<Game>((res, rej) => {
        new GameDb().findById(gameId).then((game) => {
            if (game && game.id) {
                res(game);
            } else {
                rej();
            }
        });
    });
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

function handlePublishedCodeSending(game: Game) {
    const aliceCode = game.alicePlayer.publishedCode;
    const bobCode = game.bobPlayer.publishedCode;
    if (aliceCode !== undefined && bobCode !== undefined) {
        game.alicePlayer.onCodesPublished(aliceCode, bobCode);
        game.bobPlayer.onCodesPublished(aliceCode, bobCode);
    }
}

// TODO add redirecting on missing auth.
// TODO quit game when leaving.
export default function registerSocketIOEvents(
    server: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
) {
    server.on('connect', (socket) => {
        socket.on('sendQbit', (gameId, qbitJson) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const alicePlayer = isUserAlice(game, userId);
                const evePlayer = isUserEve(game, userId);
                const sentQbit = Qbit.fromJson(qbitJson);
                if (alicePlayer) {
                    alicePlayer.sendQbit(sentQbit);
                } else if (evePlayer) {
                    evePlayer.sendQbit(sentQbit);
                }
            });
        });
        socket.on('measureEnqueuedQbit', (gameId, basis, cb) => {
            isGameExisting(gameId).then((game) => {
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
            });
        });
        socket.on('publishBasis', (gameId, basisComparisonData, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const alicePlayer = isUserAlice(game, userId);
                const evePlayer = isUserEve(game, userId);
                if (alicePlayer) {
                    alicePlayer.sendBasisComparison(basisComparisonData);
                    cb(basisComparisonData);
                } else if (evePlayer) {
                    evePlayer.sendBasisComparison(basisComparisonData);
                    cb(basisComparisonData);
                }
            });
        });
        socket.on('publishDiscard', (gameId, qbitDiscardedData, cb) => {
            isGameExisting(gameId).then((game) => {
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
            });
        });
        socket.on('publishCode', (gameId, code, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const alicePlayer = isUserAlice(game, userId);
                const bobPlayer = isUserBob(game, userId);
                const evePlayer = isUserEve(game, userId);
                if (alicePlayer && alicePlayer.publishedCode === undefined) {
                    alicePlayer.publishedCode = code;
                    // TODO This should not be called here but by the player to the controller instead
                    // So it would work with a computer player.
                    handlePublishedCodeSending(game);
                    cb();
                } else if (bobPlayer && bobPlayer.publishedCode === undefined) {
                    bobPlayer.publishedCode = code;
                    handlePublishedCodeSending(game);
                    cb();
                } else if (evePlayer && evePlayer.publishedCode === undefined) {
                    evePlayer.publishedCode = code;
                    evePlayer.isDoneWithGame = true;
                    cb();
                }
            });
        });
        socket.on('getPublishedCodes', (gameId, cb) => {
            isGameExisting(gameId).then((game) => {
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
            });
        });
        socket.on(
            'publishIsEveListeningGuess',
            (gameId, isEveListening, cb) => {
                isGameExisting(gameId).then((game) => {
                    const userId = getUserId(socket);
                    const alicePlayer = isUserAlice(game, userId);
                    const bobPlayer = isUserBob(game, userId);
                    // TODO handle messaging the controller afterwars/sending the event.
                    if (
                        alicePlayer &&
                        alicePlayer.isEveListeningInGuess === undefined
                    ) {
                        alicePlayer.isEveListeningInGuess = isEveListening;
                        cb();
                    } else if (
                        bobPlayer &&
                        bobPlayer.isEveListeningInGuess === undefined
                    ) {
                        bobPlayer.isEveListeningInGuess = isEveListening;
                        cb();
                    }
                });
            }
        );
    });
}
