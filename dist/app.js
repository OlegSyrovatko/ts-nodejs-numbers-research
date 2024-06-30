"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const app = (0, express_1.default)();
const port = 3000;
async function processFile(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs_1.default.createReadStream(filePath);
        const rl = readline_1.default.createInterface({
            input: stream,
            crlfDelay: Infinity,
        });
        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        let count = 0;
        let numbers = [];
        let currentIncSeq = [];
        let maxIncSeq = [];
        let currentDecSeq = [];
        let maxDecSeq = [];
        rl.on("line", (line) => {
            const num = Number(line);
            if (!isNaN(num)) {
                if (num > max)
                    max = num;
                if (num < min)
                    min = num;
                sum += num;
                count++;
                numbers.push(num);
                // Обробка для зростаючих послідовностей
                if (currentIncSeq.length === 0 ||
                    num > currentIncSeq[currentIncSeq.length - 1]) {
                    currentIncSeq.push(num);
                }
                else {
                    if (currentIncSeq.length > maxIncSeq.length) {
                        maxIncSeq = currentIncSeq;
                    }
                    currentIncSeq = [num];
                }
                // Обробка для спадаючих послідовностей
                if (currentDecSeq.length === 0 ||
                    num < currentDecSeq[currentDecSeq.length - 1]) {
                    currentDecSeq.push(num);
                }
                else {
                    if (currentDecSeq.length > maxDecSeq.length) {
                        maxDecSeq = currentDecSeq;
                    }
                    currentDecSeq = [num];
                }
            }
        });
        rl.on("close", () => {
            if (currentIncSeq.length > maxIncSeq.length) {
                maxIncSeq = currentIncSeq;
            }
            if (currentDecSeq.length > maxDecSeq.length) {
                maxDecSeq = currentDecSeq;
            }
            const mean = sum / count;
            const sortedNumbers = numbers.sort((a, b) => a - b);
            const middle = Math.floor(sortedNumbers.length / 2);
            const median = sortedNumbers.length % 2 !== 0
                ? sortedNumbers[middle]
                : (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
            resolve({
                max,
                min,
                mean,
                median,
                longestIncreasingSequence: maxIncSeq,
                longestDecreasingSequence: maxDecSeq,
            });
        });
        rl.on("error", (err) => {
            reject(err);
        });
    });
}
app.get("/process", async (req, res) => {
    req.setTimeout(5 * 60 * 1000); // Збільшити таймаут до 5 хвилин
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
