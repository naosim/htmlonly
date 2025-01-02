// @ts-ignore
export const Phaser = window.Phaser;

export class Stars {
  group;
  get count() {
    return this.group.countActive(true);
  }
  get isEmpty() {
    console.log('isEmpty', this.count);
    return this.count === 0;
  }
  preload(scene) {
    scene.load.image('star', 'assets/star.png');
  }
  create(scene) {
    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.group = scene.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    var count = 0;
    this.forEach((child) => {
      child.name = `star-${count++}`;
      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }
  forEach(cb) {
    this.group.children.iterate(cb);
  }
  reset() {
    this.forEach((child) => {
      child.enableBody(true, child.x, 0, true, true);
    });
  }
  hitPlayer(star) {
    console.log('hitPlayer', star.name);
    star.disableBody(true, true);
  }
}
