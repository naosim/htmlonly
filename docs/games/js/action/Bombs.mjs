// @ts-ignore
export const Phaser = window.Phaser;

export class Bombs {
  /** @type {Phaser.Physics.Arcade.Group} */
  // @ts-ignore lateinit
  gameObject;
  preload(/** @type {Phaser.Scene}*/ scene) {
    scene.load.image('bomb', 'assets/bomb.png');
  }
  create(/** @type {Phaser.Scene}*/ scene) {
    this.gameObject = scene.physics.add.group();
  }
  add({ x }) {
    console.log('add bomb', x);
    var bomb = this.gameObject.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}
