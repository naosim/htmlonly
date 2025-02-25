// title: アクションゲーム 敵

(function() { // startprogram
/** 
 * プレイヤー。矢印で操作できる
 */
 class Player {
  gameObject;
  gamepad;// cursorsから変更
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  create(scene) {
    this.scene = scene;
    const player = (this.gameObject = scene.physics.add.existing(
      scene.add.container(100, 300)
    ));
    player.body.setSize(16, 28);
    // player.displayOriginX=8;
    const rect = this.sub = scene.add.rectangle(8, 14, 16, 28, 0xffff00);
    player.add(rect);
    // const player = (this.gameObject = scene.physics.add.existing(
    //   scene.add.rectangle(100, 300, 16, 28, 0xffff00)
    // ));
    player.body.setCollideWorldBounds(true);

    scene.events.on('update', this.update, this);
  }

  update() {
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
      this.gameObject.body.setVelocityY(-280);
    }
    this.scene.cameras.main.centerOn(this.gameObject.x, this.gameObject.y);
  }
}

class Enemy {
  create(scene) {
    this.scene = scene;
    const enemy = this.gameObject = scene.physics.add.existing(
      scene.add.rectangle(300, 0, 16, 16, 0xffff00)
    );
    enemy.body.setCollideWorldBounds(true);
    enemy.body.setVelocityX(-10);
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
var game = new Phaser.Game(config);
var onlyUpBlocks;
function preload() {
  this.load.spritesheet('gamepad', 
    '../assets/gamepad/gamepad_spritesheet.png', {frameWidth:100, frameHeight:100});
}

function create() {
  const platforms = createPlatforms(this);
  onlyUpBlocks = createOnlyUpBlocks(this);
  player.create(this);

  const enemy = new Enemy();
  enemy.create(this);
  
  this.physics.add.collider(player.gameObject, platforms);
  this.physics.add.collider(player.gameObject, onlyUpBlocks, null, (player, block) => {
    return player.y < block.y - block.height / 2 && !gamepad.down.isDown
  });

  // 敵と地面の衝突
  this.physics.add.collider(enemy.gameObject, platforms);
  // プレイヤーと敵の衝突
  this.physics.add.overlap(player.gameObject, enemy.gameObject, (player, enemy) => {
    if(player.y + player.body.height / 2 + 4 < enemy.y - enemy.body.height/4) {
      enemy.destroy();
      // 踏んだ反動でジャンプ
      player.body.setVelocityY(player.body.velocity.y * (-0.6))
    } else {
      // ダメージを食らう
      player.body.setVelocityX((player.x - enemy.x)*10);
      player.body.setVelocityY((player.y - enemy.y)*10);
    }
    
  });

  
  gamepad.createAll(this, {joystickPos:{x:100, y:300}, buttonPos:{x:300, y:300}});
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

function createOnlyUpBlocks(scene) {
  const platforms = scene.physics.add.group([
    scene.physics.add.existing(scene.add.rectangle(120, 270, 80, 160, 0x00aa00)),
    scene.physics.add.existing(scene.add.rectangle(170, 300, 50, 100, 0x00ff00)),
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