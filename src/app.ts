import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import readline from "readline";

const app = express();
const port = 3000;

interface Result {
  max: number;
  min: number;
  mean: number;
  median: number;
  longestIncreasingSequence: number[];
  longestDecreasingSequence: number[];
}

async function processFile(filePath: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let max = -Infinity;
    let min = Infinity;
    let sum = 0;
    let count = 0;

    let numbers: number[] = [];

    let currentIncSeq: number[] = [];
    let maxIncSeq: number[] = [];

    let currentDecSeq: number[] = [];
    let maxDecSeq: number[] = [];

    rl.on("line", (line: string) => {
      const num = Number(line);
      if (!isNaN(num)) {
        if (num > max) max = num;
        if (num < min) min = num;

        sum += num;
        count++;
        numbers.push(num);

        // Обробка для зростаючих послідовностей
        if (
          currentIncSeq.length === 0 ||
          num > currentIncSeq[currentIncSeq.length - 1]
        ) {
          currentIncSeq.push(num);
        } else {
          if (currentIncSeq.length > maxIncSeq.length) {
            maxIncSeq = currentIncSeq;
          }
          currentIncSeq = [num];
        }

        // Обробка для спадаючих послідовностей
        if (
          currentDecSeq.length === 0 ||
          num < currentDecSeq[currentDecSeq.length - 1]
        ) {
          currentDecSeq.push(num);
        } else {
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
      const median =
        sortedNumbers.length % 2 !== 0
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

app.get("/process", async (req: Request, res: Response) => {
  req.setTimeout(5 * 60 * 1000); // Збільшити таймаут до 5 хвилин
  try {
    const result = await processFile(path.resolve(__dirname, "10m.txt"));
    res.json(result);
  } catch (error: any) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
