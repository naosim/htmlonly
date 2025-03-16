(function() { // startprogram
const gridSize = 24;
const gridHalfSize = gridSize / 2;
function create2DArray(rowCount, columnCount, factory) {
  return new Array(rowCount).fill(null).map((_, row) => new Array(columnCount).fill(null).map((_, column) => factory(row, column)))
}

/** 
 * プレイヤー。矢印で操作できる
 */
class Player {
  gameObject;
  gamepad;// cursorsから変更
  pullStones = new PullStones("空", 0);
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  get x() {
    return this.gameObject?.x;
  }
  get y() {
    return this.gameObject?.y;
  }
  create(scene) {
    this.scene = scene;
    const player = this.gameObject = scene.add.rectangle(gridHalfSize, 300, gridSize, 28, 0xffff00);
    scene.events.on('update', this.update, this);
  }
  pressed = false;
  update() {
    if (this.gamepad.left.isDown) {
      if(!this.pressed) {
        this.gameObject.x -= gridSize;
        this.pressed = true;
      }
    } else if (this.gamepad.right.isDown) {
      if(!this.pressed) {
        this.gameObject.x += gridSize;
        this.pressed = true;
      }
    } else {
      this.pressed = false;
    }
  }
}

/**
 * 補助線
 */
class AdditionalLineForPlayer {
  /** @type {Player} */
  player;
  line;
  constructor(player) {
    this.player = player;
  }

  create(scene) {
    this.line = scene.add.line(
      0, 
      0,
      0,
      0,
      0,
      600,
      0xff0000
    );
    scene.events.on('update', this.update, this);
  }

  update() {
    this.line.x = this.player.x;
  }
}

/**
 * 格子のスプライト
 */
class GridSprite {
  /** @type {StoneSprite[][]} */
  gameObjects;
  constructor() {
    
  }
  create(scene) {
    this.gameObjects = create2DArray(12, 6, (r, c) => new StoneSprite().create(scene).setPos(c*gridSize, r*gridSize));
  }

  /**
   * 
   * @param {Grid} 格子 
   */
  update(格子) {
    for(let i = 0; i < 格子.values.length; i++) {
      for(let j = 0; j < 格子.values[0].length; j++) {
          this.gameObjects[i][j].update(格子.values[i][j]);
      }
    }
  }
}

class StoneSprite {
  gameObject;
  childGameObject;
  /** @type {StoneColor | undefined} */
  #color;
  /**
   * @param {StoneColor | undefined} value
   */
  set color(value) {
    this.#color = value;
    if(this.childGameObject) {
      var colorValue = null;
      if(value === '赤') {
        colorValue = 0xff0000;
      }
      if(value === '青') {
        colorValue = 0x0000ff;
      }
      if(value === '緑') {
        colorValue = 0x00aa00;
      }
      if(value === '黄') {
        colorValue = 0xffff00;
      }
      if(!value) {
        colorValue = 0x000000;
      }
      this.childGameObject.setFillStyle(colorValue);
    }
  }
  get color() {
    return this.#color;
  }
  constructor() {
    this.#color = undefined;
  }
  create(scene) {
    this.gameObject = scene.add.container(0, 0);
    const figure = this.childGameObject = scene.add.circle(gridHalfSize, gridHalfSize, gridHalfSize, 0x000000);
    this.color = this.#color;// update fill color
    this.gameObject.add(figure);
    return this;
  }
  setPos(x, y) {
    this.gameObject.x = x;
    this.gameObject.y = y;
    return this;
  }
  /**
   * 
   * @param {StoneOrEmpty} 石または空 
   * @returns 
   */
  update(石または空) {
    this.color = 石または空.は石である ? 石または空.石.色: undefined;// update fill color
    return this;
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
const 補助線 = new AdditionalLineForPlayer(player);
const magicalDropGame = new MagicalDropGame();
const 格子スプライト = new GridSprite();
var game = new Phaser.Game(config);
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100});
}
// var stones
function create() {
  格子スプライト.create(this);
  格子スプライト.update(magicalDropGame.格子);

  補助線.create(this);
  player.create(this);

  gamepad.createAll(this, {joystickPos:{x:100, y:300}, buttonPos:{x:300, y:300}});
}

var gameStep = 0;
function update() {
  const columnNumber = (player.gameObject.x - gridHalfSize) / gridSize;
  if(gamepad.button.isPressed) {
    magicalDropGame.取る(columnNumber);
  }
  if(gamepad.up.isDown) {
    magicalDropGame.置く(columnNumber);
    // magicalDropGame.消す();
  }
  gameStep = (gameStep + 1) % 10;
  if(gameStep === 0) {
    magicalDropGame.update();
  }
  
  格子スプライト.update(magicalDropGame.格子);
}

})(); // endprogram