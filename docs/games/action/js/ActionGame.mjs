import { Bombs } from "./Bombs.mjs";
import { Field } from "./Field.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";
// @ts-ignore
export const Phaser = window.Phaser;

export class ActionGameScene extends Phaser.Scene {
  gameOver = false;
  background = new Background();
  player = new Player();
  items = new Stars();
  enemies = new Bombs();
  score = new Score();
  field = new Field();
  subScene = [this.background, this.field, this.player, this.items, this.enemies, this.score];
  constructor(args) {
    const key = args && args.key ? args.key : 'ActionGameScene';
    super({ key });
  }

  preload() {
    const scene = this;
    this.subScene.forEach((sub) => sub.preload(scene));
  }

  create() {
    const scene = this;
    this.subScene.forEach((sub) => sub.create(scene));

    // 地面との衝突
    [this.player.gameObject, this.items.gameObject, this.enemies.gameObject]
      .forEach(v => scene.physics.add.collider(v, this.field.gameObject));
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    scene.physics.add.overlap(this.player.gameObject,  this.items.gameObject, (a, b) => this.onHitItem(a, b), undefined, scene);
    scene.physics.add.collider(this.player.gameObject, this.enemies.gameObject, (a, b) => this.onHitBomb(a, b), undefined, scene);
  }

  update() {
    const scene = this;
    if (this.gameOver) {
      return;
    }
    this.player.update(scene);
  }
  


  onHitItem(player, item) {
    this.items.hitPlayer(item);

    //  Add and update the score
    this.score.add(10);

    if (this.items.isEmpty) {
      this.items.reset();
      this.enemies.add(player.x);
    }
  }


  onHitBomb(player, bomb) {
    const scene = this;
    this.player.hitBomb();
    scene.physics.pause();
    this.gameOver = true;
  }
}

class Background {
  preload(scene) {
    scene.load.image('sky', '../assets/sky.png');
  }
  create(scene) {
    scene.add.image(400, 300, 'sky');
  }
}