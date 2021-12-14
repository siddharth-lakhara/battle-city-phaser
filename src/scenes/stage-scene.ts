import Phaser from 'phaser';
import { backgrounds_path, spritesheet_path, tiles_path } from '../constants/paths';
import { Player } from '../actors/player';
import PlayerConstants from '../constants/player';
import BulletConstants from '../constants/bullet';
import { Bullets } from '../actors/bullets';
import Tiles from '../actors/tiles';

export class StageScene extends Phaser.Scene {
  private gameBackground: Phaser.GameObjects.Image;
  private _tileLayer: Phaser.Tilemaps.TilemapLayer;
  private tileHandler: Tiles;

  private _player1: Player;
  private _player1Bullets: Bullets;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'StageScene' });
  }

  get player1() {
    return this._player1;
  }

  get tileLayer() {
    return this._tileLayer;
  }

  get player1Bullets() {
    return this._player1Bullets;
  }

  public preload(): void {
    this.load.image('game-background', `${backgrounds_path}/game-background.png`);
    this.load.tilemapTiledJSON('stage-01-tilemap', `${tiles_path}/stage-01-tilemap.json`);
    this.load.image('game-tileset', `${spritesheet_path}/tiles.png`);

    this.load.spritesheet(PlayerConstants.player1SpriteKey, `${spritesheet_path}/player-one.png`, {
      frameWidth: PlayerConstants.frameWidth,
      frameHeight: PlayerConstants.frameHeight,
    });
    this.load.spritesheet(BulletConstants.bulletSpriteKey, `${spritesheet_path}/bullet.png`, {
      frameWidth: 12,
      frameHeight: 12,
    });
    this.load.spritesheet(BulletConstants.bulletExplosionSpriteKey, `${spritesheet_path}/single-explosion.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  public create(): void {
    this.gameBackground = this.add.image(0, 0, 'game-background');
    this.gameBackground.setOrigin(0, 0);

    const map = this.make.tilemap({ key: 'stage-01-tilemap' });
    const tileSet = map.addTilesetImage('game-tileset', 'game-tileset');
    this._tileLayer = map.createLayer('layer1', tileSet, 0, 0).setScale(3);
    this._tileLayer.setCollisionBetween(0, 9999, true, true);

    this.tileHandler = new Tiles(this);

    this._player1Bullets = new Bullets(this);

    this._player1 = new Player(PlayerConstants.player1SpriteKey, this);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.setupCollisions();

    this.physics.world.on('worldbounds', this.onWorldBounds, this);
  }

  private setupCollisions(): void {
    this.physics.add.collider(this._player1.sprite, this._tileLayer);
    this.physics.add.collider(this._player1Bullets.group, this._tileLayer, this.handleTileCollisions, null, this);
  }

  private onWorldBounds(body: Phaser.Physics.Arcade.Body) {
    if (body.gameObject.getData('name') === BulletConstants.player1BulletName) {
      this.anims.play(BulletConstants.bulletExplosionAnimation, body.gameObject);
      this.time.delayedCall(150, () => {
        this._player1Bullets.remove(body.gameObject);
      });
    }
  }

  private handleTileCollisions(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite) {
    const tileXY: Phaser.Math.Vector2 = this._tileLayer.worldToTileXY(src.x, src.y);
    this.tileHandler.handleCollisions(tileXY, src);
  }

  public update(): void {
    this._player1.handleMovement(this.cursorKeys);
  }
}
