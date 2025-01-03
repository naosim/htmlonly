export class Player {
  /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
  // @ts-ignore
  sprite;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  // @ts-ignore
  cursors;
  preload(/** @type {Phaser.Scene}*/ scene) {
    scene.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create(/** @type {Phaser.Scene}*/ scene) {
    // The player and its settings
    const player = this.sprite = scene.physics.add.sprite(100, 450, 'dude');

    player.setSize(16, 28);
    player.setOffset(8, 20);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    //  Input Events
    if (!scene.input.keyboard) {
      throw new Error('scene.input.keyboard is undefined');
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
    scene.cameras.main.setZoom(1.6, 1.6);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-160);
      this.sprite.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(160);
      this.sprite.anims.play('right', true);
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('turn');
    }

    if (this.cursors.up.isDown && (this.sprite.body.touching.down || this.sprite.body.blocked.down)) {
      this.sprite.setVelocityY(-330);
    }
    scene.cameras.main.centerOn(this.sprite.x, this.sprite.y);
  }

  hitBomb() {
    this.sprite.setTint(0xff0000);
    this.sprite.anims.play('turn');
  }
}
