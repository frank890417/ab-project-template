const fs = require("fs");
const child = require("child_process");
var dir = "./build";

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


scripts.forEach((script) => {
  scriptString += fs.readFileSync(`./scripts/${script}`, "utf8");
});

//set feature scripts array to scripts array until feature scripts are found
var featureScripts = scripts.slice(0, scripts.findIndex((script) => {
  return script.includes("Feature")
}) + 1);
var featureScriptString = "";

featureScripts.forEach((script) => {
  featureScriptString += fs.readFileSync(`./scripts/${script}`, "utf8");
});

console.log(scripts, featureScripts)
console.log(featureScriptString)


// var ResultArray;
// fs.readFile("Sketch.js", "utf8", function (err, contents) {
//   // console.log(contents);
//   var chunks = contents.split("//%");

//   chunks.forEach((chunk, chunkId) => {
//     fs.writeFileSync(`${dir}/chunk${chunkId}.js`, chunk);
//     child.exec(
//       `minify ${dir}/chunk${chunkId}.js > ${dir}/chunk${chunkId}.min.js`,
//       (error, stdout, stderr) => {
//         if (error) {}
//       }
//     );
//   });

//   let featureScript = contents
//     .split("//#FEATURE_START")[1]
//     .split("//#FEATURE_END")[0];
//   fs.writeFileSync(`${dir}/feature.js`, featureScript);
//   child.exec(
//     `minify ${dir}/feature.js > ${dir}/feature.min.js`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(error)
//       }
//     }
//   );
// });