// index.js
// run with node --experimental-worker index.js on Node.js 10.x
const { Worker } = require("worker_threads");
const cliProgress = require("cli-progress");
var fs = require("fs");
var dir = "./img";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let port = process.argv[2];
let imgN = process.argv[3];
let dim = process.argv[4];

let doneCount = 0;

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start(imgN, 0);

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./index.js", { workerData });
    worker.on("message", () => {
      doneCount++;
      bar1.update(doneCount);
      if (doneCount == imgN) {
        bar1.stop();
      }

      resolve();
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

for (let i = 0; i < imgN; i++) {
  runService({ port: port, dim: dim });
}
