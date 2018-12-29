import { Player } from './player';

export class Control {

  private _pointer: Phaser.Input.Pointer;

  private _cursors: Phaser.Input.Keyboard.CursorKeys;

  private _player: Player;

  private _jumpDeadline: number;

  constructor(cursors: Phaser.Input.Keyboard.CursorKeys, pointer: Phaser.Input.Pointer, player: Player) {
    this._pointer = pointer;
    this._cursors = cursors;
    this._player = player;
  }

  update(time: number, delta: number) {
    this._resolveJump(time, delta);
  }

  private _resolveJump(time: number, delta: number) {
    const onTheGround = this._player.body.touching.down;
    const wantJump = this._cursors.space.isDown || this._pointer.isDown;
    if (wantJump && onTheGround) {
      this._jumpDeadline = time + 200;
    }
    if (wantJump && time < this._jumpDeadline) {
      this._player.jump();
    }
  }
}