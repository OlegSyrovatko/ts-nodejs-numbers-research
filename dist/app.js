"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Функція для читання файлу і обробки чисел
function processFile(filePath) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, "utf8", (err, data) => {
            if (err)
                return reject(err);
            // Зчитуємо числа і перетворюємо на масив
            const numbers = data
                .split("\n")
                .map(Number)
                .filter((n) => !isNaN(n));
            // Знаходимо максимальне та мінімальне значення
            const max = Math.max(...numbers);
            const min = Math.min(...numbers);
            // Обчислюємо середнє арифметичне
            const sum = numbers.reduce((acc, num) => acc + num, 0);
            const mean = sum / numbers.length;
            // Сортуємо числа для обчислення медіани
            const sortedNumbers = [...numbers].sort((a, b) => a - b);
            const middle = Math.floor(sortedNumbers.length / 2);
            const median = sortedNumbers.length % 2 !== 0
                ? sortedNumbers[middle]
                : (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
            // Знаходимо найдовші зростаючі та спадаючі послідовності
            const increasingSequence = findLongestIncreasingSequence(numbers);
            const decreasingSequence = findLongestDecreasingSequence(numbers);
            resolve({
                max,
                min,
                mean,
                median,
                longestIncreasingSequence: increasingSequence,
                longestDecreasingSequence: decreasingSequence,
            });
        });
    });
}
// Функція для знаходження найдовшої зростаючої послідовності
function findLongestIncreasingSequence(numbers) {
    let maxSeq = [];
    let currentSeq = [];
    for (let i = 0; i < numbers.length; i++) {
        if (i === 0 || numbers[i] > numbers[i - 1]) {
            currentSeq.push(numbers[i]);
        }
        else {
            if (currentSeq.length > maxSeq.length) {
                maxSeq = currentSeq;
            }
            currentSeq = [numbers[i]];
        }
    }
    if (currentSeq.length > maxSeq.length) {
        maxSeq = currentSeq;
    }
    return maxSeq;
}
// Функція для знаходження найдовшої спадаючої послідовності
function findLongestDecreasingSequence(numbers) {
    let maxSeq = [];
    let currentSeq = [];
    for (let i = 0; i < numbers.length; i++) {
        if (i === 0 || numbers[i] < numbers[i - 1]) {
            currentSeq.push(numbers[i]);
        }
        else {
            if (currentSeq.length > maxSeq.length) {
                maxSeq = currentSeq;
            }
            currentSeq = [numbers[i]];
        }
    }
    if (currentSeq.length > maxSeq.length) {
        maxSeq = currentSeq;
    }
    return maxSeq;
}
app.get("/process", async (req, res) => {
    try {
        const result = await processFile(path_1.default.resolve(__dirname, "10m.txt"));
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.toString());
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
