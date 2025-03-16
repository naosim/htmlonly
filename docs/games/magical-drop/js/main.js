(function() { // startprogram
const gridSize = 32;
const gridHalfSize = gridSize / 2;
const 列数 = 12;
function create2DArray(rowCount, columnCount, factory) {
  return new Array(rowCount).fill(null).map((_, row) => new Array(columnCount).fill(null).map((_, column) => factory(row, column)))
}

class ColorConverter {
  /**
   * 
   * @param {StoneColor} 色 
   * @returns 
   */
  static システム色値に変換(色) {
    if(色 === '赤') {
      return 0xff0000;
    }
    if(色 === '青') {
      return 0x0000ff;
    }
    if(色 === '緑') {
      return 0x00aa00;
    }
    if(色 === '黄') {
      return 0xffff00;
    }
    return 0x000000;
  }
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
    const player = this.gameObject = scene.add.rectangle(gridHalfSize, 400, gridSize, 28, 0xffff00);
    scene.events.on('update', this.update, this);
  }
  pressed = false;
  update() {
    if (this.gamepad.left.isDown) {
      if(!this.pressed) {
        this.gameObject.x -= gridSize;
        if(this.gameObject.x < 0) {
          this.gameObject.x = this.scene.sys.canvas.width - gridHalfSize;
        }
        this.pressed = true;
      }
    } else if (this.gamepad.right.isDown) {
      if(!this.pressed) {
        this.gameObject.x += gridSize;
        if(this.gameObject.x >= this.scene.sys.canvas.width) {
          this.gameObject.x = gridHalfSize;
        }
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
  /**@type {Phaser.GameObjects.Line} */
  // @ts-ignore
  line;

  /** @type {MagicalDropGame} */
  game;
  /**
   * 
   * @param {*} player 
   * @param {MagicalDropGame} game 
   */
  constructor(player, game) {
    this.player = player;
    this.game = game;
  }

  /**
   * 
   * @param {Phaser.Scene} scene 
   */
  create(scene) {
    this.line = scene.add.line(
      0, 
      0,
      0,
      0,
      0,
      800,
      0xff0000
    );
    scene.events.on('update', this.update, this);
  }

  update() {
    this.line.x = this.player.x;
    if(this.game.持ってる石.は空である) {
      this.line.strokeColor = 0xffffff;
    } else {
      this.line.strokeColor = ColorConverter.システム色値に変換(this.game.持ってる石.色);
    }
    
  }
}

/**
 * 格子のスプライト
 */
class GridSprite {
  /** @type {StoneSprite[][]} */
  gameObjects;
  game;
  /**
   * 
   * @param {MagicalDropGame} game 
   */
  constructor(game) {
    this.game = game;
  }
  create(scene) {
    this.gameObjects = create2DArray(12, this.game.列数, (r, c) => new StoneSprite().create(scene).setPos(c*gridSize, r*gridSize));
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
    if(!this.childGameObject) {
      return;
    }
    if(!value) {
      this.gameObject.visible = false;
      return;
    }
    var colorValue = ColorConverter.システム色値に変換(value);
    this.childGameObject.setFillStyle(colorValue);
    this.gameObject.visible = true;
    
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
  width: gridSize * 列数,
  height: 640,
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
const magicalDropGame = new MagicalDropGame({初期格子: InicialGrid.ランダム(列数)});
const gamepad = GamepadWrapper.init();
const player = new Player(gamepad);
const 補助線 = new AdditionalLineForPlayer(player, magicalDropGame);
const 格子スプライト = new GridSprite(magicalDropGame);
var game = new Phaser.Game(config);
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100});
}
// var stones
function create() {
  補助線.create(this);
  格子スプライト.create(this);
  格子スプライト.update(magicalDropGame.格子);

  
  player.create(this);
  gamepad.createArrowKeys(this, {joystickPos:{x:this.sys.canvas.width / 2, y:500}});
}

var gameStep = 0;
function update() {
  const columnNumber = (player.gameObject.x - gridHalfSize) / gridSize;
  if(gamepad.down.isDown) {
    magicalDropGame.取る(columnNumber);
  }
  if(gamepad.up.isDown) {
    magicalDropGame.置く(columnNumber);
  }
  gameStep = (gameStep + 1) % 10;
  if(gameStep === 0) {
    magicalDropGame.update();
  }
  
  格子スプライト.update(magicalDropGame.格子);
}

})(); // endprogram