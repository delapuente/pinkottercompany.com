const physicalResolution = {
  width: 800,
  height: 450
};

class MainTrack extends Phaser.Scene {

  cursors: Phaser.Input.Keyboard.CursorKeys;

  player: Phaser.Physics.Arcade.Sprite;

  jumpDeadline: number;

  preload() {
    this.load.image('bg', 'assets/environments/background-test.png');
    this.load.image('ground', 'assets/environments/ground-line.png');
    this.load.atlas(
        'characters',
        'assets/characters/characters.png',
        'assets/characters/characters.json'
    );
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

    const ground = this.physics.add.staticGroup();
    const groundLine : Phaser.Physics.Arcade.Image = ground.create(
      0, physicalResolution.height,
      'ground'
    );
    groundLine.setOrigin(0, 1);
    groundLine.refreshBody();

    this.player = this.physics.add.sprite(
      physicalResolution.width / 2,
      physicalResolution.height / 2,
      'characters'
    );
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, ground);

    this.anims.create({
      key: 'bea-running',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Run', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    this.anims.create({
      key: 'salva-running',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Run', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    this.anims.create({
      key: 'bea-idle',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Idle', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 2,
      repeat: Infinity
    });

    this.anims.create({
      key: 'salva-idle',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Idle', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 2,
      repeat: Infinity
    });

    this.anims.create({
      key: 'bea-win',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Bea_Win', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    this.anims.create({
      key: 'salva-win',
      frames: this.anims.generateFrameNames(
        'characters',
        { prefix: 'Salva_Win', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    this.player.anims.play('salva-running');
  }

  update(time: number) {
    const onTheGround = this.player.body.touching.down;
    const wantJump = this.cursors.space.isDown;
    if (onTheGround && wantJump) {
      this.jumpDeadline = time + 200;
    }
    if (wantJump && time < this.jumpDeadline) {
      this.player.setVelocityY(-600); 
    } 
  }

}

const config = {
  type: Phaser.AUTO,
  width: physicalResolution.width,
  height: physicalResolution.height,
  scene: MainTrack,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 4000 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);