import { ActionGameScene } from "./ActionGame.mjs";
import { AssetKeys } from "./ActionGameLoader.mjs";
import { Background } from "./Background.mjs";
import { Bombs } from "./Bombs.mjs";
import { Field } from "./Field.mjs";
import { Player } from "./Player.mjs";
import { PlayerRect } from "./PlayerRect.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";


export class StageMove extends ActionGameScene {
  player = new Player();
  score = new Score();
  background = new Background();
  items = new Stars();
  enemies = new Bombs();
  field = new Field();
  subScene = [this.background, this.field, this.player, this.items, this.enemies, this.score];
  constructor() {
    super({ key: 'Stage1' });
  }
  
  create() {
    super.create();
    const scene = this;

    const box = this.box = scene.physics.add.image(100, 300, AssetKeys.star, 0);
    box.setVelocity(10, 0);
    box.setImmovable(true);
    box.body.allowGravity = false;

    // 地面との衝突
    [this.player.gameObject, this.items.gameObject, this.enemies.gameObject, box]
      .forEach(v => scene.physics.add.collider(v, this.field.gameObject));
    scene.physics.add.overlap(this.player.gameObject, this.items.gameObject, (a, b) => this.onHitItem(a, b), undefined, scene);
    scene.physics.add.collider(this.player.gameObject, this.enemies.gameObject, (a, b) => this.onHitBomb(a, b), undefined, scene);

    scene.physics.add.collider(this.player.gameObject, box);
  }

  onHitItem(player, item) {
    this.items.hitPlayer(item);
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
