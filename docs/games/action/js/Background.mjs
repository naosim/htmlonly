
export class Background {
  preload(scene) {
    scene.load.image('sky', '../assets/sky.png');
  }
  create(scene) {
    scene.add.image(400, 300, 'sky');
  }
}
