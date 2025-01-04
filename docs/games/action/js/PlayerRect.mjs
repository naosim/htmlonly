
export class PlayerRect {
  /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
  // @ts-ignore
  gameObject;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  // @ts-ignore
  cursors;
  create(/** @type {Phaser.Scene}*/ scene) {
    // The player and its settings
    // const player = this.gameObject = scene.physics.add.sprite(100, 450, 'dude1');
    const player = this.gameObject = scene.physics.add.existing(scene.add.rectangle(100, 0, 16, 28, 0xffff00));
    // scene.physics.add.existing(player);
    player.setSize(16, 28);
    // player.setOffset(8, 20);
    if (!scene.input.keyboard) {
      throw new Error('scene.input.keyboard is undefined');
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
    //scene.cameras.main.setZoom(1.6, 1.6);
    // scene.cameras.main.startFollow(this.gameObject);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.cursors.left.isDown) {
      this.gameObject.body.setVelocityX(-160);
    }
    else if (this.cursors.right.isDown) {
      this.gameObject.body.setVelocityX(160);
    } else {
      this.gameObject.body.setVelocityX(0);
    }

    if (this.cursors.up.isDown && (this.gameObject.body.touching.down || this.gameObject.body.blocked.down)) {
      this.gameObject.body.setVelocityY(-330);
    }
  }

  hitBomb() {
    this.gameObject.setTint(0xff0000);
    this.gameObject.anims.play('turn');
  }
}
