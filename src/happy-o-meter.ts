import { Player } from './player';
import { NONE } from 'phaser';

const states: Array<string> = [
  'tienen baches',
  'están bien',
  'van guay',
  'están chachi',
  'son felices',
  'son MUY felices'
];

enum Bubbles {
  Happy, Sad
}

export class HappyOMeter extends Phaser.GameObjects.GameObject {

  private _bar: Phaser.GameObjects.Graphics;

  private _progress: number = 0;

  private _currentLevel: integer = 1;

  private _scoreText: Phaser.GameObjects.Text;

  private _player: Player;

  private _bubble: Phaser.GameObjects.Image;

  private _face: Phaser.GameObjects.Sprite;

  private _depth: number;

  constructor(scene: Phaser.Scene, player: Player, depth: number) {
    super(scene, 'metter');
    this._player = player;
    this._depth = depth;
    this._bubble = this.scene.add.image(0, 0, 'ui', 'Balloon');
    this._bubble.depth = this._depth;
    this._face = this.scene.add.sprite(0, 0, 'ui');
    this._face.depth = this._bubble.depth + 1;
    this._hideBubble();
    this._player.on('hit', this._loose, this);
    this._scoreText = this.scene.add.text(0, 0, '');
    this._scoreText.depth = this._depth;
    this._setupState(this._currentLevel);
    this._bar = this.scene.add.graphics();
  }

  _setupState(level: number) {
    // Set label and center text
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    this._scoreText.setText(states[level]);
    const textWidth = this._scoreText.width;
    this._scoreText.x = (width - textWidth) / 2;
    this._scoreText.y = height - 45;

    // Reset progress
    this._progress = 0;
  }

  _loose() {
    this._showBubble(Bubbles.Sad, 3000)
    this._progress -= 0.6;
    if (this._progress < 0) {
      this._progress = 0;
      this._levelDown();
    }
  }

  _levelDown() {
    if (this._currentLevel > 0) {
      this._currentLevel--;
      this._setupState(this._currentLevel);
    }
  }

  _levelUp() {
    if (this._currentLevel < states.length - 1) {
      this._currentLevel++;
      this._setupState(this._currentLevel);
      this._showBubble(Bubbles.Happy, 3000);
    }
  }

  _showBubble(bubbleType: Bubbles, time: number) {
    this._bubble.setVisible(true);
    this._face.setVisible(true);
    this._face.anims.play(bubbleType == Bubbles.Happy ? 'level-up' : 'level-down');
    this.scene.time.delayedCall(time, () => {
      this._hideBubble();
    }, [], this);
  }

  _hideBubble() {
    this._bubble.setVisible(false);
    this._face.setVisible(false);
  }

  update(time: number, delta: number) {
    this._bar.clear();
    this._progress += (delta / 1000) * 10 / 100;
    if (this._progress >= 1) {
      if (this._currentLevel < states.length - 1) {
        this._levelUp();
      }
      else {
        this._progress = 1;
      }
    }

    // Make the progress bar to grow.
    const start = this.scene.cameras.main.width / 3;
    const height = this.scene.cameras.main.height - 15;
    this._bar.lineStyle(5, 0xffffff, 1);
    this._bar.lineBetween(
      start, height,
      start + start * this._progress, height
    );

    // Position bubble over the character.
    this._bubble.setPosition(
      this._player.x + 15,
      this._player.y - this._player.height + 5
    );
    this._face.setPosition(
      this._player.x + 15,
      this._player.y - this._player.height - 2
    );
  }

  static setupAnimations(scene: Phaser.Scene) {
    const anims = scene.anims;
    anims.create({
      key: 'level-up',
      frames: anims.generateFrameNames(
        'ui',
        { prefix: 'HappyFace', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });
    anims.create({
      key: 'level-down',
      frames: anims.generateFrameNames(
        'ui',
        { prefix: 'SadFace', zeroPad: 2, start: 1, end: 2, suffix: '.png' }
      ),
      frameRate: 5,
      repeat: Infinity
    });
  }

}