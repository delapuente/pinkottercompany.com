import { Layers } from './depths';

function oneOf<T>(l: Array<T>): T {
  return l[Math.floor(Math.random() * l.length)];
}

function between(min: number, max: number): number {
  const length = max - min;
  return Math.random() * length + min;
}

class Decoration extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'deco');
    this._disable();
  }

  _disable() {
    this.setActive(false);
    this.setVisible(false);
  }

  update() {
    if (this.body.right < -10) {
      this._disable();
    }
  }
}

class GrassDecoration extends Decoration {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setOrigin(0.5, 1);
  }

  show(groundHeight: number, depth: number) {
    this.setFrame(oneOf([
      'Grass01.png',
      'Grass02.png',
      'Grass03.png'
    ]));
    this.depth = depth;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    const mainCamera = this.scene.cameras.main;
    body.reset(
      between(mainCamera.width + this.width, mainCamera.width * 2),
      groundHeight
    );
    this.setVelocityX(-300);
    this.setActive(true);
    this.setVisible(true);
  }
}

class CloudDecoration extends Decoration {
  constructor(scene: Phaser.Scene) {
    super(scene);
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
    const mainCamera = this.scene.cameras.main;
    body.setAllowGravity(false);
    body.reset(
      between(mainCamera.width + this.width, mainCamera.width * 2),
      showHeight
    );
    const [v, depthOffset] = oneOf([[10, 0], [100, 1], [300, 2]]);
    this.depth = depth + depthOffset;
    this.setVelocityX(-between(v * 0.8, v * 1.2));
    this.setActive(true);
    this.setVisible(true);
  }
}

export class BgManager extends Phaser.GameObjects.GameObject {

  private _ground: Phaser.GameObjects.Sprite;

  private _groundHeight: number;

  private _bgDepth: number;

  private _fgDepth: number;

  private _grass: Phaser.Physics.Arcade.Group;

  private _grassEnabled: boolean = true;

  private _clouds: Phaser.Physics.Arcade.Group;

  private _cloudsEnabled: boolean = true;

  constructor(scene: Phaser.Scene, ground: Phaser.GameObjects.Sprite, bgDepth: number, fgDepth: number) {
    super(scene, 'bg-manager');
    this._ground = ground;
    this._groundHeight = this.scene.cameras.main.height - this._ground.height;
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
    this.scene.physics.add.collider(this._ground, this._grass);
  }

  stop() {
    this._grassEnabled = false;
    this._cloudsEnabled = false;
    this._grass.setVelocity(0, 0);
    this._clouds.children.each((child: CloudDecoration) => {
      child.setVelocityX(child.body.velocity.x / 10);
    }, this);
  }

  update() {
    if (this._grassEnabled && Math.random() < 0.4) {
      const grass = this._grass.get();
      if (grass) {
        grass.show(this._groundHeight, this._fgDepth);
      }
    }

    if (this._cloudsEnabled) {
      const cloud = this._clouds.get();
      if (cloud) {
        cloud.show(this._groundHeight / 6 * 5, this._bgDepth);
      }
    }
  }
}