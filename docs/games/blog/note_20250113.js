// title: アクションゲーム 落ちる床
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

  this.physics.add.collider(player.gameObject, platforms, (player, platform) => {
    // 落ちるブロックに当たったときの処理
    if (platform.type == "fall" && !platform.isFallStarting) {
      platform.isFallStarting = true; //当たった瞬間だけイベントを拾う
      this.time.addEvent({ delay: 500, callback: ()=>{
        platform.body.allowGravity = true;// 落ちる
        platforms.remove(platform); // 当たり判定対象から削除
        this.time.addEvent({ delay: 1000, callback:()=> platform.destroy()});
      } });
    }
  });  
}
var fallObject;
function createPlatforms(scene) {
  // 落ちるブロック生成
  fallObject = scene.physics.add.existing(scene.add.rectangle(200, 300, 40, 16, 0x00ffff));
  fallObject.type = "fall";

  const platforms = scene.physics.add.group([
    scene.physics.add.existing(scene.add.rectangle(100, 360, 100, 16, 0x0000ff)),
    scene.physics.add.existing(scene.add.rectangle(300, 360, 100, 16, 0x0000ff)),
    fallObject, // グループに追加
  ]);

  platforms.getChildren().forEach(obj => {
    obj.body.setImmovable(true);
    obj.body.allowGravity = false;
    obj.body.friction.x = 1;
  });
  
  return platforms;
}

function update() {
  player.update(this);
}

})(); // endprogram