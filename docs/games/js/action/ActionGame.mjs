import { Bombs } from "./Bombs.mjs";
import { Field } from "./Field.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";
// @ts-ignore
export const Phaser = window.Phaser;

export class ActionGameScene extends Phaser.Scene {
  gameOver = false;
  player = new Player();
  stars = new Stars();
  bombs = new Bombs();
  score = new Score();
  field = new Field();
  subScene = [this.field, this.player, this.stars, this.bombs, this.score];
  /** @type {number} */
  gameWidth;
  constructor() {
    super({ key: 'ActionGameScene' });
    this.gameWidth = 800;
  }

  preload() {
    const scene = this;
    this.load.image('sky', 'assets/sky.png');
    this.subScene.forEach((sub) => sub.preload(scene));
  }

  create() {
    const scene = this;
    //  A simple background for our game
    scene.add.image(400, 300, 'sky');

    this.subScene.forEach((sub) => sub.create(scene));

    // 地面との衝突
    [this.player.gameObject, this.stars.gameObject, this.bombs.gameObject]
      .forEach(v => scene.physics.add.collider(v, this.field.gameObject));
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    scene.physics.add.overlap(this.player.gameObject,  this.stars.gameObject, (a, b) => this.collectStar(a, b), undefined, scene);
    scene.physics.add.collider(this.player.gameObject, this.bombs.gameObject, (a, b) => this.hitBomb(a, b), undefined, scene);
  }

  update() {
    const scene = this;
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
    const scene = this;
    this.player.hitBomb();
    scene.physics.pause();
    this.gameOver = true;
  }
}