import { Player, partners } from './player';
import { Cacota } from './obstacles';
import { Control } from './control';
import { HappyOMeter } from './happy-o-meter';
import { BgManager } from './backgrounds';
import { Layers } from './depths';
import { physicalResolution } from './size';

export class MainTrack extends Phaser.Scene {

  control: Control;

  hapyness: HappyOMeter;

  player: Player;

  groundLine: Phaser.Physics.Arcade.Sprite;

  jumpDeadline: number;

  anotherObstacle: boolean = true;

  obstacles: Phaser.Physics.Arcade.Group;

  background: BgManager;

  private _backButton: Phaser.GameObjects.Image;

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
    );
    this.load.atlas(
      'ui',
      'assets/ui/ui.png',
      'assets/ui/ui.json'
    );
    this.load.atlas(
      'deco',
      'assets/environments/deco.png',
      'assets/environments/deco.json'
    );
  }

  create({ playerName }: { playerName: partners }) {

    Player.setupAnimations(this);
    Cacota.setupAnimations(this);
    HappyOMeter.setupAnimations(this);

    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

    const ground = this.physics.add.staticGroup();
    this.groundLine = ground.create(
      0, physicalResolution.height,
      'ground'
    );
    this.groundLine.setOrigin(0, 1);
    this.groundLine.setScale(2, 1);
    this.groundLine.refreshBody();
    this.background = new BgManager(this.scene.scene, this.groundLine, Layers.BG_ELEMENTS, Layers.FG);

    this.obstacles = this.physics.add.group({
      classType: Cacota,
      maxSize: 20,
      runChildUpdate: true
    });

    this.player = this.add.existing(new Player(this.scene.scene, playerName)) as Player;
    this.player.depth = Layers.PLAYER;
    this.physics.add.existing(this.player);
    this.player.showRunning(
      physicalResolution.width / 4,
      physicalResolution.height / 2
    );

    this.control = new Control(
      this.input.keyboard.createCursorKeys(),
      this.input.activePointer,
      this.player
    );

    this._backButton = this.add.image(5, 5, 'ui', 'BackArrow.png');
    this._backButton.depth = Layers.UI;
    this._backButton.setOrigin(0, 0);
    this._backButton.setInteractive();
    this._backButton.on('pointerdown', () => {
      const isFullscreen = document.fullscreen;
      if (isFullscreen) {
        document.exitFullscreen();
      }
      else {
        this.scene.transition({
          target: 'player-selection'
        });
      }
    });

    this.hapyness = this.add.existing(
      new HappyOMeter(this.scene.scene, this.player, Layers.UI)
    ) as HappyOMeter;

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.obstacles, ground);
    this.physics.add.overlap(this.player, this.obstacles, (player, cacota) => {
      this.player.hit()
    }, null, this);

    this.anims.create({
      key: 'hiding-otter',
      frames: this.anims.generateFrameNames(
        'obstacles',
        { prefix: 'Otter_Hide', zeroPad: 2, start: 1, end: 4, suffix: '.png' }
      ),
      frameRate: 3,
      repeat: 1
    });
  }

  update(time: number, delta: number) {
    this.control.update(time, delta);
    this.hapyness.update(time, delta);
    this.background.update();
    if (this.anotherObstacle) {
      this.anotherObstacle = false;
      setTimeout(() => this.anotherObstacle = true, 1000);
      const cacota = this.obstacles.get();
      cacota.depth = Layers.OBSTACLES;
      cacota.show(physicalResolution.width, physicalResolution.height/2);
    }
  }
}