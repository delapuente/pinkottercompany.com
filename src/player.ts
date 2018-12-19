import Arcade = Phaser.Physics.Arcade;

export class Player extends Arcade.Sprite {

  private _jumpDeadline: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'characters');
  }

  show(x: number, y: number) {
    this.anims.play('bea-running');

    const collisionBox = { width: 35, height: 25 };
    const body = this.body as Arcade.Body;
    body.setSize(collisionBox.width, collisionBox.height, false);
    body.setOffset(5, this.height - collisionBox.height);
    body.reset(x, y);
    this.setCollideWorldBounds(true);

    this.setVisible(true);
    this.setActive(true);
  }

  jump() {
    this.setVelocityY(-600);
  }

  static setupAnimations(scene: Phaser.Scene) {
    const anims = scene.anims;
    anims.create({
      key: 'bea-running',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Run', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    anims.create({
      key: 'salva-running',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Run', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    anims.create({
      key: 'bea-idle',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Idle', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 2,
      repeat: Infinity
    });

    anims.create({
      key: 'salva-idle',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Idle', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 2,
      repeat: Infinity
    });

    anims.create({
      key: 'bea-win',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Win', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    anims.create({
      key: 'salva-win',
      frames: anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Win', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });
  }
}