import { Player, partners } from './player';
import { Cacota } from './obstacles';
import { Control } from './control';
import { HappyOMeter, Rings } from './ui';
import { BgManager } from './backgrounds';
import { Layers } from './depths';
import { physicalResolution } from './size';

export class MainTrack extends Phaser.Scene {

  control: Control;

  hapyness: HappyOMeter;

  rings: Rings;

  player: Player;

  groundLine: Phaser.Physics.Arcade.Sprite;

  jumpDeadline: number;

  anotherObstacle: boolean = true;

  throwObstacles: boolean = true;

  obstacles: Phaser.Physics.Arcade.Group;

  background: BgManager;

  private _backButton: Phaser.GameObjects.Image;

  private _won: boolean = false;

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

    [
      Player,
      Cacota,
      HappyOMeter,
      Rings
    ].forEach(klass => klass.setupAnimations(this));

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

    this.rings = this.add.existing(new Rings(this.scene.scene)) as Rings;
    this.physics.add.existing(this.rings);
    this.rings.depth = Layers.UI + 2;

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

    // Quick win trigger
    this.input.keyboard.once('keydown_F', this.winningSequence, this);
    this.hapyness.events.once('top', this.winningSequence, this);

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

  winningSequence() {
    if (this._won) { return; }

    this.throwObstacles = false;
    this.hapyness.hide();
    this.player.setAccelerationX(150);
    this.player.setCollideWorldBounds(false);
    this.rings.show();
    this.rings.events.once('shown', () => {
      // Flash
      this.cameras.main.flash(1000, 0xffffff);
      
      // Create the other player
      const quarterX = this.cameras.main.width / 4;
      const middleY = this.cameras.main.height / 2;
      const otherPlayerName = this.player.name == 'bea' ? 'salva': 'bea';
      const otherPlayer = new Player(this.scene.scene, otherPlayerName);
      otherPlayer.depth = Layers.PLAYER;
      this.physics.add.collider(this.groundLine, otherPlayer);
      this.add.existing(otherPlayer);
      this.physics.add.existing(otherPlayer);

      // Show both players
      this.player.showWinning(quarterX, middleY);
      otherPlayer.showWinning(3 * quarterX, middleY);
      otherPlayer.scaleX = -1;

      // Stop grass in the background
      this.background.stop();
    });

    this._won = true;
  }

  update(time: number, delta: number) {
    this.control.update(time, delta);
    this.hapyness.update(time, delta);
    this.background.update();
    this.rings.update();
    if (this.throwObstacles && this.anotherObstacle) {
      this.anotherObstacle = false;
      setTimeout(() => this.anotherObstacle = true, 1000);
      const cacota = this.obstacles.get();
      cacota.depth = Layers.OBSTACLES;
      cacota.show(physicalResolution.width, physicalResolution.height/2);
    }
  }
}