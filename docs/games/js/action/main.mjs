import { ActionGame } from "./ActionGame.mjs";

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
  scene: {
      preload: function() { actionGame.preload(this) },
      create: function() { actionGame.create(this) },
      update: function() { actionGame.update(this) }
  },
  pixelArt: true,
};

const game = new Phaser.Game(config);
const actionGame = new ActionGame({game});