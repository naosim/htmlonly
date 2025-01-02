import { Bombs } from "./Bombs.mjs";
import { Platform } from "./Platform.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";
// @ts-ignore
export const Phaser = window.Phaser;
export class ActionGame {
  gameOver = false;
  game;
  playerSprite = new Player();
  starsGroup = new Stars();
  bombsGroup = new Bombs();
  platformGroup = new Platform();
  scoreSprite = new Score();
  subScene = [this.platformGroup, this.playerSprite, this.starsGroup, this.bombsGroup, this.scoreSprite];
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

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    scene.physics.add.overlap(this.playerSprite.sprite,  this.starsGroup.group, (a, b) => this.collectStar(a, b), undefined, scene);
    scene.physics.add.collider(this.playerSprite.sprite, this.bombsGroup.group, (a, b) => this.hitBomb(a, b), undefined, scene);
  }

  update() {
    if (this.gameOver) {
      return;
    }
    this.playerSprite.update();
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
