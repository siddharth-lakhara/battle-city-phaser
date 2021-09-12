import Phaser from 'phaser';
import { backgrounds_path, spritesheet_path, tiles_path } from '../constants/paths';
import { Player } from '../actors/player';
import PlayerConstants from '../constants/player';
import BulletConstants from '../constants/bullet';
import { Bullets } from '../actors/bullets';

export class StageScene extends Phaser.Scene {
  private gameBackground: Phaser.GameObjects.Image;
  private tileLayer: Phaser.Tilemaps.TilemapLayer;

  private player1: Player;
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
    this.load.tilemapTiledJSON('stage-01-tilemap', `${tiles_path}/stage-01-tilemap.json`);
    // this.load.json(this.filesBaseKey + '-script', this.filesBaseUrl + '-script.json');
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
    this.tileLayer = map.createLayer('tile-layer', tileSet, 0, 0).setScale(3);
    this.tileLayer.setCollisionBetween(0, 9999, true, true);

    this.player1Bullets = new Bullets(this);

    this.player1 = new Player(PlayerConstants.player1SpriteKey, this);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.setupCollisions();

    this.physics.world.on('worldbounds', this.onWorldBounds, this);
  }

  private setupCollisions(): void {
    this.physics.add.collider(this.player1.sprite, this.tileLayer);
    this.physics.add.collider(this.player1Bullets.group, this.tileLayer, this.handleTileCollisions, null, this);
    // this.physics.add.collider(this.player1, this.player1Bullets)
  }

  private onWorldBounds(body: Phaser.Physics.Arcade.Body) {
    if (body.gameObject.getData('name') === BulletConstants.player1BulletName) {
      this.anims.play(BulletConstants.bulletExplosionAnimation, body.gameObject);
      this.time.delayedCall(150, () => {
        this.player1Bullets.remove(body.gameObject);
      });
    }
  }

  private handleTileCollisions(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite) {
    src.anims.play(BulletConstants.bulletExplosionAnimation);
    if (src.getData('name') === BulletConstants.player1BulletName) {
      this.time.delayedCall(150, () => {
        this.player1Bullets.remove(src);
      });
    }

    const bulletDirection = src.getData('direction');
    const tileXY: Phaser.Math.Vector2 = this.tileLayer.worldToTileXY(src.x, src.y);
    if (bulletDirection === Phaser.UP) {
      const tileIndex = this.tileLayer.getTileAt(tileXY.x, tileXY.y - 1).index;
      this.tileLayer.removeTileAt(tileXY.x, tileXY.y - 1);
    }
    // debugger;
  }

  public update(): void {
    this.player1.handleMovement(this.cursorKeys);
  }
}
