// title: アクションゲーム スクリーンゲームパッド before

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
 class Player {
  gameObject;
  cursors;
  create(scene) {
    this.scene = scene;
    const player = (this.gameObject = scene.physics.add.existing(
      scene.add.rectangle(100, 300, 16, 28, 0xffff00)
    ));
    player.body.setCollideWorldBounds(true);
    //  Input Events
    if (!scene.input.keyboard) {
      throw new Error("scene.input.keyboard is undefined");
    }
    this.cursors = scene.input.keyboard.createCursorKeys();

    scene.events.on('update', this.update, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.gameObject.body.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.gameObject.body.setVelocityX(160);
    } else {
      this.gameObject.body.setVelocityX(0);
    }

    if (
      this.cursors.up.isDown &&
      (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    ) {
      this.gameObject.body.setVelocityY(-330);
    }
    this.scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
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
const player = new Player();
var game = new Phaser.Game(config);
function preload() {}

function create() {
  player.create(this);
  const platforms = createPlatforms(this);

  this.physics.add.collider(player.gameObject, platforms);
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
}

})(); // endprogram