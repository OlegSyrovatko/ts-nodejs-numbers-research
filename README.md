# Number Analysis Project

This project reads a large file of integers and calculates the following metrics:

- Maximum number in the file
- Minimum number in the file
- Mean (average) of all numbers
- Median of the numbers
- Longest increasing sequence of consecutive numbers
- Longest decreasing sequence of consecutive numbers

## Prerequisites

Ensure you have Node.js and npm (Node Package Manager) installed on your machine.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/number-analysis.git
   cd number-analysis
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Place your data file:**

   Make sure you have a file named `10m.txt` with your integers (each number on a new line) in the root directory. You can use your own file by replacing `10m.txt`.

4. **Compile TypeScript to JavaScript:**

   ```bash
   npm run build
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

6. **Access the results:**

   Open your web browser and navigate to `http://localhost:3000/process` to see the calculated metrics.

## Output

When you visit `http://localhost:3000/process`, you will receive a JSON response containing the following:

- `max`: The maximum number in the file.
- `min`: The minimum number in the file.
- `mean`: The average of all the numbers.
- `median`: The median of the numbers.
- `longestIncreasingSequence`: The longest sequence of consecutive increasing numbers.
- `longestDecreasingSequence`: The longest sequence of consecutive decreasing numbers.

Example JSON output:

```json
{
  "max": 27927281,
  "min": -47591052,
  "mean": 502137.92,
  "median": 123456,
  "longestIncreasingSequence": [123, 456, 789],
  "longestDecreasingSequence": [321, 210, 100]
}


Notes
You can adjust the 10m.txt file with different datasets. Ensure each number is on a new line.
The server has an increased timeout to handle large files. If needed, adjust the timeout in the app.get('/process') method.
Contributing
Feel free to fork this repository and submit pull requests.

License
This project is licensed under the MIT License.
```
