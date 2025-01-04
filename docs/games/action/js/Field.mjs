import { defined } from "../../js/lib.mjs";

export class Field {
  gameObject;
  static scale = 2;
  create(/** @type {Phaser.Scene} */ scene) {
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
    const tileset = defined(map.addTilesetImage("mario_map"));
    
    const back = defined(map.createLayer("mario_background", tileset, 0, 0));
    back.setScale(Field.scale);

    const groundLayer = this.gameObject = defined(map.createLayer("mario_layer1", tileset, 0, 0));
    groundLayer.setCollisionByProperty({ collides: true });
    groundLayer.setScale(Field.scale);

    map.setCollisionBetween(10, 100);
  }
}
