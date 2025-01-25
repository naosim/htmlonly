// title: アクションゲーム はしご

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
 class Player {
  gameObject;
  // cursors;
  gamepad;
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  create(scene) {
    this.scene = scene;
    const player = (this.gameObject = scene.physics.add.existing(
      scene.add.rectangle(100, 300, 16, 28, 0xffff00)
    ));
    player.body.setCollideWorldBounds(true);

    scene.events.on('update', this.update, this);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.gamepad.left.isDown) {
      this.gameObject.body.setVelocityX(-160);
    } else if (this.gamepad.right.isDown) {
      this.gameObject.body.setVelocityX(160);
    } else {
      this.gameObject.body.setVelocityX(0);
    }

    if (
      (this.gamepad.up.isDown || this.gamepad.button.isDown) &&
      (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    ) {
      this.gameObject.body.setVelocityY(-330);
    }
    this.scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
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

class Gamepad {
  constructor(vgamepad) {
    this.vgamepad = vgamepad;
  }
  create(scene) {
    this.scene = scene;
    if (!scene.input.keyboard) {
      throw new Error("scene.input.keyboard is undefined");
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.up = new GameKey(this.cursors, this.vgamepad, "up");
    this.down = new GameKey(this.cursors, this.vgamepad, "down");
    this.right = new GameKey(this.cursors, this.vgamepad, "right");
    this.left = new GameKey(this.cursors, this.vgamepad, "left");
    this.button = this.vgamepad.button;
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
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const vgamepad = new VirtualGamepad();
const gamepad = new Gamepad(vgamepad);
const player = new Player(gamepad);
var game = new Phaser.Game(config);
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100, endFrame:3});// 変更
}

function create() {
  player.create(this);
  const platforms = createPlatforms(this);

  this.physics.add.collider(player.gameObject, platforms);

  gamepad.create(this);
  vgamepad.create(this);
  vgamepad.addJoystick(100, 300, 1.2, 'gamepad');
  vgamepad.addButton(300, 300, 1.0, 'gamepad');
}

function createPlatforms(scene) {
  const platforms = scene.physics.add.group([
    scene.physics.add.existing(scene.add.rectangle(100, 360, 200, 20, 0x0000ff)),
    scene.physics.add.existing(scene.add.rectangle(300, 220, 200, 300, 0x0000ff)),
  ]);

  platforms.getChildren().forEach(obj => {
    obj.body.setImmovable(true);
    obj.body.allowGravity = false;
  });
  
  return platforms;
}

function update() {
  // player.update(this);
}

})(); // endprogram