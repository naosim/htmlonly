// title: アクションゲーム 動く床

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
 class Player {
  gameObject;
  cursors;
  create(scene) {
    const player = (this.gameObject = scene.physics.add.existing(
      scene.add.rectangle(100, 300, 16, 28, 0xffff00)
    ));
    player.body.setCollideWorldBounds(true);
    //  Input Events
    if (!scene.input.keyboard) {
      throw new Error("scene.input.keyboard is undefined");
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update(/** @type {Phaser.Scene}*/ scene) {
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
    // scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
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
var movingObject;
function createPlatforms(scene) {
  // 移動するブロックを作成
  movingObject = scene.physics.add.existing(scene.add.rectangle(200, 300, 40, 16, 0x00ffff));

  const platforms = scene.physics.add.group([
    scene.physics.add.existing(scene.add.rectangle(100, 360, 100, 16, 0x0000ff)),
    scene.physics.add.existing(scene.add.rectangle(300, 360, 100, 16, 0x0000ff)),
    movingObject, // 当たり判定のグループに追加
  ]);

  // グループに追加したあとに物理設定を変更
  movingObject.body.setVelocityX(30);
  // 左右に動く処理
  movingObject.update = () => {
    if(movingObject.x > 300) {
      movingObject.body.setVelocityX(-30);
    } else if(movingObject.x < 200) {
      movingObject.body.setVelocityX(30);
    }
  };

  platforms.getChildren().forEach(obj => {
    obj.body.setImmovable(true);
    obj.body.allowGravity = false;
    obj.body.friction.x = 1; // groupに追加したときに0になってしまうため、変更。
  });
  
  return platforms;
}

function update() {
  player.update(this);
  movingObject.update(); // 左右に動く処理を呼び出し
}

})(); // endprogram