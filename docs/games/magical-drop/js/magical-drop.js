
/**
 * @typedef {'赤' | '青' | '緑' | '黄'} StoneColor
 */

/**
 * @typedef {{row:number, column:number}} Pos
 */

/**
 * 取った石
 */
class PullStones {
  /** @type {StoneColor | "空"} */
  #色;
  /**
   * 石の色。空の場合は例外を投げる
   * @returns {StoneColor}
   */
  get 色() {
    if(this.#色 == "空") {
      throw new Error("空");
    }
    return this.#色;
  }
  /** @type {number} */
  #数;
  get 数() { return this.#数 }
  constructor(色, 数) {
    this.#色 = 色;
    this.#数 = 数;
  }
  static 空() {
    return new PullStones("空", 0);
  }

  clear() {
    this.#色 = "空";
    this.#数 = 0;
  }
  /**
   * 
   * @param {Stone} stone 
   * @returns 
   */
  同じ色(stone) {
    return this.色 == stone.色;
  }
  /**
   * 
   * @param {PullStones} other 
   * @returns 
   */
  add(other) {
    if(!other || other.は空である) {
      return;
    }
    if(this.#色 != other.#色) {
      throw new Error("色が合わない")
    }
    this.#数 += other.#数;
  }
  countUp() {
    this.#数++;
  }
  get は空である() {
    return this.#色 == "空";
  }
  get は空でない() {
    return this.#色 !== "空";
  }
}

class Stone {
  /** @type {'固定' | '落ちてる'} */
  状態;
  /** @type {StoneColor} */
  色;
  位置;
  確認済み = false;
  get 未確認() {
    return !this.確認済み;
  }

  /**
   * 
   * @param {StoneColor} 色
   * @param {Pos} 位置 
   * @param {'固定' | '落ちてる'} 状態 
   */
  constructor(色, 位置, 状態 = '固定') {
    this.色 = 色;
    this.位置 = 位置;
    this.状態 = 状態;
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
   * @param {number} row 
   */
  行を更新する(row) {
    if(this.#石) {
      this.#石.位置.row = row;
    } else if(this.#空) {
      this.#空.位置.row = row;
    }
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
   * @param {'固定' | '落ちてる'} 状態
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

  static ランダムな石(位置) {
    var factories = [
      () => StoneOrEmpty.赤(位置), 
      () => StoneOrEmpty.青(位置), 
      () => StoneOrEmpty.緑(位置), 
      () => StoneOrEmpty.黄(位置), 
    ];
    return factories[Math.floor(Math.random() * factories.length)]();
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
  static 緑(位置) {
    return new StoneOrEmpty(new Stone("緑", 位置), undefined);
  }

  /**
   * 
   * @param {Pos} 位置 
   * @returns 
   */
  static 黄(位置) {
    return new StoneOrEmpty(new Stone("黄", 位置), undefined);
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
    } else if(text == "緑") {
      return StoneOrEmpty.緑(pos);
    } else if(text == "黄") {
      return StoneOrEmpty.黄(pos);
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
  /** @type { StoneOrEmpty[][]} */
  values;

  /**
   * 
   * @param {InicialGrid} 初期格子 
   */
  constructor(初期格子) {
    this.values = 初期格子.value.trim().split("\n").map(v => v.trim()).map(v => v.split(""))
    .map((v, row) => v.map((cell, column) => StoneOrEmpty.テキストから生成(cell, {row, column})));

    this.values = [...this.values, ...new Array(this.values.length).fill("空空空空空空空空空空空空")
      .map((v, row) => v.split("").map((cell, column) => StoneOrEmpty.テキストから生成(cell, {row, column})))];
  }

  get 列数() { return this.values[0].length; }

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
    return this.石リスト.filter(v => v.状態 == "落ちてる");
  }

  列にある落ちてる石リスト(columnNumber) {
    return this.列を取得する(columnNumber).filter(v => v.は石である && v.石.状態 == "落ちてる").map(v => v.石);
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
    this.石だけforEach(v => v.状態 = "固定");
  }

  落ちる石を決める() {
    for(let column = 0; column < this.values[0].length; column++) {
      let 空を見つけた = false;
      for(let row = 0; row < this.values.length; row++) {
        if(!空を見つけた && this.values[row][column].は空である) {
          空を見つけた = true;
        }
        if(空を見つけた && this.values[row][column].は石である) {
          this.values[row][column].石.状態 = "落ちてる";
        }
      }
    }
  }

  /**
   * 
   * @param {number} columnNumber 
   * @param {PullStones} pullStones 
   */
  置く(columnNumber, pullStones) {

    //console.log(this.values);
    // 末端を探す
    for(var i = 0; i < this.values.length; i++) {
      let target = this.values[i][columnNumber];
      if(target.は空である) {
        break;
      }
    }
    // 落とす
    for(var j = 0; j < pullStones.数 && i + j < this.values.length; j++) {
      this.values[i + j][columnNumber].to石(pullStones.色, "落ちてる")
    }
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns 
   */
  取る(columnNumber) {
    if(this.列がすべて空(columnNumber)) {
      throw new Error("石がない");
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

  最下部の石の行() {
    var result = 0;
    for(let column = 0; column < this.values[0].length; column++) {
      if(this.列がすべて空(column)) {
        continue;
      }
      result = Math.max(result, this.最下部の石(column).位置.row);
    }
    return result;
  }

  行を追加できる() {
    var max = 0;
    for(let column = 0; column < this.values[0].length; column++) {
      if(this.列がすべて空(column)) {
        max = Math.max(max, 0);
      } else {
        max = Math.max(max, this.最下部の石(column).位置.row);
      }
    }
    return max < this.values.length - 1;
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

  列を取得する(columnNumber) {
    const result = [];
    for(let row = 0; row < this.values.length; row++) {
      result.push(this.values[row][columnNumber]);
    }
    return result;
  }

  落ちる() {
    console.log(this.values);
    for(let column = 0; column < this.values[0].length; column++) {
      var 列にある落ちてる石リスト = this.列にある落ちてる石リスト(column);
      if(列にある落ちてる石リスト.length == 0) {
        continue;
      }
      for(let row = 0; row < this.values.length && 列にある落ちてる石リスト.length > 0; row++) {
        if(this.values[row][column].は石である) {
          continue;
        }
        /** @type {Stone} */
        // @ts-ignore
        var 落ちてる石 = 列にある落ちてる石リスト.shift();
        this.values[row][column].to石(落ちてる石.色, "落ちてる");
        this.values[落ちてる石.位置.row][落ちてる石.位置.column].to空();
      }
    }
  }

  最上部に1行追加する() {
    var 行数 = this.values.length;
    var 追加する行 = new Array(this.values[0].length).fill(0).map((v, i) => StoneOrEmpty.ランダムな石({row: 0, column: i}));
    this.values = [追加する行, ...this.values].slice(0, 行数);
    this.values.forEach((v, row) => v.forEach((cell, column) => cell.行を更新する(row)));
    console.log("行数", this.values.length);
  }
  
}

/**
 * 状態遷移
 */
class StateTransition {
  /**
   * @type {"通常" | "置く" | "消せるか確認する" | "消す" | "落ちる"}
   */
  #値;
  get が通常() { return this.#値 == "通常"; }
  get が置く() { return this.#値 == "置く"; }
  get が消せるか確認する() { return this.#値 == "消せるか確認する"; }
  get が消す() { return this.#値 == "消す"; }
  get が落ちる() { return this.#値 == "落ちる"; }
  /**
   * @type {()=>boolean}
   */
    消せるか確認する関数;
  /**
   * 
   * @param {()=>boolean} 消せるか確認する関数 
   */
  constructor(消せるか確認する関数) {
    this.#値 = "通常";
    this.消せるか確認する関数 = 消せるか確認する関数;
  }

  置く() {
    if(this.が通常) {
      this.#値 = "置く";
    } else {
      throw new Error("状態遷移がおかしい");
    }
  }

  次へ() {
    if(this.が置く) {
      this.#値 = "消せるか確認する";
    } else if(this.が消せるか確認する) {
      this.#値 = this.消せるか確認する関数() ? "消す" : "通常";
    } else if(this.が消す) {
      this.#値 = "落ちる";
    } else if(this.が落ちる) {
      this.#値 = "消せるか確認する";
    }
  }
}

class InicialGrid {
  /** @type {string} */
  // @ts-ignore
  value;
  constructor(value) {
    this.value = value;
  }

  static 開発用() {
    const value = `
      青青青青赤赤黄緑赤赤黄緑
      赤赤赤赤青青黄緑青青黄緑
      青赤空空青青黄緑青青黄緑
      青空空空空青空空空青空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
      空空空空空空空空空空空空
    `;
    return new InicialGrid(value);
  }

  /**
   * 
   * @param {{行数:number, 列数:number}} param0
   * @returns 
   */
  static ランダム({行数, 列数}) {
    var 色リスト = ["赤", "青", "緑", "黄"];
    var value = new Array(行数).fill(0).map((_, row) => { 
      if(row >= 4) {
        return new Array(列数).fill(0).map(v => "空").join("");
      }
      return new Array(列数).fill(0).map(v => 色リスト[Math.floor(Math.random() * 4)]).join("");
    }).join("\n");
    console.log(value);
    return new InicialGrid(value);
  }
}

/** @interface
 * @typedef {{setGame: (game:MagicalDropGame) => void, update: () => void}} ModeController
 */

/**
 * ステージを管理する
 * @implements {ModeController}
 * */
class BasicModeController {
  /** @type {MagicalDropGame} */
  game;

  step = 0;

  /**
   * 
   * @param {MagicalDropGame} game 
   */
  setGame(game) {
    this.game = game;
  }

  update() {
    this.step = (this.step + 1) % 50;
    if(this.step == 0) {
      this.game.最上部に1行追加する();
      // if(this.game.格子.最下部の石の行() < this.game.行数 - 1) {
      //   this.game.最上部に1行追加する();
      // } else {
      //   alert("ゲームオーバー")
      // }
    }
  }
}



/** @typedef {{初期格子:InicialGrid, モード:ModeController, 行数:number, 列数:number}} MagicalDropGameConfig */

class MagicalDropGame {
  格子;
  状態 = new StateTransition(() => this.消せるか確認する());
  /** @type {PullStones} */
  持ってる石 = PullStones.空();
  モード;
  ゲームオーバー = false;
  /**
   * 
   * @param {MagicalDropGameConfig} config 
   */
  constructor(config) {
    this.格子 = new Grid(config.初期格子);
    this.モード = config.モード;
    this.モード.setGame(this);
    this.列数 = config.列数;
    this.行数 = config.行数;

    if(this.格子.列数 != this.列数) {
      throw new Error("列数が一致しない");
    }


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
    if(!this.持ってる石 || this.持ってる石.は空である) { 
      this.持ってる石 = this.格子.取る(columnNumber);
    } else if(this.持ってる石.同じ色(最下部の石)) {
      this.持ってる石.add(this.格子.取る(columnNumber))
    }

    console.log(this.格子.values);
  }

  /**
   * 
   * @param {number} columnNumber 
   * @returns 
   */
  置く(columnNumber) {
    if(this.持ってる石.は空である) {
      return;
    }
    if(this.格子.列がすべて空(columnNumber)) {
      return
    }
        
    this.格子.置く(columnNumber, this.持ってる石);
    this.持ってる石.clear();

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


  最上部に1行追加する() {
    this.格子.最上部に1行追加する();
  }

  step = 0;
  update() {
    if(this.ゲームオーバー) {
      return;
    }

    if(this.状態.が消す) {
      this.消す();
    }
    if(this.状態.が落ちる) {
      this.落ちる();
    }
    this.状態.次へ();

    this.モード.update();
    if(this.状態.が通常 && this.格子.最下部の石の行() > this.行数 - 1) {
      this.ゲームオーバー = true;
    }
  }
}