import Arcade = Phaser.Physics.Arcade;

export class Cacota extends Arcade.Sprite {

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'obstacles');
  }

  show(x: number, y: number) {
    this.anims.play('cacota');

    const body = this.body as Arcade.Body;
    body.reset(x, y);
    body.setSize(this.width/2, this.height/2, false);
    body.setOffset(0, this.height/2);
    this.setBounce(0.4);
    this.setVelocityX(-300);

    this.setVisible(true);
    this.setActive(true);
  }

  update() {
    if (this.body.right < -10) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  static setupAnimations(scene: Phaser.Scene) {
    const anims = scene.anims;
    anims.create({
      key: 'cacota',
      frames: anims.generateFrameNames(
        'obstacles',
        { prefix: 'Poo_Idle', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });
  }
}