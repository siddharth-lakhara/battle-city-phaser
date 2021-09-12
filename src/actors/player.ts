import PlayerConstants, { scalingFactor } from "../constants/player";
import BulletConstants from "../constants/bullet";

import { StageScene } from "../scenes/stage-scene";
import { fireOffestMagicNumber } from "../constants/game";

export class Player {
  private playerDirection: number;
  private playerSpriteRef:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    private playerSpriteKey: string,
    private sceneRef: StageScene
  ) {
    this.playerInit();
  }

  get sprite() {
    return this.playerSpriteRef;
  };

  private playerInit() {
    this.playerSpriteRef = this.sceneRef.physics.add.sprite(
      PlayerConstants.player1InitialXPos,
      PlayerConstants.player1InitialYPos,
      PlayerConstants.player1SpriteKey
    )
    // this.playerSpriteRef.setOrigin(0.5, 0.5);
    this.sprite.setScale(PlayerConstants.scalingFactor);
    this.playerDirection = Phaser.UP;
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0);
    this.sprite.setOffset(-0.5);
    this.setAnimations();
  }

  private setAnimations() {
    this.sprite.anims.create({
      frameRate: 10,
      frames: this.sprite.anims.generateFrameNumbers(this.playerSpriteKey, { start: 0, end: 1 }),
      key: PlayerConstants.playerUpAnimation,
      repeat: -1,
    });

    this.sprite.anims.create({
      frameRate: 10,
      frames: this.sprite.anims.generateFrameNumbers(this.playerSpriteKey, { start: 2, end: 3 }),
      key: PlayerConstants.playerLeftAnimation,
      repeat: -1,
    });

    this.sprite.anims.create({
      frameRate: 10,
      frames: this.sprite.anims.generateFrameNumbers(this.playerSpriteKey, { start: 4, end: 5 }),
      key: PlayerConstants.playerDownAnimation,
      repeat: -1,
    });

    this.sprite.anims.create({
      frameRate: 10,
      frames: this.sprite.anims.generateFrameNumbers(this.playerSpriteKey, { start: 6, end: 7 }),
      key: PlayerConstants.playerRightAnimation,
      repeat: -1,
    });
  }

  private getCurrentPlayingAnimation(): string | undefined {
    const isAnimPlaying = this.sprite.anims.isPlaying;
    if (isAnimPlaying) {
      return this.sprite.anims.currentAnim?.key;
    } else {
      return;
    }
  }

  private setDirection(newDirection: number): void {
    this.playerDirection = newDirection;

    const currentAnim: string | undefined = this.getCurrentPlayingAnimation();

    if (newDirection === Phaser.UP && currentAnim !== PlayerConstants.playerUpAnimation) {
      this.sprite.anims.play(PlayerConstants.playerUpAnimation);
    } else if (newDirection === Phaser.DOWN && currentAnim !== PlayerConstants.playerDownAnimation) {
      this.sprite.anims.play(PlayerConstants.playerDownAnimation);
    } else if (newDirection === Phaser.LEFT && currentAnim !== PlayerConstants.playerLeftAnimation) {
      this.sprite.anims.play(PlayerConstants.playerLeftAnimation);
    } else if (newDirection === Phaser.RIGHT && currentAnim !== PlayerConstants.playerRightAnimation) {
      this.sprite.anims.play(PlayerConstants.playerRightAnimation);
    }
  }

  public handleMovement(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursorKeys.up.isDown) {
      this.setDirection(Phaser.UP);
      this.sprite.setVelocity(0, -PlayerConstants.playerVelocity);
    } else if (cursorKeys.down.isDown) {
      this.setDirection(Phaser.DOWN);
      this.sprite.setVelocity(0, PlayerConstants.playerVelocity);
    } else if (cursorKeys.left.isDown) {
      this.setDirection(Phaser.LEFT);
      this.sprite.setVelocity(-PlayerConstants.playerVelocity, 0);
    } else if (cursorKeys.right.isDown) {
      this.setDirection(Phaser.RIGHT);
      this.sprite.setVelocity(PlayerConstants.playerVelocity, 0);
    } else {
      this.sprite.setVelocity(0);
      this.sprite.anims.stop();
    }

    if (cursorKeys.space.isDown) {
      this.fire();
    }
  }

  private fire():void {
    if (this.sceneRef.getPlayer1Bullets.getLength() > 0) {
      return ;
    }

    let posX: number, posY: number, velX: number, velY: number, animKey: string;
    if (this.playerDirection === Phaser.UP) {
      posX = this.sprite.x + fireOffestMagicNumber;
      posY = this.sprite.y - (this.sprite.displayHeight / 2);
      velX = 0;
      velY = -BulletConstants.bulletVelocity;
      animKey = BulletConstants.bulletUpAnimation
    } else if (this.playerDirection === Phaser.DOWN) {
      posX = this.sprite.x + fireOffestMagicNumber;
      posY = this.sprite.y + this.sprite.displayHeight / 2;
      velX = 0;
      velY = BulletConstants.bulletVelocity;
      animKey = BulletConstants.bulletDownAnimation;
    } else if (this.playerDirection === Phaser.LEFT) {
      posX = this.sprite.x - this.sprite.displayWidth / 2;
      posY = this.sprite.y + fireOffestMagicNumber;
      velX = -BulletConstants.bulletVelocity;
      velY = 0;
      animKey = BulletConstants.bulletLeftAnimation;
    } else {
      posX = this.sprite.x + this.sprite.displayWidth / 2;
      posY = this.sprite.y + fireOffestMagicNumber;
      velX = BulletConstants.bulletVelocity;
      velY = 0;
      animKey = BulletConstants.bulletRightAnimation;
    }

    this.sceneRef.getPlayer1Bullets.createPlayerBullet({
      posX,
      posY,
      velX,
      velY,
      name: BulletConstants.player1BulletName,
      direction: this.playerDirection,
      animKey
    });
  }
}