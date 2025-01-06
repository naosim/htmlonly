export const AssetKeys = {
  sky: 'sky',
  bomb: 'bomb',
  ground: 'ground',
  star: 'star',
  mario_map: 'mario_map',
  map: 'map',
  dude: "dude"
};


export class ActionGameLoader {
  images = {
    [AssetKeys.sky]: '../assets/sky.png',
    [AssetKeys.bomb]: '../assets/bomb.png',
    [AssetKeys.ground]: '../assets/platform.png',
    [AssetKeys.star]: '../assets/star.png',
    [AssetKeys.mario_map]: '../assets/mario_map.png',
  };
  tilemap = {
    [AssetKeys.map]: '../assets/mario.json',
  };
  spritesheet = {
    [AssetKeys.dude]: {path: "../assets/dude.png", frameConfig: { frameWidth: 32, frameHeight: 48 }}
  }
  
  preload(/** @type {Phaser.Scene}*/ scene) {
    Object.keys(this.spritesheet).forEach(k => scene.load.spritesheet(k, this.spritesheet[k].path, this.spritesheet[k].frameConfig));
    Object.keys(this.images).forEach(k => scene.load.image(k, this.images[k]));
    Object.keys(this.tilemap).forEach(k => scene.load.tilemapTiledJSON(k, this.tilemap[k]));
  }
}

