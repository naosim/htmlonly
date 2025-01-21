// title: アクションゲーム はしご

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
 class Player {
  gameObject;
  cursors;
  /** 登るモードのフラグ */
  isClimbing = false;
  /** 登っているはしご */
  ladderBody = null;
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
    
    if(this.isClimbing) {// 登るモード
      if(!this.gameObject.scene.physics.world.intersects(this.gameObject.body, this.ladderBody)) {
        this.ladderBody = null;
        this.isClimbing = false;
      }
      if(this.cursors.up.isDown) {
        this.gameObject.body.setVelocityY(-160);
      } else if(this.cursors.down.isDown) {
        this.gameObject.body.setVelocityY(160);
      } else {
        this.gameObject.body.setVelocityY(0);
      }
    } else if (
      this.cursors.up.isDown &&
      (this.gameObject.body.touching?.down || this.gameObject.body.blocked.down)
    ) {
      this.gameObject.body.setVelocityY(-330);
    }

    // scene.cameras.main.centerOn(this.gameObject .x, this.gameObject .y);
  }

  overlapLadder(ladder) {
    if(!this.isClimbing && this.cursors.up.isDown) {
      // 登るモードにする
      this.isClimbing = true;
      this.ladderBody = ladder.body;
    }
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
  const platforms = createPlatforms(this);
  player.create(this);
  this.physics.add.collider(player.gameObject, platforms);
  this.physics.add.overlap(player.gameObject, ladder,(a, b) => {
    player.overlapLadder(b);
  });
}
var ladder;
function createPlatforms(scene) {
  ladder = scene.physics.add.existing(scene.add.rectangle(190, 200, 20, 300, 0x00ff00));
  ladder.body.setImmovable(true);
  ladder.body.allowGravity = false;

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
  player.update(this);
}

})(); // endprogram