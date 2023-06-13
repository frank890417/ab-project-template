// essential global functions
function fitCanvasSize() {
  //given canvas width and height and window with height, fit canvas to window
  if (GLOBAL.size.ratioFixed) {

    let windowRatio = window.innerWidth / window.innerHeight
    let canvasRatio = GLOBAL.size.width / GLOBAL.size.height


    if (windowRatio > canvasRatio) {
      // window is wider than canvas
      let minH = window.innerHeight
      let minW = minH * canvasRatio
      //set canvas size
      canvas.style.width = minW + "px"
      canvas.style.height = minH + "px"
    } else {
      // window is taller than canvas
      let minW = window.innerWidth
      let minH = minW / canvasRatio
      //set canvas size
      canvas.style.width = minW + "px"
      canvas.style.height = minH + "px"
    }

  }

}

function windowResized() {
  fitCanvasSize()
}

// utils for p5 convenience
function mapN(v) {
  return map(v, 0, 1, -1, 1)
}


function pushpop(func, target = null) {
  if (target) {
    target.push()
    func()
    target.pop()
  } else {
    push()
    func()
    pop()

  }
}