import { Server } from 'socket.io';
import LobbyDb from '../database/LobbyDb';
import Lobby from '../models/Lobby';
import User from '../models/User';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import { PLAYERROLE } from '../qkd-game-client/src/models/api/PlayerRole';

function removeFromOtherRoles(user: User | undefined, lobby: Lobby) {
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
    });
}
