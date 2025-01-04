export class ActionGameLoader {
  images = {
    sky: '../assets/sky.png',
    bomb: '../assets/bomb.png',
    ground: '../assets/platform.png',
    star: '../assets/star.png',
    mario_map: '../assets/mario_map.png',
  };
  tilemap = {
    map: '../assets/mario.json',
  };
  dude = "dude";
  constructor() {
  }
  preload(/** @type {Phaser.Scene}*/ scene) {
    scene.load.spritesheet(this.dude, "../assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    Object.keys(this.images).forEach(k => scene.load.image(k, this.images[k]));
    Object.keys(this.tilemap).forEach(k => scene.load.tilemapTiledJSON(k, this.tilemap[k]));
  }
}
