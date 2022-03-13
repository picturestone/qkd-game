export default class Randomizer {
    static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) - min);
    }

    static getRandomEnum<T>(enumType: T): T[keyof T] {
        const enumValues = Object.keys(enumType)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }
}