import PlayerConstants from "../constants/player";
import BulletConstants from "../constants/bullet";

import { StageScene } from "../scenes/stage-scene";

export class Player {
  private playerDirection: number;

  constructor(
    private playerRef: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    private playerSpriteKey: string,
    private sceneRef: StageScene
  ) {
    this.playerInit();
  }

  private playerInit() {
    this.playerDirection = Phaser.UP;
    this.playerRef.setCollideWorldBounds(true);
    this.playerRef.setBounce(0);
    this.setAnimations();
  }

  private setAnimations() {
    this.playerRef.anims.create({
      frameRate: 10,
      frames: this.playerRef.anims.generateFrameNumbers(this.playerSpriteKey, { start: 0, end: 1 }),
      key: PlayerConstants.playerUpAnimation,
      repeat: -1,
    });

    this.playerRef.anims.create({
      frameRate: 10,
      frames: this.playerRef.anims.generateFrameNumbers(this.playerSpriteKey, { start: 2, end: 3 }),
      key: PlayerConstants.playerRightAnimation,
      repeat: -1,
    });

    this.playerRef.anims.create({
      frameRate: 10,
      frames: this.playerRef.anims.generateFrameNumbers(this.playerSpriteKey, { start: 4, end: 5 }),
      key: PlayerConstants.playerDownAnimation,
      repeat: -1,
    });

    this.playerRef.anims.create({
      frameRate: 10,
      frames: this.playerRef.anims.generateFrameNumbers(this.playerSpriteKey, { start: 6, end: 7 }),
      key: PlayerConstants.playerLeftAnimation,
      repeat: -1,
    });
  }

  private getCurrentPlayingAnimation(): string | undefined {
    const isAnimPlaying = this.playerRef.anims.isPlaying;
    if (isAnimPlaying) {
      return this.playerRef.anims.currentAnim?.key;
    } else {
      return;
    }
  }

  private setDirection(newDirection: number): void {
    this.playerDirection = newDirection;

    const currentAnim: string | undefined = this.getCurrentPlayingAnimation();

    if (newDirection === Phaser.UP && currentAnim !== PlayerConstants.playerUpAnimation) {
      this.playerRef.anims.play(PlayerConstants.playerUpAnimation);
    } else if (newDirection === Phaser.DOWN && currentAnim !== PlayerConstants.playerDownAnimation) {
      this.playerRef.anims.play(PlayerConstants.playerDownAnimation);
    } else if (newDirection === Phaser.LEFT && currentAnim !== PlayerConstants.playerLeftAnimation) {
      this.playerRef.anims.play(PlayerConstants.playerLeftAnimation);
    } else if (newDirection === Phaser.RIGHT && currentAnim !== PlayerConstants.playerRightAnimation) {
      this.playerRef.anims.play(PlayerConstants.playerRightAnimation);
    }
  }

  public handleMovement(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursorKeys.up.isDown) {
      this.setDirection(Phaser.UP);
      this.playerRef.setVelocity(0, -PlayerConstants.playerVelocity);
    } else if (cursorKeys.down.isDown) {
      this.setDirection(Phaser.DOWN);
      this.playerRef.setVelocity(0, PlayerConstants.playerVelocity);
    } else if (cursorKeys.left.isDown) {
      this.setDirection(Phaser.LEFT);
      this.playerRef.setVelocity(-PlayerConstants.playerVelocity, 0);
    } else if (cursorKeys.right.isDown) {
      this.setDirection(Phaser.RIGHT);
      this.playerRef.setVelocity(PlayerConstants.playerVelocity, 0);
    } else {
      this.playerRef.setVelocity(0);
      this.playerRef.anims.stop();
    }

    if (cursorKeys.space.isDown) {
      this.fire();
    }
  }

  private fire():void {
    // if (this.sceneRef.getPlayer1Bullets.getLength() > 0) {
    //   return ;
    // }

    let posX: number, posY: number, velX: number, velY: number, frameNum:number;
    if (this.playerDirection === Phaser.UP) {
      posX = this.playerRef.x;
      posY = this.playerRef.y - this.playerRef.height / 2;
      velX = 0;
      velY = -BulletConstants.bulletVelocity;
      frameNum = 0;
    } else if (this.playerDirection === Phaser.DOWN) {
      posX = this.playerRef.x;
      posY = this.playerRef.y + this.playerRef.height / 2;
      velX = 0;
      velY = BulletConstants.bulletVelocity;
      frameNum = 2;
    } else if (this.playerDirection === Phaser.LEFT) {
      posX = this.playerRef.x - this.playerRef.width / 2;
      posY = this.playerRef.y;
      velX = -BulletConstants.bulletVelocity;
      velY = 0;
      frameNum = 3;
    } else {
      posX = this.playerRef.x + this.playerRef.width / 2;
      posY = this.playerRef.y;
      velX = BulletConstants.bulletVelocity;
      velY = 0;
      frameNum = 1;
    }

    this.sceneRef.getPlayer1Bullets.createPlayerBullet({
      posX,
      posY,
      velX,
      velY,
      frameNum,
      spriteKey: BulletConstants.bulletSpriteKey,
      name: BulletConstants.player1BulletName,
      direction: this.playerDirection,
    });
  }

  public getRef() {
    return this.playerRef;
  }
}