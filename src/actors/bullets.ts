import { StageScene } from "../scenes/stage-scene";
import createBulletArgs from "../types/createBulletArgs.type";

export class Bullets {
  constructor(private bulletsGroupRef: Phaser.Physics.Arcade.Group, private sceneRef: StageScene) {}

  public createPlayerBullet(args: createBulletArgs) {
    const { posX, posY, spriteKey, velX, velY, frameNum, name, direction } = args;
    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsGroupRef.create(posX, posY, spriteKey);

    const objectData = {
      name,
      key: Phaser.Math.RND.integer(),
      direction,
    };
    bullet.setData(objectData);
    bullet.setCollideWorldBounds(true);
    bullet.setBounce(0);
    bullet.setVelocity(velX, velY);
    bullet.setFrame(frameNum);
  }

  public getLength():number {
    return this.bulletsGroupRef.getLength();
  }
}