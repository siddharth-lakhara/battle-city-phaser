import BulletConstants from "../constants/bullet";
import { StageScene } from "../scenes/stage-scene";
import createBulletArgs from "../types/createBulletArgs.type";

export class Bullets {
  private bulletsGroupRef: Phaser.Physics.Arcade.Group;

  constructor(private sceneRef: StageScene) {
    this.bulletsGroupRef = this.sceneRef.physics.add.group();
    this.setAnimations();
  }

  get group() {
    return this.bulletsGroupRef;
  }

  private setAnimations() {
    if (this.sceneRef.anims.get(BulletConstants.bulletUpAnimation) === undefined) {
      this.sceneRef.anims.create({
        frameRate: 10,
        frames: this.sceneRef.anims.generateFrameNumbers(BulletConstants.bulletSpriteKey, {
          start: 0,
          end: 0,
        }),
        key: BulletConstants.bulletUpAnimation,
        repeat: 0,
      });
    }

    if (this.sceneRef.anims.get(BulletConstants.bulletDownAnimation) === undefined) {
      this.sceneRef.anims.create({
        frameRate: 10,
        frames: this.sceneRef.anims.generateFrameNumbers(BulletConstants.bulletSpriteKey, {
          start: 2,
          end: 2,
        }),
        key: BulletConstants.bulletDownAnimation,
        repeat: 0,
      });
    }

    if (this.sceneRef.anims.get(BulletConstants.bulletRightAnimation) === undefined) {
      this.sceneRef.anims.create({
        frameRate: 10,
        frames: this.sceneRef.anims.generateFrameNumbers(BulletConstants.bulletSpriteKey, {
          start: 1,
          end: 1,
        }),
        key: BulletConstants.bulletRightAnimation,
        repeat: 0,
      });
    }

    if (this.sceneRef.anims.get(BulletConstants.bulletLeftAnimation) === undefined) {
      this.sceneRef.anims.create({
        frameRate: 10,
        frames: this.sceneRef.anims.generateFrameNumbers(BulletConstants.bulletSpriteKey, {
          start: 3,
          end: 3,
        }),
        key: BulletConstants.bulletLeftAnimation,
        repeat: 0,
      });
    }

    if (this.sceneRef.anims.get(BulletConstants.bulletExplosionAnimation) === undefined) {
      this.sceneRef.anims.create({
        frameRate: 10,
        frames: this.sceneRef.anims.generateFrameNumbers(BulletConstants.bulletExplosionSpriteKey, {
          start: 0,
          end: 0,
        }),
        key: BulletConstants.bulletExplosionAnimation,
        repeat: 0,
      });
    }
  }

  public createPlayerBullet(args: createBulletArgs) {
    const { posX, posY, velX, velY, name, direction, animKey } = args;
    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsGroupRef.create(
      posX,
      posY,
      BulletConstants.bulletSpriteKey
    );
    bullet.setVelocity(velX, velY);
    bullet.anims.play(animKey);

    const objectData = {
      name,
      key: Phaser.Math.RND.integer(),
      direction,
    };
    bullet.setData(objectData);
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.setBounce(0);
  }

  public getLength(): number {
    return this.bulletsGroupRef.getLength();
  }

  public remove(body: Phaser.GameObjects.GameObject) {
    this.bulletsGroupRef.remove(body, true, true);
  }

  public playExplosion(object: Phaser.GameObjects.GameObject) {
    console.log('this.playExplosion');
  }
}