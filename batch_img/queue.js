const Queue = require("queue-promise");
const puppeteer = require("puppeteer");
const keccak256 = require("keccak256");
const cliProgress = require("cli-progress");
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const fs = require("fs");
const http = require("http");
var dir = "./img";
var dir2 = "./video";
let serve_file_path = "index-dev.html";

// Setup Express server for serving static files and HTML
function setupServer() {
  console.log("Starting Capture Server");

  // Serve static files from the 'public' directory
  app.use(express.static('../'));

  // Serve the HTML file
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', serve_file_path));
  });

  // Start the server on port 3000
  app.listen(port, () => {
    console.log(`Capture Server is running on http://localhost:${port}/`);
  });
}

// Utility function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function to remove and create a directory
function removeAndCreateDir(dirName) {
  if (deletePrevious === "true") {
    fs.rmSync(dirName, {
      recursive: true,
      force: true
    });
  }
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

// Global variables
let imgN, dim, deletePrevious, isImage;
let pageWaitTime = 500;
let doneCount = 0;
let renderedFeatureList = [];
let size = {
  width: 1000,
  height: 1000
}
let browser, page, server;
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const queue = new Queue({
  concurrent: 1,
  interval: 100
});

// Main setup function
async function setup() {
  await delay(500);
  bar1.start(imgN, 0);
  browser = await puppeteer.launch({
    headless: true
  });
  page = await browser.newPage();
  dim = parseInt(dim);
  // console.log(size)
  page.setViewport({
    width: size.width,
    height: size.height
  });
}

// Main image generation function
async function generate_img() {
  return new Promise(async (resolve, reject) => {
    try {
      const hashLength = 64; // Length of the hash (assuming it's a hexadecimal string)
      let hash = "0x";
      const characters = "0123456789abcdef";
      for (let i = 0; i < hashLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
      }
      await page.goto(`http://127.0.0.1:${port}/${serve_file_path}?hash=${hash}`);
      await page.waitForSelector("#defaultCanvas0");
      await page.waitForTimeout(pageWaitTime);

      // Get feature
      let features = await page.evaluate('features');

      const canvasImage = await page.$("#defaultCanvas0");
      await canvasImage.screenshot({
        path: `img/${hash}.png`
      });
      doneCount++;


      resolve({
        hash,
        features
      });
    } catch (e) {
      // console.log(e)
      // console.log("error processing.. start new job");
      queue.enqueue(generate_img);
      resolve({});
    }
  });
}

// Main function for image generation
async function img_main() {
  removeAndCreateDir(dir);
  await setup();

  for (let i = 0; i < imgN; i++) {
    queue.enqueue(generate_img);
  }
}

queue.on("resolve", async (data) => {
  if (data.hash) renderedFeatureList.push(data)
  bar1.update(doneCount);
  fs.writeFileSync('img/features.json', JSON.stringify(renderedFeatureList, null, 2));
  if (doneCount == imgN) {
    bar1.stop();
    await browser.close();
    // await server.close();
    process.exit();
  }
});
queue.on("reject", (error) => console.error(error));


// Entry point of the script
function main() {
  // Read command-line arguments
  imgN = process.argv[2];
  dim = parseInt(process.argv[3]);
  deletePrevious = process.argv[4];
  isImage = process.argv[5];

  // Load global variables from file
  const globalVarContent = fs.readFileSync("../scripts/2.1-Global-Constants.js", "utf8");
  let parsedData = JSON.parse(globalVarContent.split("let GLOBAL = ")[1]);
  let originalSize = parsedData.size;

  // resize the size parameters if it exceed dim according to original ratio
  if (dim < originalSize.width) {
    let nWidth = dim;
    let nHeight = parseInt(originalSize.height * (dim / originalSize.width));
    size.width = nWidth;
    size.height = nHeight;
  } else {
    size.width = originalSize.width
    size.height = originalSize.height
  }

  // console.log("Original Size :", `${originalSize.width} x ${originalSize.height}`);
  console.log("Render Size :", `${size.width} x ${size.height}`);
  console.log("Ratio Fixed:", originalSize.ratioFixed);
  console.log("Pixel Density:", parsedData.pixelDensity);

  // Start the setup and image generation
  setupServer();
  img_main();
}

main(); // Call the main function to start the script