if (typeof window.features === undefined) {
  window.features = {};
}

function renderFeatures() {
  return {
    count: parseInt(random([100, 200, 500])),
    color: random(["red", "green", "blue"]),
  }
}

features = renderFeatures();