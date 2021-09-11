import Phaser from 'phaser';
import { backgrounds_path, spritesheet_path } from '../constants/paths';
import { Player } from '../actors/player';
import PlayerConstants from '../constants/player';
import BulletConstants from '../constants/bullet';
import { Bullets } from '../actors/bullets';
import { scalingFactor } from '../constants/game';

export class StageScene extends Phaser.Scene {
  private gameBackground: Phaser.GameObjects.Image;
  private player1Sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player1: Player;

  private player1BulletsGroup: Phaser.Physics.Arcade.Group;
  private player1Bullets: Bullets;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'StageScene' });
  }

  get getPlayer1Bullets() {
    return this.player1Bullets;
  }

  public preload(): void {
    this.load.image('game-background', `${backgrounds_path}/game-background.png`);
    this.load.spritesheet(PlayerConstants.player1SpriteKey, `${spritesheet_path}/player-one.png`, {
      frameWidth: PlayerConstants.frameWidth,
      frameHeight: PlayerConstants.frameHeight,
    });

    this.load.spritesheet(BulletConstants.bulletSpriteKey, `${spritesheet_path}/bullet.png`, {
      frameWidth: 12,
      frameHeight: 12,
    });
    this.load.spritesheet(BulletConstants.bulletExplosionSpriteKey, `${spritesheet_path}/explosion.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  public create(): void {
    this.gameBackground = this.add.image(0, 0, 'game-background');
    this.gameBackground.setOrigin(0, 0);

    this.player1BulletsGroup = this.physics.add.group();
    this.player1Bullets = new Bullets(this.player1BulletsGroup, this);

    this.player1 = new Player(PlayerConstants.player1SpriteKey, this);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.setupCollisions();
  }

  private setupCollisions(): void {
    // this.physics.add.collider(this.player1, this.player1Bullets)
  }

  public update(): void {
    this.player1.handleMovement(this.cursorKeys);
  }
}
