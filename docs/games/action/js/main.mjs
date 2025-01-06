import { defaultConfig } from "./ActionGame.mjs";
import { Stage1 } from "./Stage1.mjs";
import { StageSample } from "./StageSample.mjs";

/** @type {Phaser.Types.Core.GameConfig} */
const config = {...defaultConfig, scene: [ StageSample ]}
new Phaser.Game(config);