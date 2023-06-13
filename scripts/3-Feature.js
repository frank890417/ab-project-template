if (typeof window.features === undefined) {
  window.features = {};
}

function renderFeatures() {
  return {
    count: parseInt(random([5, 10, 100])),
    color: random(["red", "green", "blue"]),
  }
}

features = renderFeatures();