import { ActionGameScene } from "./ActionGame.mjs";
import { Field1 } from "./Field1.mjs";
import { PlayerRect } from "./PlayerRect.mjs";

export class Stage1 extends ActionGameScene {
  player = new PlayerRect();
  field = new Field1();
  subScene = [this.field, this.player];
  constructor() {
    super({ key: 'Stage1' });
  }

  create() {
    super.create();
    const scene = this;

    // 地面との衝突
    scene.physics.add.collider(this.player.gameObject, this.field.gameObject);
  }
}
