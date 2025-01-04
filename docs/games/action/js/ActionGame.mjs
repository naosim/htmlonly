import { ActionGameLoader } from "./ActionGameLoader.mjs";

export const defaultConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { x:0, y: 300 },
          debug: false
      }
  },
  /*scene: [ Stage1 ],*/
  pixelArt: true,
};

export function main(sceneClass) {
  const config = {...defaultConfig, scene: [ sceneClass ]}
  new Phaser.Game(config);
}

/** @abstract */
export class ActionGameScene extends Phaser.Scene {
  gameOver = false;
  actionGameLoader = new ActionGameLoader();
  /** @abstract */
  subScene;
  constructor(args) {
    const key = args && args.key ? args.key : 'ActionGameScene';
    super({ key });
  }

  preload() {
    this.actionGameLoader.preload(this);
  }

  create() {
    if(this.subScene === undefined) {
      throw new Error('subScene is not defined');
    }
    this.subScene.forEach((sub) => sub.create(this));
  }

  update() {
    if (this.gameOver) {
      return;
    }
    this.subScene.forEach((sub) => {if(sub.update) sub.update(this)});
  }
}
