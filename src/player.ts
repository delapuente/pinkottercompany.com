import Arcade = Phaser.Physics.Arcade;

export type partners = 'bea' | 'salva';

export class Player extends Arcade.Sprite {

  private _blinkEffect: Phaser.Time.TimerEvent;

  readonly name: partners;

  constructor(scene: Phaser.Scene, name: partners) {
    super(scene, 0, 0, 'characters');
    this.name = name;
    this._blinkEffect = this.scene.time.addEvent({
      delay: 100,
      loop: true,
      repeat: Infinity,
      callback: this._switchVisibility,
      callbackScope: this
    });
    this._blinkEffect.paused = true;
  }

  showIdle(x: number, y: number) {
    this.setPosition(x, y);
    this.anims.play(`${this.name}-idle`);
    this.setVisible(true);
    this.setActive(true);
  }

  showRunning(x: number, y: number) {
    this.anims.play(`${this.name}-running`);

    const collisionBox = { width: 35, height: 25 };
    const body = this.body as Arcade.Body;
    body.setSize(collisionBox.width, collisionBox.height, false);
    body.setOffset(5, this.height - collisionBox.height);
    body.reset(x, y);
    this.setCollideWorldBounds(true);

    this.setVisible(true);
    this.setActive(true);
  }

  showWinning(x: number, y: number) {
    this.body.reset(x, y);
    this.anims.play(`${this.name}-win`);
    this.setVisible(true);
    this.setActive(true);
  }

  jump() {
    this.setVelocityY(-600);
  }

  hit() {
    if (this._blinkEffect.paused) {
      this._blinkEffect.paused = false;
      this.scene.time.delayedCall(3000, () => {
        this._blinkEffect.paused = true;
        this.setVisible(true);
      }, [], this);
      this.emit('hit');
    }
  }

  private _switchVisibility() {
    this.setVisible(!this.visible);
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