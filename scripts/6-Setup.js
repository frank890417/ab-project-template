let graphics

function setup() {
  pixelDensity(GLOBAL.pixelDensity)
  createCanvas(GLOBAL.size.width, GLOBAL.size.height);
  graphics = createGraphics(width, height)
  fitCanvasSize()
  background(255)
  noLoop()
}