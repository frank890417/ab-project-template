/*
  Helper functions
*/

// parse parameters
function setupParametersFromTokenData(token) {
  let hashPairs = [];
  //parse hash
  for (let j = 0; j < 32; j++) {
    hashPairs.push(token.hash.slice(2 + j * 2, 4 + j * 2));
  }
  // map to 0-255
  return hashPairs.map((x) => {
    return parseInt(x, 16);
  });
}

function generateSeedFromTokenData(token) {
  return parseInt(token.hash.slice(0, 16), 16);
}

//%
// console.log(tokenData);

let projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
let mintNumber = parseInt(tokenData.tokenId) % (projectNumber * 1000000);
let seed = parseInt(tokenData.hash.slice(0, 16), 16);

// Gets you an array of 32 parameters from the hash ranging from 0-255
let rawParams = setupParametersFromTokenData(tokenData);
class Random {
  constructor(seed) {
    this.seed = seed;
  }
  random() {
    return this.random_dec();
  }
  random_dec() {
    /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }
  random_num(a, b) {
    if (b === undefined) {
      b = a;
      a = 0;
    }
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    if (b === undefined) {
      b = a;
      a = 0;
    }
    return Math.floor(this.random_num(a, b + 1));
  }
  random_bool(p) {
    return this.random_dec() < p;
  }
  random_choice(list) {
    return list[Math.floor(this.random_num(0, list.length * 0.99))];
  }

  random_choice_weight(obj) {
    let sum = Object.values(obj).reduce((a, b) => a + b, 0);
    let steps = Object.values(obj).reduce(
      (arr, num) => {
        arr.push((arr.slice(-1) || 0) * 1 + num);
        return arr;
      },
      [0]
    );
    let ran = this.random_num(0, sum);
    let result = 0;
    for (let i = steps.length - 1; i >= 1; i--) {
      result = i - 1;
      if (ran > steps[i - 1] && ran < steps[i]) {
        break;
      }
    }
    return Object.keys(obj)[result];
  }
}

let R = new Random(seed);

let random = (obj, obj2) => {
  //random()
  if (obj == undefined) {
    return R.random_dec()
  }
  //random([1,2,3])
  if (Array.isArray(obj)) {
    return R.random_choice(obj)
  }
  //random(50)
  if (typeof obj == 'number' && typeof obj2 == 'number') {
    return R.random_num(obj, obj2)
  }
  //random(50)
  if (typeof obj == 'number' && obj2 == undefined) {
    return R.random_num(0, obj)
  }
  if (typeof obj == 'object') {
    return R.random_choice_weight(obj)

  }
}