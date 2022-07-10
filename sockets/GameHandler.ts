import { Server } from 'socket.io';
import GameDb from '../database/GameDb';
import Qbit from '../models/quantum/Qbit';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';

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
            new GameDb().findById(gameId).then((game) => {
                if (game && game.id) {
                    const sentQbit = Qbit.fromJson(qbitJson);
                    const userId = socket.request.user?.id;

                    if (userId) {
                        const aliceController = game.alicePlayer.controller;
                        switch (userId) {
                            case aliceController.userId:
                                aliceController.sendQbit(sentQbit);
                                break;
                        }
                    }
                }
            });
        });
        socket.on('measureEnqueuedQbit', (gameId, basis, cb) => {
            new GameDb().findById(gameId).then((game) => {
                if (game && game.id) {
                    const userId = socket.request.user?.id;
                    if (userId) {
                        const bobController = game.bobPlayer.controller;

                        if (userId === bobController.userId) {
                            const measuredPolarization =
                                bobController.measureEnqueuedQbit(basis);
                            cb(measuredPolarization);
                        }
                    }
                }
            });
        });
    });
}
