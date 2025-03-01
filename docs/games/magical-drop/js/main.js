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
  pullStones = new PullStones("empty", 0);
  constructor(gamepad) {
    this.gamepad = gamepad;
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

    // if (
    //   (this.gamepad.up.isDown || this.gamepad.button.isDown) &&
    //   (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    // ) {
    //   this.gameObject.body.setVelocityY(-330);
    // }
    // this.scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
  }
}

class StonesSprite {
  /** @type {StoneSprite[][]} */
  gameObjects;
  constructor() {
    
  }
  createStone(scene) {
    this.gameObjects = create2DArray(12, 6, (r, c) => new StoneSprite().create(scene).setPos(c*gridSize, r*gridSize));
  }

  /**
   * 
   * @param {Stones} stones 
   */
  update(stones) {
    for(let i = 0; i < stones.values.length; i++) {
      for(let j = 0; j < stones.values[0].length; j++) {
        this.gameObjects[i][j].update(stones.values[i][j]);
      }
    }

  }
}

class StoneSprite {
  gameObject;
  childGameObject;
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
  constructor() {
    this.#color = "empty";
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
  update(stone) {
    this.color = stone.color;// update fill color
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
const magicalDropGame = new MagicalDropGame();
const stonesSprite = new StonesSprite();
var game = new Phaser.Game(config);
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100});
}
// var stones
function create() {
  player.create(this);

  // stones = new Stones();

  stonesSprite.createStone(this);
  stonesSprite.update(magicalDropGame.stones);

  gamepad.createAll(this, {joystickPos:{x:100, y:300}, buttonPos:{x:300, y:300}});
}

function update() {
  const columnNumber = (player.gameObject.x - gridHalfSize) / gridSize;
  if(gamepad.button.isPressed) {
    magicalDropGame.pull(columnNumber);
  }
  if(gamepad.up.isDown) {
    magicalDropGame.drop(columnNumber);
    // if(magicalDropGame.stones.getLastColor((player.gameObject.x - gridHalfSize) / gridSize) == player.pullStones.color) {
    //   magicalDropGame.stones.drop((player.gameObject.x - gridHalfSize) / gridSize, player.pullStones);
    //   player.pullStones.clear();
    //   console.log("drop");
    // }
       
  }

  stonesSprite.update(magicalDropGame.stones);
}

})(); // endprogram