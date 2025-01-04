export class Player {
  /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
  // @ts-ignore
  gameObject;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  // @ts-ignore
  cursors;
  create(/** @type {Phaser.Scene}*/ scene) {
    // The player and its settings
    // const player = this.gameObject = scene.physics.add.sprite(100, 450, 'dude');
    const player = this.gameObject = scene.physics.add.sprite(100, 450, 'dude');

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
    //scene.cameras.main.setZoom(1.6, 1.6);
    // scene.cameras.main.startFollow(this.gameObject);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.cursors.left.isDown) {
      this.gameObject.setVelocityX(-160);
      this.gameObject.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.gameObject.setVelocityX(160);
      this.gameObject.anims.play('right', true);
    } else {
      this.gameObject.setVelocityX(0);
      this.gameObject.anims.play('turn');
    }

    if (this.cursors.up.isDown && (this.gameObject.body.touching.down || this.gameObject.body.blocked.down)) {
      this.gameObject.setVelocityY(-330);
    }
    scene.cameras.main.centerOn(this.gameObject.x, this.gameObject.y);
  }

  hitBomb() {
    this.gameObject.setTint(0xff0000);
    this.gameObject.anims.play('turn');
  }
}