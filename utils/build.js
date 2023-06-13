const fs = require("fs");
const child = require("child_process");
const path = require("path");
const dir = "./build";
const chunkSize = 5000;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
} else {
  fs.rmdirSync(dir, {
    recursive: true,
  });
  fs.mkdirSync(dir);
}

//read files in scripts folders, concat them into one string
var scripts = fs.readdirSync("./scripts");
var scriptString = "";

//arrange scripts in name order
scripts.sort((a, b) => {
  return a.localeCompare(b);
});

function concatScirpt(scripts) {
  let scriptString = ""
  scripts.forEach((script) => {
    scriptString += "//% " + script + "\n";
    scriptString += fs.readFileSync(`./scripts/${script}`, "utf8") + "\n";
  });
  return scriptString
}
scriptString = concatScirpt(scripts)

//set feature scripts array to scripts array until feature scripts are found
var featureScripts = scripts.slice(0, scripts.findIndex((script) => {
  return script.includes("Feature")
}) + 1);
var featureScriptString = "";
featureScriptString = concatScirpt(featureScripts)


//write scripts to build folder
fs.writeFileSync(`${dir}/Sketch.js`, scriptString);
fs.writeFileSync(`${dir}/Feature.js`, featureScriptString);

//minify scripts
child.exec(
  `minify ${dir}/Sketch.js > ${dir}/Sketch.min.js`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error)
    }
  }
);
child.exec(
  `minify ${dir}/Feature.js > ${dir}/Feature.min.js`,
  (error, stdout, stderr) => {
    seperateChunks()
    if (error) {
      console.error(error)
    }
  }
);

function seperateChunks() {
  fs.readFile(`${dir}/Sketch.min.js`, 'utf8', function (err, contents) {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Split the contents into chunks of max 5000 characters
    var numOfChunks = Math.ceil(contents.length / chunkSize);

    for (var i = 0; i < numOfChunks; i++) {
      var start = i * chunkSize;
      var end = start + chunkSize;
      var chunk = contents.slice(start, end);

      // Write each chunk to a new file in the build directory
      var chunkFileName = `Sketch.min.part${i + 1}.js`;
      var chunkFilePath = path.join(dir, chunkFileName);

      fs.writeFile(chunkFilePath, chunk, 'utf8', function (writeErr) {
        if (writeErr) {
          console.error('Error writing chunk to file:', writeErr);
        } else {
          console.log(`Chunk written to ${chunkFilePath}`);
        }
      });
    }
  });
}