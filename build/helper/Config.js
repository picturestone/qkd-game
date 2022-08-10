"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.PORT = void 0;
const PORT = process.env.PORT || '3001';
exports.PORT = PORT;
const SECRET = process.env.SECRET || 'VERY_SECRET_STRING';
exports.SECRET = SECRET;
