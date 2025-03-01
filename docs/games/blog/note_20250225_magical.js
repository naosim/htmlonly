// title: マジカルドロップ

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
class Player {
  gameObject;
  gamepad;// cursorsから変更
  pullStones = new PullStones("empty", 0);
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  create(scene) {
    this.scene = scene;
    const player = this.gameObject = scene.add.rectangle(8, 300, 16, 28, 0xffff00);
    scene.events.on('update', this.update, this);
  }
  pressed = false;
  update() {
    if (this.gamepad.left.isDown) {
      if(!this.pressed) {
        this.gameObject.x -= 16;
        this.pressed = true;
      }
    } else if (this.gamepad.right.isDown) {
      if(!this.pressed) {
        this.gameObject.x += 16;
        this.pressed = true;
      }
    } else {
      this.pressed = false;
    }

    // if (
    //   (this.gamepad.up.isDown || this.gamepad.button.isDown) &&
    //   (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    // ) {
    //   this.gameObject.body.setVelocityY(-330);
    // }
    // this.scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
  }
}

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

/**
 * @typedef {'red' | 'blue' | 'empty'} StoneColor
 */

class StoneSprites {
  constructor() {
  }
  createStone(scene) {
    var gameObject = scene.add.container(0, 0);
    const figure = this.childGameObject = scene.add.circle(8, 8, 8, 0x000000);
    this.color = this.color;// update fill color
    gameObject.add(figure);
  }
}

class Stone {
  /** @type {StoneColor} */
  #color;
  /**
   * @param {StoneColor} value
   */
  set color(value) {
    this.#color = value;
    if(this.childGameObject) {
      var colorValue = null;
      if(value === 'red') {
        colorValue = 0xff0000;
      }
      if(value === 'blue') {
        colorValue = 0x0000ff;
      }
      if(value === 'empty') {
        colorValue = 0x000000;
      }
      this.childGameObject.setFillStyle(colorValue);
    }
  }
  get color() {
    return this.#color;
  }
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


  create(scene) {
    this.gameObject = scene.add.container(0, 0);
    const figure = this.childGameObject = scene.add.circle(8, 8, 8, 0x000000);
    this.color = this.color;// update fill color
    this.gameObject.add(figure);
  }

  setPos(x, y) {
    this.gameObject.x = x;
    this.gameObject.y = y;
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

  create(scene) {
    this.values.forEach((row, y) => {
      row.forEach((stone, x) => {
        if (stone) {
          stone.create(scene);
        }
      });
    });
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
    var stoneColor = "empty";
    var result;
    for(let i = this.values.length - 1; i >= 0; i--) {
      let target = this.values[i][columnNumber];
      if(stoneColor == "empty") {
        if(target.color !== "empty") {
          stoneColor = target.color;
          result = new PullStones(stoneColor, 0);
        }
      }
      if(stoneColor !== "empty"){
        if(target.color == stoneColor) {
          result?.countUp();
          target.color = "empty";
        } else {
          break;
        }
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
    this.values.forEach((row, y) => {
      row.forEach((stone, x) => {
        if (stone) {
          stone.setPos(x * 16, y * 16);
        }
      });
    });
  }
}

var config = {
  parent: "phaser-example",
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const gamepad = GamepadWrapper.init();
const player = new Player(gamepad);

var game = new Phaser.Game(config);
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100});
}
var stones
function create() {
  player.create(this);

  stones = new Stones();
  stones.create(this);
  stones.update();

  gamepad.createAll(this, {joystickPos:{x:100, y:300}, buttonPos:{x:300, y:300}});
}

function update() {
  if(gamepad.button.isPressed) {
    const x = (player.gameObject.x - 8) / 16;
    const color = stones.getLastColor(x);
    if(color == "empty") {
      return;
    }
    
    if(player.pullStones.isEmpty()) { 
      player.pullStones = stones.pull(x);
    } else if(player.pullStones.color == color) {
      player.pullStones.add(stones.pull(x))
    }
    // stones.update();
  }
  if(!player.pullStones.isEmpty() && gamepad.up.isDown) {
    if(stones.getLastColor((player.gameObject.x - 8) / 16) == player.pullStones.color) {
      stones.drop((player.gameObject.x - 8) / 16, player.pullStones);
      player.pullStones.clear();
      console.log("drop");
    }
       
  }
}

})(); // endprogram