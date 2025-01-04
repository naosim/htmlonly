import { ActionGameLoader } from "./ActionGameLoader.mjs";
import { Player } from "./Player.mjs";
import { Score } from "./Score.mjs";
// @ts-ignore
export const Phaser = window.Phaser;

/** @abstract */
export class ActionGameScene extends Phaser.Scene {
  gameOver = false;
  actionGameLoader = new ActionGameLoader();
  player = new Player();
  score = new Score();
  /** @abstract */
  subScene;
  constructor(args) {
    const key = args && args.key ? args.key : 'ActionGameScene';
    super({ key });
  }

  preload() {
    if(this.subScene === undefined) {
      throw new Error('subScene is not defined');
    }
    const scene = this;
    this.actionGameLoader.preload(scene);
    // this.subScene.forEach((sub) => {if(sub.preload) sub.preload(scene)});
  }

  create() {
    const scene = this;
    this.subScene.forEach((sub) => sub.create(scene));
  }

  update() {
    const scene = this;
    if (this.gameOver) {
      return;
    }
    // @ts-ignore
    this.subScene.forEach((sub) => {if(sub.update) sub.update(scene)});
  }
}
