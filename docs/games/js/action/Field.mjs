import { defined } from "./ActionGame.mjs";

export class Field {
  platforms;
  static scale = 2;
  preload(scene) {
    scene.load.image("mario_map", "./assets/mario_map.png");
    const a = scene.load.tilemapTiledJSON('map', './assets/mario.json');
    console.log(a);
  }
  create(/** @type {Phaser.Scene} */ scene) {
    const level = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 2, 3, 0, 0, 0, 1, 2, 3, 0],
      [0, 5, 6, 7, 0, 0, 0, 5, 6, 7, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 14, 13, 14, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 14, 14, 14, 14, 14, 0, 0, 0, 15],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
      [35, 36, 37, 0, 0, 0, 0, 0, 15, 15, 15],
      [39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39]
    ];

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
    const tileset = defined(map.addTilesetImage("mario_map"));
    
    const back = defined(map.createLayer("mario_background", tileset, 0, 0));
    back.setScale(Field.scale);

    const groundLayer = this.platforms = defined(map.createLayer("mario_layer1", tileset, 0, 0));
    groundLayer.setCollisionByProperty({ collides: true });
    groundLayer.setScale(Field.scale);
    
    map.setCollisionBetween(10, 100);
  }
}
