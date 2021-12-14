import { TilesIndex } from '../constants/tiles';
import { StageScene } from '../scenes/stage-scene';
import BulletConstants from '../constants/bullet';

export default class Tiles {
  constructor(private sceneRef: StageScene) {}

  handleCollisions(tileXY: Phaser.Math.Vector2, bullet: Phaser.Physics.Arcade.Sprite) {
    const bulletDirection: number = bullet.getData('direction');

    if (bulletDirection === Phaser.UP) {
      const correctionFactor = this.sceneRef.tileLayer.hasTileAt(tileXY.x, tileXY.y - 1) ? 0 : 1;
      const tileX = tileXY.x + correctionFactor;
      const tileY = tileXY.y - 1;
      const tileIndex = this.sceneRef.tileLayer.getTileAt(tileX, tileY).index;

      switch (tileIndex) {
        case TilesIndex.BRICK:
          this.destroyBullet(bullet);
          this.brickCollisionHandler(tileX, tileY);
          break;
        case TilesIndex.STEEL:
          this.destroyBullet(bullet);
          break;
        case TilesIndex.GRASS:
        case TilesIndex.WATER:
        default:
          this.destroyBullet(bullet);

      }
    } else if (bulletDirection === Phaser.DOWN) {
      const correctionFactor = this.sceneRef.tileLayer.hasTileAt(tileXY.x, tileXY.y + 1) ? 0 : -1;
      const tileX = tileXY.x + correctionFactor;
      const tileY = tileXY.y + 1;
      const tileIndex = this.sceneRef.tileLayer.getTileAt(tileX, tileY).index;

      switch (tileIndex) {
        case TilesIndex.BRICK:
          this.destroyBullet(bullet);
          this.brickCollisionHandler(tileX, tileY);
          break;
        case TilesIndex.STEEL:
          this.destroyBullet(bullet);
          break;
        case TilesIndex.GRASS:
        case TilesIndex.WATER:
        default:
          this.destroyBullet(bullet);
      }
    } else {
      // for left and right direction, simply destroy the bullet. No further collision handling
      this.destroyBullet(bullet);
    }
  }

  private destroyBullet(bullet: Phaser.Physics.Arcade.Sprite) {
    bullet.anims.play(BulletConstants.bulletExplosionAnimation);
    if (bullet.getData('name') === BulletConstants.player1BulletName) {
      this.sceneRef.time.delayedCall(150, () => {
        this.sceneRef.player1Bullets.remove(bullet);
      });
    }
  }

  private brickCollisionHandler(tileX: number, tileY: number) {
    this.sceneRef.tileLayer.removeTileAt(tileX, tileY);
  }
}