import { ActionGameScene } from "./ActionGame.mjs";
import { Background } from "./Background.mjs";
import { Bombs } from "./Bombs.mjs";
import { Field } from "./Field.mjs";
import { PlayerRect } from "./PlayerRect.mjs";
import { Score } from "./Score.mjs";
import { Stars } from "./Stars.mjs";


export class StageSample extends ActionGameScene {
  player = new PlayerRect();
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

    // 地面との衝突
    [this.player.gameObject, this.items.gameObject, this.enemies.gameObject]
      .forEach(v => scene.physics.add.collider(v, this.field.gameObject));
    scene.physics.add.overlap(this.player.gameObject, this.items.gameObject, (a, b) => this.onHitItem(a, b), undefined, scene);
    scene.physics.add.collider(this.player.gameObject, this.enemies.gameObject, (a, b) => this.onHitBomb(a, b), undefined, scene);
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
