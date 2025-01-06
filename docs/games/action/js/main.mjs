import { defaultConfig } from "./ActionGame.mjs";
import { Stage1 } from "./Stage1.mjs";
import { StageMove } from "./StageMove.mjs";
import { StageSample } from "./StageSample.mjs";

/** @type {Phaser.Types.Core.GameConfig} */
const config = {...defaultConfig, scene: [ StageMove ]}
new Phaser.Game(config);