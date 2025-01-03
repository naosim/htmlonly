import { Bombs } from "./Bombs.mjs";
import { Field } from "./Field.mjs";
import { Platform } from "./Platform.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";
// @ts-ignore
export const Phaser = window.Phaser;

/**
 * @template T
 * @param {T | undefined | null} obj 
 * @returns {T}
 */
export function defined(obj) {
  // @ts-ignore
  return obj;
}

export class ActionGame {
  gameOver = false;
  game;
  player = new Player();
  stars = new Stars();
  bombs = new Bombs();
  // platformGroup = new Platform();
  score = new Score();
  field = new Field();
  subScene = [this.field, this.player, this.stars, this.bombs, this.score];
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

    // 地面との衝突
    [this.player.sprite, this.stars.group, this.bombs.group]
      .forEach(v => scene.physics.add.collider(v, this.field.platforms));
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    scene.physics.add.overlap(this.player.sprite,  this.stars.group, (a, b) => this.collectStar(a, b), undefined, scene);
    scene.physics.add.collider(this.player.sprite, this.bombs.group, (a, b) => this.hitBomb(a, b), undefined, scene);
  }

  update(/** @type {Phaser.Scene}*/ scene) {
    if (this.gameOver) {
      return;
    }
    this.player.update(scene);
  }

  collectStar(player, star) {
    this.stars.hitPlayer(star);

    //  Add and update the score
    this.score.add(10);

    if (this.stars.isEmpty) {
      this.stars.reset();
      var x = (player.x < this.gameWidth / 2) ? Phaser.Math.Between(this.gameWidth / 2, this.gameWidth) : Phaser.Math.Between(0, this.gameWidth / 2);
      this.bombs.add({ x });
    }
  }


  hitBomb(player, bomb) {
    this.player.hitBomb();
    this.scene.physics.pause();
    this.gameOver = true;
  }
}
