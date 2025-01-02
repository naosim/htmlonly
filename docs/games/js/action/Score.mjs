export class Score {
  value = 0;
  sprite;
  preload(scene) {
  }
  create(scene) {
    this.sprite = scene.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  }

  add(/** @type {number}*/ point) {
    this.value += point;
    this.sprite.setText('Score: ' + this.value);
  }
}
