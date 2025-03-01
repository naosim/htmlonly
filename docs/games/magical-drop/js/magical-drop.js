
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
  color;
  groupId;
  /**
   * 
   * @param {StoneColor} color 
   * @param {'fixed' | 'falling'} state 
   */
  constructor(color, state = 'fixed') {
    this.color = color;
    this.state = state;
  }

  toEmpty() {
    this.color = "empty";
    this.state = "fixed";
    this.groupId = null;
  }

  isEmpty() {
    return this.color == "empty";
  }

  static red() {
    return new Stone('red');
  }
  static blue() {
    return new Stone('blue');
  }

  static empty() {
    return new Stone("empty");
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

  groupMap;
  constructor() {
    this.grouping();
  }

  forEach(cb) {
    for(let row = 0; row < this.values.length; row++) {
      for(let column = 0; column < this.values[0].length; column++) {
        cb(this.values[row][column], row, column);
      }
    }
  }

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

  grouping() {
    // clear
    this.forEach((v) => v.groupId = null);

    var groupId = 1;
    const groupMap = {};
    this.forEach((v, row, column) => {
      if(v.isEmpty() || v.groupId !== null) {
        return;
      }
      v.groupId = groupId;
      var group = [v];
      groupMap[groupId] = group;
      var targets = [];
      // up
      if(row > 0) {
        targets.push(this.values[row - 1][column]);
      }
      // down
      if(row < this.values.length - 1) {
        targets.push(this.values[row + 1][column]);
      }
      // left
      if(column > 0) {
        targets.push(this.values[row][column - 1]);
      }
      // right
      if(column < this.values[0].length - 1) {
        targets.push(this.values[row][column + 1]);
      }

      // groupIdがあるものだけ残す
      targets = targets
        .filter(t => 
          !t.isEmpty() 
          && t.groupId
          && t.groupId != groupId
          && v.color == t.color);
      targets.forEach(t => {
          // マージする
          var otherGroupId = t.groupId;
          if(groupId == otherGroupId) {
            return;
          }
          groupMap[otherGroupId].forEach(p => {
            p.groupId = groupId;
            group.push(p);
          })
          delete groupMap[otherGroupId];
          
        });
      groupId++;
    });

    console.log(groupMap);
    this.groupMap = groupMap;
  }


  getLastStone(columnNumber) {
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(target.color !== "empty") {
        return target;
      }
    }
    return Stone.empty();
  }

  getLastColor(columnNumber) {
    return this.getLastStone(columnNumber).color;
    // for(let i = this.values.length - 1; i >= 0; i--) {
    //   let target = this.values[i][columnNumber];
    //   if(target.color !== "empty") {
    //     return target.color;
    //   }
    // }
    // return "empty"
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
    if(this.pullStones.color !== this.stones.getLastColor(columnNumber)) {
      return;
    }
    
    this.stones.drop(columnNumber, this.pullStones);
    this.pullStones.clear();
  }

  dosappearWithColumnNumber(columnNumber) {
    // falling以外は処理対象外
    if(this.stones.getLastStone().state !== "falling") {
      return;
    }
  }

  disappear() {
    this.stones.grouping();
    var disappearGroupIds = new Set();
    this.stones.forEach(v => {if(v.state == "falling") disappearGroupIds.add(v.groupId)});
    disappearGroupIds.forEach(v => {
      this.stones.groupMap[v].forEach(stone => {
        stone.toEmpty();
      })
    })
    // for(let columnNumber = 0; columnNumber < this.widthCount; columnNumber++) {
    //   this.dosappearWithColumnNumber(columnNumber);
    // }
    // fallingsを探す

    // ヒットしたらタテに3つつながっているか判定する

    // つながっていたら、横とのつながりも見る
    // 消す
  }

  step() {}
}