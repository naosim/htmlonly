import { ActionGameScene } from "./ActionGame.mjs";

/** @type {Phaser.Types.Core.GameConfig} */
const config = {
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
  scene: [ ActionGameScene ],
  pixelArt: true,
};

const game = new Phaser.Game(config);