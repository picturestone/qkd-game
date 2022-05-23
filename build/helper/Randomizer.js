"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Randomizer {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) - min);
    }
    static getRandomEnum(enumType) {
        const enumValues = Object.keys(enumType)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n));
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        const randomEnumValue = enumValues[randomIndex];
        return randomEnumValue;
    }
}
exports.default = Randomizer;
