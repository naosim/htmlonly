export class Score {
  value = 0;
  gameObject;

  create(scene) {
    this.gameObject = scene.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);;
  }

  add(/** @type {number}*/ point) {
    this.value += point;
    this.gameObject.setText('Score: ' + this.value);
  }
}
