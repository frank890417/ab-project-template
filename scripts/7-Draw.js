function draw() {
  for (let i = 0; i < features.count; i++) {
    fill(random(255), random(255), random(255))
    circle(random(width), random(height), random(300))
  }
}