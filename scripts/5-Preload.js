function preload() {
  noiseSeed(seed)
  randomSeed(seed)

  //make global variables
  window.colorBase = features.color == "red" ? 50 : features.color == "green" ? 150 : 250
  window.colorVar = random(30, 50)
}