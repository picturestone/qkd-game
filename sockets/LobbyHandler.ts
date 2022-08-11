import { Server } from 'socket.io';
import GameDb from '../database/GameDb';
import LobbyDb from '../database/LobbyDb';
import GameFactory from '../models/GameFactory';
import Lobby from '../models/Lobby';
import HumanAliceController from '../models/player/HumanAliceController';
import HumanBobController from '../models/player/HumanBobController';
import HumanEveController from '../models/player/HumanEveController';
import User from '../models/User';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import { PLAYERROLE } from '../qkd-game-client/src/models/api/PlayerRole';
import IO from './IO';
import IUser = Express.User;

function removeFromOtherRoles(user: IUser | undefined, lobby: Lobby) {
    if (user) {
        const userId = user.id;
        if (lobby.reservedAlice?.id === userId) {
            lobby.reservedAlice = undefined;
        }
        if (lobby.reservedBob?.id === userId) {
            lobby.reservedBob = undefined;
        }
    }
}

function startAliceBobGame(
    lobby: Lobby,
    server: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
) {
    if (
        lobby.reservedAlice &&
        lobby.reservedAlice.socketId &&
        lobby.reservedBob &&
        lobby.reservedBob.socketId &&
        lobby.id
    ) {
        // Make all sockets in the lobby room leave.
        const ioServer = IO.getInstance().server;
        ioServer.in(lobby.id).socketsLeave(lobby.id);
        // Create game.
        const aliceController = new HumanAliceController(lobby.reservedAlice);
        const bobController = new HumanBobController(lobby.reservedBob);
        const game = GameFactory.createAliceBobGame(
            lobby.noOfQbits,
            aliceController,
            bobController
        );
        new GameDb().create(game).then((savedGame) => {
            if (lobby && lobby.id) {
                // Delete old lobby.
                new LobbyDb().delete(lobby.id).then(() => {
                    // Notify users.
                    savedGame.startGame();
                });
            }
        });
    } else if (lobby.id) {
        server
            .to(lobby.id)
            .emit(
                'chatMessage',
                `Game can only start if the Alice and Bob roles are occupied.`
            );
    }
}

function startAliceBobEveGame(
    lobby: Lobby,
    server: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
) {
    if (
        lobby.reservedAlice &&
        lobby.reservedAlice.socketId &&
        lobby.reservedBob &&
        lobby.reservedBob.socketId &&
        lobby.reservedEve &&
        lobby.reservedEve.socketId &&
        lobby.id
    ) {
        // Make all sockets in the lobby room leave.
        const ioServer = IO.getInstance().server;
        ioServer.in(lobby.id).socketsLeave(lobby.id);
        // Create game. TODO create game with eve
        const aliceController = new HumanAliceController(lobby.reservedAlice);
        const bobController = new HumanBobController(lobby.reservedBob);
        const eveController = new HumanEveController(lobby.reservedEve);
        const game = GameFactory.createAliceBobEveGame(
            lobby.noOfQbits,
            aliceController,
            bobController,
            eveController
        );
        new GameDb().create(game).then((savedGame) => {
            if (lobby && lobby.id) {
                // Delete old lobby.
                new LobbyDb().delete(lobby.id).then(() => {
                    // Notify users.
                    savedGame.startGame();
                });
            }
        });
    } else if (lobby.id) {
        server
            .to(lobby.id)
            .emit(
                'chatMessage',
                `Game can only start if the Alice, Bob and Eve roles are occupied.`
            );
    }
}

// TODO close lobby when leaving.
export default function registerSocketIOEvents(
    server: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >
) {
    server.on('connect', (socket) => {
        socket.on('joinLobby', (lobbyId) => {
            new LobbyDb().findById(lobbyId).then((lobby) => {
                if (lobby && lobby.id && !socket.rooms.has(lobby.id)) {
                    socket.join(lobby.id);
                    server
                        .to(lobby.id)
                        .emit(
                            'chatMessage',
                            `${socket.request.user?.name} joined the lobby.`
                        );
                }
            });
        });
        socket.on('selectLobbyRole', (lobbyId, lobbyRole) => {
            const lobbyDb = new LobbyDb();

            lobbyDb.findById(lobbyId).then((lobby) => {
                if (lobby && lobby.id) {
                    if (lobbyRole === null || lobbyRole === undefined) {
                        removeFromOtherRoles(socket.request.user, lobby);
                        lobbyDb.put(lobby).then((updatedLobby) => {
                            if (updatedLobby && updatedLobby.id) {
                                server
                                    .to(updatedLobby.id)
                                    .emit(
                                        'updatedLobby',
                                        updatedLobby.toJson()
                                    );
                                server
                                    .to(updatedLobby.id)
                                    .emit(
                                        'chatMessage',
                                        `${socket.request.user?.name} deselected their role.`
                                    );
                            }
                        });
                    } else {
                        switch (lobbyRole) {
                            case PLAYERROLE.alice:
                                if (!lobby.reservedAlice) {
                                    removeFromOtherRoles(
                                        socket.request.user,
                                        lobby
                                    );
                                    lobby.reservedAlice = socket.request.user;
                                }
                                break;
                            case PLAYERROLE.bob:
                                if (!lobby.reservedBob) {
                                    removeFromOtherRoles(
                                        socket.request.user,
                                        lobby
                                    );
                                    lobby.reservedBob = socket.request.user;
                                }
                                break;
                            case PLAYERROLE.eve:
                                if (!lobby.reservedEve) {
                                    removeFromOtherRoles(
                                        socket.request.user,
                                        lobby
                                    );
                                    lobby.reservedEve = socket.request.user;
                                }
                        }
                        lobbyDb.put(lobby).then((updatedLobby) => {
                            if (updatedLobby && updatedLobby.id) {
                                server
                                    .to(updatedLobby.id)
                                    .emit(
                                        'updatedLobby',
                                        updatedLobby.toJson()
                                    );
                                server
                                    .to(updatedLobby.id)
                                    .emit(
                                        'chatMessage',
                                        `${socket.request.user?.name} plays as ${lobbyRole}.`
                                    );
                            }
                        });
                    }
                }
            });
        });
        // TODO start game with eve.
        socket.on('startGame', (lobbyId) => {
            new LobbyDb().findById(lobbyId).then((lobby) => {
                if (lobby && lobby.id) {
                    if (socket.request.user?.id === lobby.owner.id) {
                        if (lobby.isEveAllowed) {
                            startAliceBobEveGame(lobby, server);
                        } else {
                            startAliceBobGame(lobby, server);
                        }
                    } // TODO maybe send unauthorized in else.
                } // TODO maybe send 404 in else.
            });
        });
    });
}
