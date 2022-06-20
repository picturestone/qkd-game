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
    console.log('registering socket events');
    server?.on('connect', (socket) => {
        socket.on('joinRoom', (roomId) => {
            new LobbyDb().findById(roomId).then((lobby) => {
                if (lobby && lobby.id) {
                    console.log(
                        'user ' +
                            socket.request.user?.name +
                            ' joins room ' +
                            lobby.id
                    );
                    socket.join(lobby.id);
                    server
                        .to(lobby.id)
                        .emit(
                            'chatMessage',
                            `${socket.request.user?.name} joined the lobby. ${
                                server.to(lobby.id).allSockets.length
                            }`
                        );
                }
            });
        });
    });
}
