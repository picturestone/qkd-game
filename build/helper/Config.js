"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.SOCKETIO_PORT = exports.SERVER_PORT = void 0;
const SERVER_PORT = process.env.SERVER_PORT || '3001';
exports.SERVER_PORT = SERVER_PORT;
const SOCKETIO_PORT = process.env.SOCKETIO_PORT || '3002';
exports.SOCKETIO_PORT = SOCKETIO_PORT;
const SECRET = process.env.SECRET || 'VERY_SECRET_STRING';
exports.SECRET = SECRET;
