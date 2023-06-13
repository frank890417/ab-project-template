const puppeteer = require("puppeteer");
const keccak256 = require("keccak256");
const {
  workerData,
  parentPort
} = require("worker_threads");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// let targetHash = "0x39c85fb1c6e5d15d36b2dbf43596358268c590a86804a9dfad8c08d4878a5c16"
(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({
  //   // headless: true,
  //   // slowMo: 100
  // });
  const page = await browser.newPage();
  const dim = parseInt(workerData.dim);
  page.setViewport({
    width: dim,
    height: dim
  });

  const hash = "0x" + keccak256(Date.now()).toString("hex");
  await page.goto(
    `http://127.0.0.1:${workerData.port}/index.html?hash=${hash}`
  );
  await page.waitForSelector("#defaultCanvas0");
  await sleep(100)
  const canvasImage = await page.$("#defaultCanvas0");
  await canvasImage.screenshot({
    path: `img/${hash}.png`,
  });

  await browser.close();

  // multithread
  parentPort.postMessage({
    hello: workerData
  });
})();