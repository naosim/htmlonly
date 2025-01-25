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
    if (this.gamepad.left) {
      this.gameObject.body.setVelocityX(-160);
    } else if (this.gamepad.right) {
      this.gameObject.body.setVelocityX(160);
    } else {
      this.gameObject.body.setVelocityX(0);
    }

    if (
      (this.gamepad.up || this.gamepad.buttonIsDown) &&
      (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    ) {
      this.gameObject.body.setVelocityY(-330);
    }
    this.scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
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
  }

  get up() {
    return this.cursors?.up.isDown || this.vgamepad?.up;
  }

  get down() {
    return this.cursors?.down.isDown || this.vgamepad?.down;
  }

  get right() {
    return this.cursors?.right.isDown || this.vgamepad?.right;
  }

  get left() {
    return this.cursors?.left.isDown || this.vgamepad?.left;
  }

  get buttonIsDown() {
    return this.vgamepad?.buttonIsDown;
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