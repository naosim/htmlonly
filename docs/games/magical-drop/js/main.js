(function() { // startprogram
const gridSize = 32;
const gridHalfSize = gridSize / 2;
const 列数 = 12;
const 行数 = 12;
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



class MagicalDropVirtualGamePad {
  right = {isDown:false};
  left = {isDown:false};
  up = {isDown:false};
  down = {isDown:false};
  /**
   * 
   * @param {Phaser.Scene} scene 
   */
  create(scene) {
    const buttonWidth = 100;
    const buttonHeight = 60;
    const rightButton = scene.add.rectangle(
      scene.sys.canvas.width / 2 + 40, 
      scene.sys.canvas.height - 160, 
      buttonWidth, buttonHeight, 0xffffff).setOrigin(0, 0);
    rightButton.setInteractive();
    rightButton.on('pointerdown', () => { this.right.isDown = true });
    scene.add.text(rightButton.x + 10, rightButton.y + 10, '>', {fontSize: '44px', color: '#000000'});

    const leftButton = scene.add.rectangle(
      scene.sys.canvas.width / 2 - 40 - buttonWidth, 
      scene.sys.canvas.height - 160, 
      buttonWidth, buttonHeight, 0xffffff).setOrigin(0, 0);
    leftButton.setInteractive();
    leftButton.on('pointerdown', () => { this.left.isDown = true });
    scene.add.text(leftButton.x + 10, leftButton.y + 10, '<', {fontSize: '44px', color: '#000000'});

    const upButton = scene.add.rectangle(
      scene.sys.canvas.width / 2 - buttonWidth / 2, 
      scene.sys.canvas.height - 160 - buttonHeight, 
      buttonWidth, buttonHeight, 0xffffff).setOrigin(0, 0);
    upButton.setInteractive();
    upButton.on('pointerdown', () => { this.up.isDown = true });
    scene.add.text(upButton.x + 10, upButton.y + 10, 'おく', {fontSize: '24px', color: '#000000'});

    const downButton = scene.add.rectangle(
      scene.sys.canvas.width / 2 - buttonWidth / 2, 
      scene.sys.canvas.height - 160 + buttonHeight, 
      buttonWidth, buttonHeight, 0xffffff).setOrigin(0, 0);
    downButton.setInteractive();
    downButton.on('pointerdown', () => { this.down.isDown = true });
    scene.add.text(downButton.x + 10, downButton.y + 10, 'とる', {fontSize: '24px', color: '#000000'});

    scene.events.on('postupdate', this.postUpdate, this);
  }
  postUpdate() {
    this.right.isDown = false;
    this.left.isDown = false;
    this.up.isDown = false;
    this.down.isDown = false;
  }
}

class GameKey {
  constructor(cursors, vgamepad, key) {
    this.cursors = cursors;
    this.vgamepad = vgamepad;
    this.key = key;
  }
  get isDown() {
    return this.cursors[this.key].isDown || this.vgamepad[this.key].isDown;
  }
}

class MagicalDropGamePad {
  /** @type {GameKey} */
  // @ts-ignore
  up;
  /** @type {GameKey} */
  // @ts-ignore
  down;
  /** @type {GameKey} */
  // @ts-ignore
  right;
  /** @type {GameKey} */
  // @ts-ignore
  left;
  #vgamePad = new MagicalDropVirtualGamePad();
  create(scene) {
    this.#vgamePad.create(scene);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.up = new GameKey(this.cursors, this.#vgamePad, "up");
    this.down = new GameKey(this.cursors, this.#vgamePad, "down");
    this.right = new GameKey(this.cursors, this.#vgamePad, "right");
    this.left = new GameKey(this.cursors, this.#vgamePad, "left");
  }
}

/** 
 * プレイヤー。矢印で操作できる
 */
class Player {
  gameObject;
  game;
  gamepad;// cursorsから変更
  pullStones = new PullStones("空", 0);

  /**
   * 
   * @param {{right:{isDown:boolean}, left:{isDown:boolean}}} gamepad 
   */
  constructor(game, gamepad) {
    this.game = game;
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
    const player = this.gameObject = scene.add.rectangle(gridHalfSize, 400, gridSize, 28, 0xffffff);
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

    if(this.game.持ってる石.は空である) {
      this.gameObject.fillColor = 0xffffff;
    } else {
      this.gameObject.fillColor = ColorConverter.システム色値に変換(this.game.持ってる石.色);
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
    for(let i = 0; i < Math.min(格子.values.length, 12); i++) {
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

const magicalDropGame = new MagicalDropGame({
  初期格子: InicialGrid.ランダム({行数, 列数}),
  モード: new BasicModeController(),
  行数, 列数
});
const magicalDropGamePad = new MagicalDropGamePad();
// const gamepad = GamepadWrapper.init();
const player = new Player(magicalDropGame, magicalDropGamePad);
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
  this.add.line(this.sys.canvas.width/2, gridSize * 行数, 0, 0, this.sys.canvas.width, 0, 0x888888);// 超えたらゲームオーバーになる線
  格子スプライト.create(this);
  格子スプライト.update(magicalDropGame.格子);

  
  player.create(this);
  // gamepad.createArrowKeys(this, {joystickPos:{x:this.sys.canvas.width / 2, y:520}, joystickScale:1.8});

  magicalDropGamePad.create(this);
}

var gameStep = 0;
function update() {
  if(magicalDropGame.ゲームオーバー) {
    return;
  }
  const columnNumber = (player.gameObject.x - gridHalfSize) / gridSize;
  if(magicalDropGamePad.down.isDown) {
    magicalDropGame.取る(columnNumber);
  }
  if(magicalDropGamePad.up.isDown) {
    magicalDropGame.置く(columnNumber);
  }
  gameStep = (gameStep + 1) % 10;
  if(gameStep === 0) {
    magicalDropGame.update();
  }
  
  格子スプライト.update(magicalDropGame.格子);

  if(magicalDropGame.ゲームオーバー) {
    alert("ゲームオーバー");
  }
}

})(); // endprogram