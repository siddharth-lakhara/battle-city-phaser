
import * as Phaser from 'phaser-ce';

export class PhaserBattleCityGame {
  private game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'battle-city', {
      preload: this.preload,
      create: this.create,
      update: this.update,
    });
  }

  public preload(): void {}
  public create(): void {}
  public update(): void {}

  public get gameInstance(): Phaser.Game {
    return this.game;
  }
}