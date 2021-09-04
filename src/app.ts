import Phaser from "phaser";
import { StageScene } from "./scenes/stage-scene";

const defaultConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: '000000',
  width: 1024,
  height: 768,
  parent: 'game',
  physics: {
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
    default: 'arcade',
  },
  render: { pixelArt: true, antialias: false },
  scene: [StageScene],
  title: 'Battle City Phaser',
  type: Phaser.AUTO,
};

export class BattleCityGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

window.onload = () => {
  const game = new BattleCityGame(defaultConfig);
};
