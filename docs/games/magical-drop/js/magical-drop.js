
/**
 * @typedef {'赤' | '青'} StoneColor
 */

/**
 * @typedef {{row:number, column:number}} Pos
 */

/**
 * 取った石
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
  確認済み = false;
  get 未確認() {
    return !this.確認済み;
  }

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
  values = `
    青青青青赤赤
    赤赤赤赤青青
    青赤空空青青
    空空空空空青
    空空空空空空
    空空空空空空
    空空空空空空
    空空空空空空
    `.trim().split("\n").map(v => v.trim()).map(v => v.split(""))
    .map((v, row) => v.map((cell, column) => StoneOrEmpty.テキストから生成(cell, {row, column})));
  // values = [
  //   ["青", "青", "青", "青", "赤", "赤"],
  //   ["赤", "赤", "赤", "赤", "青", "青"],
  //   ["赤", "赤", "赤", "赤", "青", "青"],
  //   new Array(6).fill("空"),
  //   new Array(6).fill("空"),
  //   new Array(6).fill("空"),
  //   new Array(6).fill("空"),
  //   new Array(6).fill("空"),
  // ].map((v, row) => v.map((cell, column) => StoneOrEmpty.テキストから生成(cell, {row, column})));

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

  空である(row, column) {
    return this.values[row][column].は空である;
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

  get 石リスト() {
    var result = [];
    this.石だけforEach((v) => result.push(v));
    return result;
  }

  get 落ちてる石リスト() {
    return this.石リスト.filter(v => v.状態 == "falling");
  }

  縦三つが揃っているか(row, column) {
    return [
      [row - 2, row - 1, row],
      [row - 1, row, row + 1],
      [row, row + 1, row + 2],
    ].filter(ary => ary.every(v => v >= 0 && v < this.values.length))
    .filter(ary => ary.every(v => this.values[v][column].は石である))
    .filter(ary => ary.every(v => this.values[v][column].石.色 == this.values[row][column].石.色))
    .length > 0;
  }

  /**
 * 
 * @param {Pos} 指定位置 
 */
  同じ色の隣を消して指定位置も消す(指定位置) {
    var 石または空 = this.values[指定位置.row][指定位置.column];
    if(石または空.は空である) {
      // throw new Error("空");
      return;
    }
    var 石 = 石または空.石;
    石.確認済み = true;
    var 上下左右 = [
      {row: 指定位置.row - 1, column: 指定位置.column},
      {row: 指定位置.row + 1, column: 指定位置.column},
      {row: 指定位置.row, column: 指定位置.column - 1},
      {row: 指定位置.row, column: 指定位置.column + 1},
    ].filter(v => v.row >= 0 && v.row < this.values.length && v.column >= 0 && v.column < this.values[0].length)
    .filter(v => this.values[v.row][v.column].は石である)
    .filter(v => this.values[v.row][v.column].石.未確認)
    .filter(v => this.values[v.row][v.column].石.同じ色(石))
    .forEach(v => this.同じ色の隣を消して指定位置も消す(v))

    石または空.to空(); 
  }

  確認済みをクリアする() {
    this.石だけforEach(v => v.確認済み = false);
    this.石だけforEach(v => v.状態 = "fixed");
  }

  落ちる石を決める() {
    for(let column = 0; column < this.values[0].length; column++) {
      let 空を見つけた = false;
      for(let row = 0; row < this.values.length; row++) {
        if(!空を見つけた && this.values[row][column].は空である) {
          空を見つけた = true;
        }
        if(空を見つけた && this.values[row][column].は石である) {
          this.values[row][column].石.状態 = "falling";
        }
      }
    }
  }

  // 落ちる() {
  //   for(let column = 0; column < this.values[0].length; column++) {

  //   }
      
  // }


  drop(columnNumber, pullStones) {

    console.log(this.values);
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

class StateTransition {
  /**
   * @type {"通常" | "置く" | "消せるか確認する" | "消す" | "落ちる"}
   */
  値;
  get が通常() { return this.値 == "通常"; }
  get が置く() { return this.値 == "置く"; }
  get が消せるか確認する() { return this.値 == "消せるか確認する"; }
  get が消す() { return this.値 == "消す"; }
  get が落ちる() { return this.値 == "落ちる"; }
  /**
   * @type {()=>boolean}
   */
    消せるか確認する関数;
  /**
   * 
   * @param {()=>boolean} 消せるか確認する関数 
   */
  constructor(消せるか確認する関数) {
    this.値 = "通常";
    this.消せるか確認する関数 = 消せるか確認する関数;
  }

  置く() {
    if(this.が通常) {
      this.値 = "置く";
    } else {
      throw new Error("状態遷移がおかしい");
    }
  }

  次へ() {
    if(this.が置く) {
      this.値 = "消せるか確認する";
    } else if(this.が消せるか確認する) {
      this.値 = this.消せるか確認する関数() ? "消す" : "通常";
    } else if(this.が消す) {
      this.値 = "落ちる";
    } else if(this.が落ちる) {
      this.値 = "消せるか確認する";
    }
  }
}

class MagicalDropGame {
  widthCount;
  heightCount;
  格子;
  状態 = new StateTransition(() => this.消せるか確認する());
  /** @type {PullStones} */
  pullStones = new PullStones("空", 0);
  constructor(config) {
    config = config || {};
    this.widthCount = config.widthCount || 6;
    this.heightCount = config.heightCount || 8;

    this.格子 = new Grid();
  }


  消せるか確認する() {
    var 結果 = false;
    this.格子.落ちてる石リスト.forEach(v => {
      if(this.格子.空である(v.位置.row, v.位置.column)) {
        return;
      }
      if(this.格子.縦三つが揃っているか(v.位置.row, v.位置.column)) {
        結果 = true;
      }
    });
    return 結果;
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
    if(!this.pullStones || this.pullStones.は空である) { 
      this.pullStones = this.格子.pull(columnNumber);
    } else if(this.pullStones.同じ色(最下部の石)) {
      this.pullStones.add(this.格子.pull(columnNumber))
    }

    console.log(this.格子.values);
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns 
   */
  置く(columnNumber) {
    if(this.pullStones.は空である) {
      return;
    }
    if(this.格子.列がすべて空(columnNumber)) {
      return
    }
        
    this.格子.drop(columnNumber, this.pullStones);
    this.pullStones.clear();

    console.log(this.格子.values);
    this.状態.置く();
  }

  消す() {
    this.格子.落ちてる石リスト.forEach(v => {
      if(this.格子.空である(v.位置.row, v.位置.column)) {
        return;
      }
      if(this.格子.縦三つが揃っているか(v.位置.row, v.位置.column)) {
        // TODO: つながってる石を消す
        this.格子.同じ色の隣を消して指定位置も消す(v.位置)
      }
    });
    this.格子.確認済みをクリアする()

    this.格子.落ちる石を決める();
    console.log(this.格子.values);
  }

  落ちる() {
    this.格子.落ちる()
  }

  step = 0;
  update() {
    this.step = (this.step + 1) % 10;
    if(this.step != 0) {
      return;
    }
    if(this.状態.が消す) {
      this.消す();
    }
    if(this.状態.が落ちる) {
      // this.落ちる();
    }
    this.状態.次へ();
    
  }
}