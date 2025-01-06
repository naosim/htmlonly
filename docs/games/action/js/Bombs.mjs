// @ts-ignore
export const Phaser = window.Phaser;

export class Bombs {
  /** @type {Phaser.Physics.Arcade.Group} */
  // @ts-ignore
  gameObject;
  /** @type {number} */
  // @ts-ignore
  gameWidth;

  create(/** @type {Phaser.Scene}*/ scene) {
    this.gameObject = scene.physics.add.group();
    // @ts-ignore
    this.gameWidth = scene.game.config.width;
  }
  add(playerX) {
    var x = (playerX < this.gameWidth / 2) ? Phaser.Math.Between(this.gameWidth / 2, this.gameWidth) : Phaser.Math.Between(0, this.gameWidth / 2);
    var bomb = this.gameObject.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}
