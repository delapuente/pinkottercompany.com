import * as isMobile from 'ismobilejs';

import { MainTrack } from './main-track';
import { PlayerSelection } from './player-selection';
import { physicalResolution } from './size';

const canvas = document.querySelector('canvas');

const config = {
  type: Phaser.AUTO,
  width: physicalResolution.width,
  height: physicalResolution.height,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 4000 },
      debug: false
    }
  },
  canvas
};

const game = new Phaser.Game(config);
game.scene.add('player-selection', PlayerSelection);
game.scene.add('main', MainTrack);
canvas.removeAttribute('style');

function screenSizeCheck() {
  const isTooSmall = screen.width < physicalResolution.width * 3/4;
  const tooSmallNotice: HTMLElement = document.querySelector('#gaming-area .notice');
  tooSmallNotice.hidden = !isTooSmall;
}
window.onorientationchange = screenSizeCheck;
screenSizeCheck();

document.querySelector('#start').addEventListener('click', () => {
  const gameCover: HTMLElement = document.querySelector('#gaming-area .cover');
  gameCover.hidden = true;
  if (isMobile.any) {
    canvas.requestFullscreen();
  }
  game.scene.start('player-selection');
});