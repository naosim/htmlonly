
/**
 * @typedef {'赤' | '青'} StoneColor
 */

/**
 * @typedef {{row:number, column:number}} Pos
 */

class PullStones {
  color;
  count;
  constructor(color, count) {
    this.color = color;
    this.count = count;
  }
  clear() {
    this.color = "空";
    this.count = 0;
  }
  /**
   * 
   * @param {Stone} stone 
   * @returns 
   */
  同じ色(stone) {
    return this.color == stone.色;
  }
  add(other) {
    if(!other) {
      return;
    }
    if(this.color != other.color) {
      throw new Error("色が合わない")
    }
    this.count += other.count;
  }
  countUp() {
    this.count++;
  }
  get は空である() {
    return this.color == "空";
  }
  get は空でない() {
    return this.color !== "空";
  }
}

class Stone {
  /** @type {'fixed' | 'falling'} */
  状態;
  /** @type {StoneColor} */
  色;
  位置;
  グループID;

  /**
   * 
   * @param {StoneColor} 色
   * @param {Pos} 位置 
   * @param {'fixed' | 'falling'} 状態 
   */
  constructor(色, 位置, 状態 = 'fixed') {
    this.色 = 色;
    this.位置 = 位置;
    this.状態 = 状態;
  }

  グループIDをクリアする() {
    this.グループID = null;
  }

  /**
   * 
   * @param {number | string} グループID 
   * @returns 
   */
  グループIDが同じ(グループID) {
    if(!this.グループID) {
      throw new Error("グループIDがない");
    }

    return this.グループID == グループID;
  }

  /**
   * 
   * @param {number | string} グループID 
   * @returns 
   */
  グループIDが違う(グループID) {
    return !this.グループIDが同じ(グループID);
  }

  get グループIDがすでにある() {
    return this.グループID !== null;
  }

  /**
   * 
   * @param {Stone} other 
   */
  同じ色(other) {
    return this.色 == other.色;
  }
}

/**
 * 空
 */
class Empty {
  位置;
  constructor(位置) {
    this.位置 = 位置;
  }
}

/**
 * 石または空
 */
class StoneOrEmpty {
  /** @type {Stone | undefined} */
  #石
  /** @type {Empty | undefined} */
  #空

  /**
   * @param {Stone | undefined} 石 
   * @param {Empty | undefined} 空 
   */
  constructor(石, 空) {
    if(石 && 空) {
      new Error("石も空もある");
    }
    if(!石 && !空) {
      new Error("石も空もない");
    }
    this.#石 = 石;
    this.#空 = 空;
  }

  /**
   * @return {Stone};
   */
  get 石() {
    if(!this.#石) {
      throw new Error("空");
    }
    return this.#石;
  }

  get 位置() {
    if(this.#石) {
      return this.#石.位置;
    } else if(this.#空) {
      return this.#空.位置
    }
    throw new Error();
  }

  /**
   * 
   * @param {(v:Stone) => void} cb 
   */
  もし石ならば(cb) {
    if(this.は石である) {
      cb(this.石);
    }
  }

  to空() {
    if(!this.#石) throw new Error("石でない");
    this.#空 = new Empty(this.#石.位置);
    this.#石 = undefined;
  }
  /**
   * 
   * @param {StoneColor} 色 
   * @param {"fixed" | "falling"} 状態
   */
  to石(色, 状態) {
    if(this.は石である) {
      throw new Error("石");
    }
    this.#石 = new Stone(色, this.#空?.位置, 状態);
    this.#空 = undefined;
  }

  get は空である() {
    return !!this.#空;
  }

  get は石である() {
    return !!this.#石;
  }

  /**
   * 
   * @param {Pos} 位置 
   * @returns 
   */
  static 赤(位置) {
    return new StoneOrEmpty(new Stone("赤", 位置), undefined);
  }
  /**
   * 
   * @param {Pos} 位置 
   * @returns 
   */
  static 青(位置) {
    return new StoneOrEmpty(new Stone("青", 位置), undefined);
  }

  /**
   * 
   * @param {Pos} 位置 
   * @returns 
   */
  static 空(位置) {
    return new StoneOrEmpty(undefined, new Empty(位置));
  }
  /**
   * 
   * @param {string} text 
   * @param {{row:number, column:number}} pos 
   * @returns 
   */
  static テキストから生成(text, pos) {
    if(text == "赤") {
      return StoneOrEmpty.赤(pos);
    } else if(text == "青") {
      return StoneOrEmpty.青(pos);
    } else if(text == "空") {
      return StoneOrEmpty.空(pos);
    }
    throw new Error("不明な値");
  }
}

/**
 * 格子
 */
class Grid {
  values = [
    ["青", "青", "青", "青", "赤", "赤"],
    ["赤", "赤", "赤", "赤", "青", "青"],
    ["赤", "赤", "赤", "赤", "青", "青"],
    new Array(6).fill("空"),
    new Array(6).fill("空"),
    new Array(6).fill("空"),
    new Array(6).fill("空"),
    new Array(6).fill("空"),
  ].map((v, row) => v.map((cell, column) => StoneOrEmpty.テキストから生成(cell, {row, column})));

  /** @type {{[key:string]:Stone[]}} */
  groupMap = {};
  constructor() {
    this.grouping();
  }

  /**
   * @param {(v:StoneOrEmpty, row:number, column:number) => void} cb 
   */
  forEach(cb) {
    for(let row = 0; row < this.values.length; row++) {
      for(let column = 0; column < this.values[0].length; column++) {
        cb(this.values[row][column], row, column);
      }
    }
  }

  /**
   * @param {(v:Stone, row:number, column:number) => void} cb 
   */
  石だけforEach(cb) {
    for(let row = 0; row < this.values.length; row++) {
      for(let column = 0; column < this.values[0].length; column++) {
        if(this.values[row][column].は石である) {
          cb(this.values[row][column].石, row, column);
        }
      }
    }
  }

  drop(columnNumber, pullStones) {
    // 末端を探す
    for(var i = 0; i < this.values.length; i++) {
      let target = this.values[i][columnNumber];
      if(target.は空である) {
        break;
      }
    }
    // 落とす
    for(var j = 0; j < pullStones.count; j++) {
      this.values[i + j][columnNumber].to石(pullStones.color, "falling")
      // this.values[i + j][columnNumber].color = pullStones.color;
      // this.values[i + j][columnNumber].state = "falling";
    }
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns 
   */
  pull(columnNumber) {
    if(this.列がすべて空(columnNumber)) {
      return undefined;
    }
    const 最下部の石 = this.最下部の石(columnNumber);
    const 最下部の石の色 = 最下部の石.色;
    // var stoneColor = "空";
    var result = new PullStones(最下部の石の色, 0);
    for(let i = this.values.length - 1; i >= 0; i--) {
      let 対象の石または空 = this.values[i][columnNumber];
      if(対象の石または空.は空である) {
        continue;
      }
      let 対象の石 = 対象の石または空.石;
      if(最下部の石.同じ色(対象の石)) {
        result.countUp();
        対象の石または空.to空()
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
    this.forEach((v) => v.もし石ならば(s => {
      s.グループIDをクリアする()
    }));

    var グループID = 1;
    /** @type {{[key:string]:Stone[]}} */
    const groupMap = {};
    this.forEach((対象の石または空, row, column) => {
      if(対象の石または空.は空である || 対象の石または空.石.グループIDがすでにある) {
        return;
      }
      const 対象の石 = 対象の石または空.石;
      対象の石.グループID = グループID;
      var グループ = [対象の石];
      groupMap[グループID] = グループ;
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
        .filter(t => t.は石である)
        .map(t => t.石)
        .filter(t => t.グループIDがすでにある
          && t.グループIDが違う(グループID)
          && 対象の石.同じ色(t));
      targets.forEach(t => {
          // マージする
          var otherGroupId = t.グループID;
          if(グループID == otherGroupId) {
            return;
          }
          groupMap[otherGroupId].forEach(p => {
            p.グループID = グループID;
            グループ.push(p);
          })
          delete groupMap[otherGroupId];
          
        });
      グループID++;
    });

    console.log(groupMap);
    this.groupMap = groupMap;
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns {Stone}
   */
  最下部の石(columnNumber) {
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(target.は石である) {
        return target.石;
      }
    }
    throw new Error("石がない");
  }

  列がすべて空(columnNumber) {
    return !this.列に石がある(columnNumber);
  }
  列に石がある(columnNumber) {
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(target.は石である) {
        return true;
      }
    }
    return false;
  }

  最下部の石の色(columnNumber) {
    return this.最下部の石(columnNumber).色;
  }
  update() {
  }
}

class MagicalDropGame {
  widthCount;
  heightCount;
  格子;
  /** @type {PullStones | undefined} */
  pullStones = undefined;
  constructor(config) {
    config = config || {};
    this.widthCount = config.widthCount || 6;
    this.heightCount = config.heightCount || 8;

    this.格子 = new Grid();
  }

  /**
   * 
   * @param {number} columnNumber 
   */
  取る(columnNumber) {
    if(this.格子.列がすべて空(columnNumber)) {
      return;
    }
    const 最下部の石 = this.格子.最下部の石(columnNumber);
    if(!this.pullStones) { 
      this.pullStones = this.格子.pull(columnNumber);
    } else if(this.pullStones.同じ色(最下部の石)) {
      this.pullStones.add(this.格子.pull(columnNumber))
    }
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns 
   */
  置く(columnNumber) {
    if(!this.pullStones) {
      return;
    }
    if(this.格子.列がすべて空(columnNumber) || !this.pullStones.同じ色(this.格子.最下部の石(columnNumber))) {
      return
    }
    
    //   if(this.pullStones.color !== this.格子.getLastColor(columnNumber)) {
    //   return;
    // }
    
    this.格子.drop(columnNumber, this.pullStones);
    this.pullStones.clear();
  }

  // disappearWithColumnNumber(columnNumber) {
  //   // falling以外は処理対象外
  //   if(this.格子.getLastStone().state !== "falling") {
  //     return;
  //   }
  // }

  disappear() {
    this.格子.grouping();
    var disappearGroupIds = new Set();
    this.格子.石だけforEach(v => {if(v.状態 == "falling") disappearGroupIds.add(v.グループID)});
    disappearGroupIds.forEach(v => {
      this.格子.groupMap[v].forEach(stone => {
        // stone.to空();
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