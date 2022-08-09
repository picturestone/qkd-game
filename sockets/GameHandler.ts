import { Server, Socket } from 'socket.io';
import GameDb from '../database/GameDb';
import Game from '../models/Game';
import AliceController from '../models/player/AliceController';
import BobController from '../models/player/BobController';
import EveController from '../models/player/EveController';
import PlayerController from '../models/player/PlayerController';
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
): AliceController | undefined {
    let controller: AliceController | undefined = undefined;
    if (userId) {
        const aliceController = inGame.alicePlayer.controller;
        if (userId === aliceController.userId) {
            controller = aliceController;
        }
    }
    return controller;
}

function isUserBob(
    inGame: Game,
    userId: string | undefined
): BobController | undefined {
    let controller: BobController | undefined = undefined;
    if (userId) {
        const bobController = inGame.bobPlayer.controller;
        if (userId === bobController.userId) {
            controller = bobController;
        }
    }
    return controller;
}

function isUserEve(
    inGame: Game,
    userId: string | undefined
): EveController | undefined {
    let controller: EveController | undefined = undefined;
    if (userId) {
        const eveController = inGame.evePlayer?.controller;
        if (eveController && userId === eveController.userId) {
            controller = eveController;
        }
    }
    return controller;
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
                const aliceController = isUserAlice(game, userId);
                const eveController = isUserEve(game, userId);
                const sentQbit = Qbit.fromJson(qbitJson);
                if (aliceController) {
                    aliceController.sendQbit(sentQbit);
                } else if (eveController) {
                    eveController.sendQbit(sentQbit);
                }
            });
        });
        socket.on('measureEnqueuedQbit', (gameId, basis, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const bobController = isUserBob(game, userId);
                const eveController = isUserEve(game, userId);
                if (bobController) {
                    const measuredPolarization =
                        bobController.measureEnqueuedQbit(basis);
                    cb(measuredPolarization);
                } else if (eveController) {
                    const measuredPolarization =
                        eveController.measureEnqueuedQbit(basis);
                    cb(measuredPolarization);
                }
            });
        });
        socket.on('publishBasis', (gameId, basisComparisonData, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const aliceController = isUserAlice(game, userId);
                const eveController = isUserEve(game, userId);
                if (aliceController) {
                    aliceController.controlledPlayer.sendBasisComparison(
                        basisComparisonData
                    );
                    cb(basisComparisonData);
                } else if (eveController) {
                    eveController.controlledPlayer.sendBasisComparison(
                        basisComparisonData
                    );
                    cb(basisComparisonData);
                }
            });
        });
        socket.on('publishDiscard', (gameId, qbitDiscardedData, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const bobController = isUserBob(game, userId);
                const eveController = isUserEve(game, userId);
                if (bobController) {
                    bobController.controlledPlayer.sendQbitDiscard(
                        qbitDiscardedData
                    );
                    cb(qbitDiscardedData);
                } else if (eveController) {
                    eveController.controlledPlayer.sendQbitDiscard(
                        qbitDiscardedData
                    );
                    cb(qbitDiscardedData);
                }
            });
        });
    });
}
