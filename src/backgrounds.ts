import { Layers } from './depths';

function oneOf<T>(l: Array<T>): T {
  return l[Math.floor(Math.random() * l.length)];
}

function between(min: number, max: number): number {
  const length = max - min;
  return Math.random() * length + min;
}

class Decoration extends Phaser.Physics.Arcade.Sprite {
  update() {
    if (this.body.right < -10) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class GrassDecoration extends Decoration {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'deco', 'Grass01.png');
    this.setOrigin(0.5, 1);
  }

  show(groundHeight: number) {
    this.setFrame(oneOf([
      'Grass01.png',
      'Grass02.png',
      'Grass03.png'
    ]));
    const body = this.body as Phaser.Physics.Arcade.Body;
    const mainCamera = this.scene.cameras.main.width;
    //body.reset(mainCamera + this.width, groundHeight + 2);
    body.reset(1000, 800);
    this.setVelocityX(-300);
    this.setActive(true);
    this.setVisible(true);
  }
}

class CloudDecoration extends Decoration {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'deco');
    this.setOrigin(0.5, 1);
  }

  show(groundHeight: number, depth: number) {
    this.setFrame(oneOf([
      'Cloud01.png',
      'Cloud02.png',
      'Cloud03.png',
      'Cloud04.png'
    ]));
    const body = this.body as Phaser.Physics.Arcade.Body;
    const showHeight = Math.floor(between(this.height, groundHeight));
    const mainCamera = this.scene.cameras.main.width;
    body.setAllowGravity(false);
    body.reset(mainCamera + between(this.width, this.width * 1.5), showHeight);
    const [v, depthOffset] = oneOf([[10, 0], [100, 1], [300, 2]]);
    this.setVelocityX(-v);
    this.depth = depth + depthOffset;
    this.setActive(true);
    this.setVisible(true);
  }
}

export class BgManager extends Phaser.GameObjects.GameObject {

  private _groundHeight: number;

  private _bgDepth: number;

  private _fgDepth: number;

  private _grass: Phaser.Physics.Arcade.Group;

  private _clouds: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, groundHeight: number, bgDepth: number, fgDepth: number) {
    super(scene, 'bg-manager');
    this._groundHeight = groundHeight;
    this._bgDepth = bgDepth;
    this._fgDepth = fgDepth;
    this._grass = this.scene.physics.add.group({
      classType: GrassDecoration,
      maxSize: 20,
      runChildUpdate: true
    });
    this._clouds = this.scene.physics.add.group({
      classType: CloudDecoration,
      maxSize: 10,
      runChildUpdate: true
    });
  }

  update() {
    const grass = this._grass.get();
    if (grass) {
      grass.show(this._groundHeight, this._fgDepth);
    }

    const cloud = this._clouds.get();
    if (cloud) {
      cloud.show(this._groundHeight / 6 * 5, this._bgDepth);
    }
  }
}