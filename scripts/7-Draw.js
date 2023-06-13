function draw() {
  graphics.colorMode(HSB)
  graphics.noStroke()
  for (let i = 0; i < features.count; i++) {
    let clr = graphics.color(colorBase + random(-1, 1) * colorVar, random(200), random(200))
    graphics.fill(clr)
    graphics.circle(random(width), random(height), random(200))
  }

  //draw graphics to canvas
  image(graphics, 0, 0)
}