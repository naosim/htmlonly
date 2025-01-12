// title: アクションゲームステージ


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
  const platforms = createPlatforms_正しい_Groupを使う(this);

  this.physics.add.collider(player.gameObject, platforms);
}

function createPlatforms_正しい_Groupを使う(scene) {
  const platforms = scene.physics.add.group([
    scene.physics.add.existing(scene.add.rectangle(100, 360, 100, 16, 0x0000ff)),
    scene.physics.add.existing(scene.add.rectangle(300, 300, 100, 16, 0x0000ff)),
  ]);

  platforms.getChildren().forEach(obj => {
    obj.body.setImmovable(true);
    obj.body.allowGravity = false;
  })
  return platforms;
}

function createPlatforms_NGパタン_Groupにaddする前に物理設定をする(scene) {
  var obj1 = scene.physics.add.existing(scene.add.rectangle(100, 360, 100, 16, 0x0000ff));
  // groupにaddする前に物理的な設定をする
  obj1.body.setImmovable(true);
  obj1.body.allowGravity = false;

  var obj2 = scene.physics.add.existing(scene.add.rectangle(300, 300, 100, 16, 0x0000ff));
  obj2.body.setImmovable(true);
  obj2.body.allowGravity = false;

  const platforms = scene.physics.add.group([obj1, obj2]);

  return platforms;
}

function createPlatforms_正しい_StaticGroupを使う(scene) {
  return scene.physics.add.staticGroup([
    scene.add.rectangle(100, 360, 100, 16, 0x0000ff),
    scene.add.rectangle(300, 300, 100, 16, 0x0000ff),
  ]);
}

function createPlatforms_NGパタン_StaticGroupにphysicsで作られたGameObjectを渡す(scene) {
  // staticGroupにphysics.addで作られたGameObjectをaddする
  return scene.physics.add.staticGroup([
  scene.physics.add.existing(scene.add.rectangle(100, 360, 100, 16, 0x0000ff)),
  scene.physics.add.existing(scene.add.rectangle(300, 300, 100, 16, 0x0000ff)),
  ]);
}

function update() {
  player.update(this);
}