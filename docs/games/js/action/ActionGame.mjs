import { Bombs } from "./Bombs.mjs";
import { Platform } from "./Platform.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";
// @ts-ignore
export const Phaser = window.Phaser;

class Field {
  platforms;
  preload(scene) {
    scene.load.image("mario-tiles", "./assets/mario_map.png");
  }
  create(/** @type {Phaser.Scene} */ scene) {
    const level = [
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   1,   2,   3,   0,   0,   0,   1,   2,   3,   0 ],
      [  0,   5,   6,   7,   0,   0,   0,   5,   6,   7,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,  14,  13,  14,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,  14,  14,  14,  14,  14,   0,   0,   0,  15 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  15 ],
      [ 35,  36,  37,   0,   0,   0,   0,   0,  15,  15,  15 ],
      [ 39,  39,  39,  39,  39,  39,  39,  39,  39,  39,  39 ]
    ];
  
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    const tileset = defined(map.addTilesetImage("mario-tiles"));
    const groundLayer = this.platforms = defined(map.createLayer(0, tileset, 0, 0));
    groundLayer.setCollisionByProperty({ collides: true });
    groundLayer.setScale(2, 2);
    map.setCollisionBetween(10, 100);
  }
}

/**
 * @template T
 * @param {T | undefined | null} obj 
 * @returns {T}
 */
function defined(obj) {
  // @ts-ignore
  return obj;
}

export class ActionGame {
  gameOver = false;
  game;
  playerSprite = new Player();
  starsGroup = new Stars();
  bombsGroup = new Bombs();
  platformGroup = new Platform();
  scoreSprite = new Score();
  field = new Field();
  subScene = [this.platformGroup, this.field, this.playerSprite, this.starsGroup, this.bombsGroup, this.scoreSprite];
  /** @type {Phaser.Scene} */
  // @ts-ignore
  scene;
  /** @type {number} */
  gameWidth;

  /**
   *
   * @param {{game:Phaser.Game}} param
   */
  constructor({ game }) {
    this.game = game;
    if (typeof game.config.width === "string") {
      throw new Error('game.config.width is string');
    }
    this.gameWidth = game.config.width;
  }

  preload(/** @type {Phaser.Scene} */ scene) {
    this.scene = scene;
    scene.load.image('sky', 'assets/sky.png');
    this.subScene.forEach((sub) => sub.preload(scene));
  }

  create(/** @type {Phaser.Scene} */ scene) {
    //  A simple background for our game
    scene.add.image(400, 300, 'sky');

    this.subScene.forEach((sub) => sub.create(scene));

    //  Collide the player and the stars with the platforms
    scene.physics.add.collider(this.playerSprite.sprite, this.platformGroup.group);
    scene.physics.add.collider(this.starsGroup.group,    this.platformGroup.group);
    scene.physics.add.collider(this.bombsGroup.group,    this.platformGroup.group);
    scene.physics.add.collider(this.playerSprite.sprite, this.field.platforms);
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    scene.physics.add.overlap(this.playerSprite.sprite,  this.starsGroup.group, (a, b) => this.collectStar(a, b), undefined, scene);
    scene.physics.add.collider(this.playerSprite.sprite, this.bombsGroup.group, (a, b) => this.hitBomb(a, b), undefined, scene);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.gameOver) {
      return;
    }
    this.playerSprite.update(scene);
  }

  collectStar(player, star) {
    this.starsGroup.hitPlayer(star);

    //  Add and update the score
    this.scoreSprite.add(10);

    if (this.starsGroup.isEmpty) {
      this.starsGroup.reset();
      var x = (player.x < this.gameWidth / 2) ? Phaser.Math.Between(this.gameWidth / 2, this.gameWidth) : Phaser.Math.Between(0, this.gameWidth / 2);
      this.bombsGroup.add({ x });
    }
  }


  hitBomb(player, bomb) {
    this.playerSprite.hitBomb();
    this.scene.physics.pause();
    this.gameOver = true;
  }
}
