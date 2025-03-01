
/**
 * @typedef {'red' | 'blue' | 'empty'} StoneColor
 */

class PullStones {
  color;
  count;
  constructor(color, count) {
    this.color = color;
    this.count = count;
  }
  clear() {
    this.color = "empty";
    this.count = 0;
  }
  add(other) {
    if(this.color != other.color) {
      throw new Error("色が合わない")
    }
    this.count += other.count;
  }
  countUp() {
    this.count++;
  }
  isEmpty() {
    return this.color == "empty";
  }
}

class Stone {
  /** @type {'fixed' | 'falling'} */
  state;
  gameObject;
  childGameObject;
  /**
   * 
   * @param {StoneColor} color 
   * @param {'fixed' | 'falling'} state 
   */
  constructor(color, state = 'fixed') {
    this.color = color;
    this.state = state;
  }

  isEmtpy() {
    return this.color == "empty";
  }

  static red() {
    return new Stone('red');
  }
  static blue() {
    return new Stone('blue');
  }
}

class Stones {
  values = [
    ["blue", "blue", "blue", "blue", "red", "red"],
    ["red", "red", "red", "red", "blue", "blue"],
    ["red", "red", "red", "red", "blue", "blue"],
    new Array(6).fill("empty"),
    new Array(6).fill("empty"),
    new Array(6).fill("empty"),
    new Array(6).fill("empty"),
    new Array(6).fill("empty"),
  ].map(row => row.map(cell => new Stone(cell)));

  drop(columnNumber, pullStones) {
    // 末端を探す
    for(var i = 0; i < this.values.length; i++) {
      let target = this.values[i][columnNumber];
      if(target.color == "empty") {
        break;
      }
    }
    // 落とす
    for(var j = 0; j < pullStones.count; j++) {
      this.values[i + j][columnNumber].color = pullStones.color;
      this.values[i + j][columnNumber].state = "falling";
    }
  }
  pull(columnNumber) {
    const stoneColor = this.getLastColor(columnNumber);
    // var stoneColor = "empty";
    var result = new PullStones(stoneColor, 0);
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(target.color == "empty") {
        continue;
      }
      if(target.color == stoneColor) {
        result.countUp();
        target.color = "empty";
      } else {
        break;
      }
    }
    return result;
  }
  disappear(columnNumber) {
    // fallingsを探す

    // ヒットしたらタテに3つつながっているか判定する

    // つながっていたら、横とのつながりも見る
    // 消す
  }
  getLastColor(columnNumber) {
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(target.color !== "empty") {
        return target.color;
      }
    }
    return "empty"
  }
  update() {
  }
}

class MagicalDropGame {
  widthCount;
  heightCount;
  stones;
  pullStones = new PullStones("empty", 0);
  constructor(config) {
    config = config || {};
    this.widthCount = config.widthCount || 6;
    this.heightCount = config.heightCount || 8;

    this.stones = new Stones();
  }
  
  pull(columnNumber) {
    const color = this.stones.getLastColor(columnNumber);
    if(color == "empty") {
      return;
    }
    if(this.pullStones.isEmpty()) { 
      this.pullStones = this.stones.pull(columnNumber);
    } else if(this.pullStones.color == color) {
      this.pullStones.add(this.stones.pull(columnNumber))
    }
  }

  drop(columnNumber) {
    if(this.pullStones.isEmpty()) {
      return;
    }
    if(this.pullStones.color == this.stones.getLastColor(columnNumber)) {
      this.stones.drop(columnNumber, this.pullStones);
      this.pullStones.clear();
    }
  }

  step() {}
}