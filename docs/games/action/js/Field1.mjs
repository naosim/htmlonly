import { defined } from "../../js/lib.mjs";
import { Field } from "./Field.mjs";


export class Field1 {
  gameObject;
  static scale = 2;
  create(/** @type {Phaser.Scene} */ scene) {
    const level = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 14, 13, 14, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 14, 14, 14, 14, 14, 0, 0, 0, 15],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
      [0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15],
      [39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39]
    ];

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = defined(scene.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 }).setCollisionBetween(10, 100));
    const tiles = defined(map.addTilesetImage("mario_map"));
    this.gameObject = defined(map.createLayer(0, tiles, 0, 0)).setCollisionByProperty({ collides: true }).setScale(Field.scale);

  }
}
