const physicalResolution = {
  width: 667,
  height: 375
};

class MainTrack extends Phaser.Scene {

  preload() {
    this.load.image('bg', 'assets/environments/test-667x375.png');
    this.load.image('ground', 'assets/environments/ground-667x55.png');
    // this.load.spritesheet(
    //   'novios', 'assets/novios.png',
    //   { frameWidth: 144 , frameHeight: 160 });
  }

  create() {
    this.add.image(0, 0, 'bg').setOrigin(0, 0)
    this.add.image(0, physicalResolution.height, 'ground').setOrigin(0, 1);
  }

}

const config = {
  type: Phaser.AUTO,
  width: physicalResolution.width,
  height: physicalResolution.height,
  scene: MainTrack
};

const game = new Phaser.Game(config);