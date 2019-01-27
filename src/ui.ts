import { Player } from './player';

import Arcade = Phaser.Physics.Arcade;

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

  events: Phaser.Events.EventEmitter;

  private _bar: Phaser.GameObjects.Graphics;

  private _progress: number = 0;

  private _currentLevel: integer = 1;

  private _scoreFaces: Phaser.GameObjects.Image;

  private _scoreText: Phaser.GameObjects.Text;

  private _player: Player;

  private _bubble: Phaser.GameObjects.Sprite;

  private _depth: number;

  constructor(scene: Phaser.Scene, player: Player, depth: number) {
    super(scene, 'metter');
    this.events = new Phaser.Events.EventEmitter();
    this._player = player;
    this._depth = depth;
    this._bubble = this.scene.add.sprite(0, 0, 'ui');
    this._bubble.depth = this._depth;
    this._hideBubble();
    this._player.on('hit', this._loose, this);
    this._scoreFaces = this.scene.add.image(0, 0, 'ui', 'ScoreFaces.png');
    this._scoreFaces.setOrigin(0, 0);
    this._scoreText = this.scene.add.text(0, 0, '');
    this._scoreText.depth = this._depth;
    this._setupState(this._currentLevel);
    this._bar = this.scene.add.graphics();
  }

  hide() {
    this._scoreFaces.setVisible(false);
    this._scoreText.setVisible(false);
    this._bar.setVisible(false);
  }

  _setupState(level: number) {
    // Set label and center text
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    this._scoreText.setText(states[level]);
    const textWidth = this._scoreText.width;
    const facesWidth = this._scoreFaces.width;
    const separation = 20;
    const totalWidth = facesWidth + separation + textWidth;
    this._scoreFaces.x = (width - totalWidth) / 2;
    this._scoreFaces.y = height - 45;
    this._scoreText.x = this._scoreFaces.x + facesWidth + separation;
    this._scoreText.y = this._scoreFaces.y;

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
    this._bubble.anims.play(bubbleType == Bubbles.Happy ? 'level-up' : 'level-down');
    this.scene.time.delayedCall(time, () => {
      this._hideBubble();
    }, [], this);
  }

  _hideBubble() {
    this._bubble.setVisible(false);
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
        this.events.emit('top');
      }
    }

    // Make the progress bar to grow.
    const start = this.scene.cameras.main.width / 3;
    const height = this.scene.cameras.main.height - 15;
    const isMaxLevel = this._progress == 1 && this._currentLevel == states.length - 1;
    const color =  isMaxLevel ? 0xfbaec7 : 0xffffff;
    this._bar.lineStyle(5, color, 1);
    this._bar.lineBetween(
      start, height,
      start + start * this._progress, height
    );

    this._bubble.setPosition(
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

export class Rings extends Arcade.Sprite {

  private _middleX: number;

  private _middleY: number;

  events: Phaser.Events.EventEmitter;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'ui');
    this.events = new Phaser.Events.EventEmitter();
    this.setOrigin(0.5, 0);
    this.setVisible(false);
  }

  show() {
    this._middleX = this.scene.cameras.main.width / 2;
    this._middleY = this.scene.cameras.main.height / 2;
    const bottom = this._middleY * 2;
    const body = this.body as Arcade.Body;
    body.setAllowGravity(false);
    body.reset(this._middleX, bottom + 50);
    this.play('spinning');
    this.setVelocityY(-20)
    this.setVisible(true);
  }

  update() {
    if (this.y < this._middleY) {
      this.setVelocityY(0);
      this.events.emit('shown');
    }
  }

  static setupAnimations(scene: Phaser.Scene) {
    const anims = scene.anims;
    anims.create({
      key: 'spinning',
      frames: anims.generateFrameNames(
        'ui',
        { prefix: 'Rings', zeroPad: 2, start: 1, end: 8, suffix: '.png' }
      ),
      frameRate: 7,
      repeat: Infinity
    });
  }
}