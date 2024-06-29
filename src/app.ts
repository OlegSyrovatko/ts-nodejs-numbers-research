import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

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

// Функція для читання файлу і обробки чисел
function processFile(filePath: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);

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
      const median =
        sortedNumbers.length % 2 !== 0
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
function findLongestIncreasingSequence(numbers: number[]): number[] {
  let maxSeq: number[] = [];
  let currentSeq: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    if (i === 0 || numbers[i] > numbers[i - 1]) {
      currentSeq.push(numbers[i]);
    } else {
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
function findLongestDecreasingSequence(numbers: number[]): number[] {
  let maxSeq: number[] = [];
  let currentSeq: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    if (i === 0 || numbers[i] < numbers[i - 1]) {
      currentSeq.push(numbers[i]);
    } else {
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

app.get("/process", async (req: Request, res: Response) => {
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
