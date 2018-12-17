const physicalResolution = {
  width: 800,
  height: 450
};

import Arcade = Phaser.Physics.Arcade;

class Cacota extends Arcade.Sprite {

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'obstacles');
  }

  show() {
    this.anims.play('cacota');
    this.body.reset(physicalResolution.width, physicalResolution.height/2);
    this.setVelocityX(-300);
    this.setVisible(true);
    this.setActive(true);
    this.setBounce(0.4);

    (this.body as Arcade.Body).setSize(this.width/2, this.height/2, false);
    (this.body as Arcade.Body).setOffset(0, this.height/2);
  }

  update() {
    if (this.body.right < -10) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

}

class MainTrack extends Phaser.Scene {

  cursors: Phaser.Input.Keyboard.CursorKeys;

  player: Phaser.Physics.Arcade.Sprite;

  groundLine: Phaser.Physics.Arcade.Sprite;

  jumpDeadline: number;

  anotherObstacle: boolean = true;

  obstacles: Phaser.Physics.Arcade.Group;

  preload() {
    this.load.image('bg', 'assets/environments/background-test.png');
    this.load.image('ground', 'assets/environments/ground-line.png');
    this.load.atlas(
        'characters',
        'assets/characters/characters.png',
        'assets/characters/characters.json'
    );
    this.load.atlas(
      'obstacles',
      'assets/obstacles/obstacles.png',
      'assets/obstacles/obstacles.json'
    )
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

    const ground = this.physics.add.staticGroup();
    this.groundLine = ground.create(
      0, physicalResolution.height,
      'ground'
    );
    this.groundLine.setOrigin(0, 1);
    this.groundLine.setScale(2, 1);
    this.groundLine.refreshBody();

    this.obstacles = this.physics.add.group({
      classType: Cacota,
      maxSize: 20,
      runChildUpdate: true
    });

    this.player = this.physics.add.sprite(
      physicalResolution.width / 4,
      physicalResolution.height / 2,
      'characters'
    );
    this.player.setCollideWorldBounds(true);

    const playerCollider = { width: 35, height: 25 };
    (this.player.body as Arcade.Body).setSize(
      playerCollider.width,
      playerCollider.height,
      false
    );
    (this.player.body as Arcade.Body).setOffset(
      5,
      this.player.height - playerCollider.height
    );

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.obstacles, ground);
    this.physics.add.overlap(this.player, this.obstacles, (player, start) => {
      console.log('PAM!')
      console.log('PUM!')
    }, null, this);

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

    this.anims.create({
      key: 'cacota',
      frames: this.anims.generateFrameNames(
        'obstacles',
        { prefix: 'Poo_Idle', zeroPad: 2, start: 1, end: 3, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });

    this.anims.create({
      key: 'hiding-otter',
      frames: this.anims.generateFrameNames(
        'obstacles',
        { prefix: 'Otter_Hide', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 3,
      repeat: 1
    });

    this.player.anims.play('salva-running');
  }

  update(time: number, delta: number) {
    const onTheGround = this.player.body.touching.down;
    const wantJump = this.cursors.space.isDown;
    if (onTheGround && wantJump) {
      this.jumpDeadline = time + 200;
    }
    if (wantJump && time < this.jumpDeadline) {
      this.player.setVelocityY(-600); 
    }
    if (this.anotherObstacle) {
      this.anotherObstacle = false;
      setTimeout(() => this.anotherObstacle = true, 1000);
      const cacota = this.obstacles.get();
      cacota.show();
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