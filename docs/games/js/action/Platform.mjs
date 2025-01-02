export class Platform {
  group;
  preload(scene) {
    scene.load.image('ground', 'assets/platform.png');
  }
  create(scene) {
    //  The platforms group contains the ground and the 2 ledges we can jump on
    const group = this.group = scene.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    group.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    group.create(600, 400, 'ground');
    group.create(50, 250, 'ground');
    group.create(750, 220, 'ground');
  }
}
