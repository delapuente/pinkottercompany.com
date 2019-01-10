
import { Player } from './player';

export class PlayerSelection extends Phaser.Scene {

  private _arrow: Phaser.GameObjects.Image;

  private _left: Player;

  private _right: Player;

  private _selected: Player;

  preload() {
    this.load.atlas(
      'ui',
      'assets/ui/ui.png',
      'assets/ui/ui.json'
    );
    this.load.atlas(
      'characters',
      'assets/characters/characters.png',
      'assets/characters/characters.json'
    );
  }

  create() {
    Player.setupAnimations(this);

    const [x, y] = [
      this.cameras.main.width / 3,
      this.cameras.main.height * 6 / 10 
    ];
    this._left = this.add.existing(
      new Player(this.scene.scene, 'bea')
    ) as Player;
    this._left.showIdle(x, y);
    this._left.setInteractive();
    this._left.on('pointerdown', () => {
      this._select('left');
    });

    this._right = this.add.existing(
      new Player(this.scene.scene, 'salva')
    ) as Player;
    this._right.showIdle(this.cameras.main.width - x, y);
    this._right.setInteractive();
    this._right.on('pointerdown', () => {
      this._select('right');
    });
    
    this._selected = this._left;
    const aboveCharacters = y - this._selected.height;
    this._arrow = this.add.image(x, aboveCharacters, 'ui', 'SelectArrow.png');

    const cX = this.cameras.main.width / 2;
    const aboveLine = this.cameras.main.height / 10;
    const belowLine = 8 / 10 * this.cameras.main.height;
    const buttonLine = 9 / 10 * this.cameras.main.height;
    
    const selectPlayerText = this.add.text(0, 0, 'Selecciona un jugador');
    this._centerText(selectPlayerText, cX, aboveLine);

    const explanationText = this.add.text(0, 0, 'En el juego, evita las cacotas pulsando espacio o tocando la pantalla.');
    this._centerText(explanationText, cX, belowLine);

    const startText = this.add.text(0, 0, '¡Vamos allá!');
    this._centerText(startText, cX, buttonLine);
    startText.setInteractive();
    startText.on('pointerdown', () => {
      this.scene.transition({
        target: 'main',
        duration: 1000
      });
    });

    this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown_LEFT', () => {
      this._select('left');
    });
    this.input.keyboard.on('keydown_RIGHT', () => {
      this._select('right');
    });
    this.events.on('destroy', () => {
      console.log('muerteeeeee');
      this.input.keyboard.destroy();
    });
  }

  _centerText(
    textObject: Phaser.GameObjects.Text, x: number, y: number) {

    textObject.setOrigin(0.5, 0.5);
    textObject.setPosition(x, y);
  }

  _select(option: 'left' | 'right') {
    this._selected = option == 'left' ? this._left : this._right;
    this._arrow.x = this._selected.x;
  }

}