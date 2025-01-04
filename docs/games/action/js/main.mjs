import { defaultConfig } from "./ActionGame.mjs";
import { Stage1 } from "./Stage1.mjs";

/** @type {Phaser.Types.Core.GameConfig} */
const config = {...defaultConfig, scene: [ Stage1 ]}
new Phaser.Game(config);