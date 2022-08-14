import { Server } from 'socket.io';
import GameDb from '../database/GameDb';
import LobbyDb from '../database/LobbyDb';
import GameBuilder from '../models/GameBuilder';
import Lobby from '../models/Lobby';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import { PLAYERROLE } from '../qkd-game-client/src/models/api/PlayerRole';
import IO from './IO';

function getLobby(lobbyId: string): Promise<Lobby | undefined> {
    return new LobbyDb().findById(lobbyId);
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
        const game = GameBuilder.createAliceBobGame(
            lobby.noOfQbits,
            lobby.reservedAlice,
            lobby.reservedBob
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
        const game = GameBuilder.createAliceBobEveGame(
            lobby.noOfQbits,
            lobby.reservedAlice,
            lobby.reservedBob,
            lobby.reservedEve
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

// TODO move more responsibilities to the lobby.
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
            getLobby(lobbyId).then((lobby) => {
                lobby?.join(socket);
            });
        });
        socket.on('leaveLobby', (lobbyId) => {
            getLobby(lobbyId).then((lobby) => {
                lobby?.leave(socket);
            });
        });
        socket.on('selectLobbyRole', (lobbyId, lobbyRole) => {
            const lobbyDb = new LobbyDb();

            lobbyDb.findById(lobbyId).then((lobby) => {
                if (lobby && lobby.id) {
                    if (lobbyRole === null || lobbyRole === undefined) {
                        lobby.removeUserFromAllRoles(socket.request.user);
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
                                    lobby.removeUserFromAllRoles(
                                        socket.request.user
                                    );
                                    lobby.reservedAlice = socket.request.user;
                                }
                                break;
                            case PLAYERROLE.bob:
                                if (!lobby.reservedBob) {
                                    lobby.removeUserFromAllRoles(
                                        socket.request.user
                                    );
                                    lobby.reservedBob = socket.request.user;
                                }
                                break;
                            case PLAYERROLE.eve:
                                if (!lobby.reservedEve) {
                                    lobby.removeUserFromAllRoles(
                                        socket.request.user
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
        socket.on('startGame', (lobbyId) => {
            getLobby(lobbyId).then((lobby) => {
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
