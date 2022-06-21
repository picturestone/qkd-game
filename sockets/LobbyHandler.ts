import { Server } from 'socket.io';
import LobbyDb from '../database/LobbyDb';
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
                    // TODO remove user from other reserved roles.
                    switch (lobbyRole) {
                        case 'alice':
                            if (!lobby.reservedAlice) {
                                lobby.reservedAlice = socket.request.user;
                            }
                            break;
                        case 'bob':
                            if (!lobby.reservedBob) {
                                lobby.reservedBob = socket.request.user;
                            }
                            break;
                    }
                    lobbyDb.put(lobby).then((updatedLobby) => {
                        if (updatedLobby && updatedLobby.id) {
                            server
                                .to(updatedLobby.id)
                                .emit('updatedLobby', updatedLobby.toJson());
                            server
                                .to(updatedLobby.id)
                                .emit(
                                    'chatMessage',
                                    `${socket.request.user?.name} plays as ${lobbyRole}.`
                                );
                        }
                    });
                }
            });
        });
    });
}
