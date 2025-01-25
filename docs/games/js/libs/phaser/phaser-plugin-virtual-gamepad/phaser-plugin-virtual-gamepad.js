// aiがv3対応したコード
// https://github.com/ShawnHymel/phaser-plugin-virtual-gamepad/blob/master/js/phaser-plugin-virtual-gamepad.js

class VirtualKey {
  get isDown() {
    return this.vgamepad.joystick.properties[this.key].isDown;
  };
  constructor(vgamepad, key) {
    this.vgamepad = vgamepad;
    this.key = key;
  }
}
class VirtualGamepad {
  up = new VirtualKey(this, "up");
  down = new VirtualKey(this, "down");
  right = new VirtualKey(this, "right");
  left = new VirtualKey(this, "left");
  button = {isDown: false};

  constructor() {
    // Class members
    this.joystick = null;
    this.joystickPad = null;
    this.joystickPoint = null;
    this.joystickRadius = null;
    this.joystickPointer = null;
    this.buttonSprite = null;
    this.buttonPoint = null;
    this.buttonRadius = null;

    // Define static bounds for directions
    this.UP_LOWER_BOUND = -7 * (Math.PI / 8);
    this.UP_UPPER_BOUND = -1 * (Math.PI / 8);
    this.DOWN_LOWER_BOUND = Math.PI / 8;
    this.DOWN_UPPER_BOUND = 7 * (Math.PI / 8);
    this.RIGHT_LOWER_BOUND = -3 * (Math.PI / 8);
    this.RIGHT_UPPER_BOUND = 3 * (Math.PI / 8);
    this.LEFT_LOWER_BOUND = 5 * (Math.PI / 8);
    this.LEFT_UPPER_BOUND = -5 * (Math.PI / 8);
  }

  create(scene) {
    this.scene = scene;
    // Bind preUpdate for polling joystick and button
    this.scene.events.on('preupdate', this.preUpdate, this);
  }

  /**
   * Add a joystick to the scene
   * @param {number} x 
   * @param {number} y 
   * @param {number} scale 
   * @param {string} key - like "gamepad"
   * @returns 
   */
  addJoystick(x, y, scale, key) {
    if (this.joystick) {
      console.warn('Only one joystick allowed per scene');
      return null;
    }

    this.joystick = this.scene.add.sprite(x, y, key).setFrame(2);
    this.joystick.setScrollFactor(0);
    this.joystick.setScale(scale);
    this.joystickPad = this.scene.add.sprite(x, y, key).setFrame(3);
    this.joystickPad.setScrollFactor(0);
    this.joystickPad.setScale(scale);

    this.joystickPoint = new Phaser.Math.Vector2(x, y);

    this.joystick.properties = {
      inUse: false,
      up: {isDown: false},
      down: {isDown: false},
      left: {isDown: false},
      right: {isDown: false},
      x: 0,
      y: 0,
      distance: 0,
      angle: 0,
      rotation: 0,
    };

    this.joystickRadius = scale * (this.joystick.width / 2);

    return this.joystick;
  }

  /**
   * Add a button to the scene
   * @param {number} x 
   * @param {number} y 
   * @param {number} scale 
   * @param {string} key - like "gamepad"
   * @returns 
   */
  addButton(x, y, scale, key) {
    if (this.buttonSprite) {
      console.warn('Only one button allowed per scene');
      return null;
    }

    this.buttonSprite = this.scene.add.image(x, y, key);
    // this.button.setAnchor(0.5);
    this.buttonSprite.setScrollFactor(0);
    this.buttonSprite.setScale(scale);

    this.buttonPoint = new Phaser.Math.Vector2(x, y);

    this.buttonSprite.isDown = false;
    this.button.isDown = false;

    this.buttonRadius = scale * (this.buttonSprite.width / 2);

    return this.buttonSprite;
  }

  // Pre-update polling function for joystick and button states
  preUpdate() {
    let resetJoystick = true;

    // Check for pointer interaction with joystick or button
    this.buttonSprite.isDown = false;
    this.button.isDown = false;
    this.buttonSprite.setFrame(0);
    this.scene.input.manager.pointers.forEach((pointer) => {
      resetJoystick = this.testDistance(pointer);
    });

    resetJoystick = this.testDistance(this.scene.input.activePointer);

    // Reset joystick if pointer is removed
    if (resetJoystick) {
      if (!this.joystickPointer || !this.joystickPointer.isDown) {
        this.moveJoystick(this.joystickPoint);
        this.joystick.properties.inUse = false;
        this.joystickPointer = null;
      }
    }
  }

  // Test pointer distance for interaction with joystick or button
  testDistance(pointer) {
    let reset = true;

    // See if the pointer is over the joystick
    const d = Phaser.Math.Distance.Between(this.joystickPoint.x, this.joystickPoint.y, pointer.x, pointer.y);
    if (pointer.isDown && ((pointer === this.joystickPointer) || d < this.joystickRadius)) {
        reset = false;
        this.joystick.properties.inUse = true;
        this.joystickPointer = pointer;
        this.moveJoystick(pointer);
    }

    // See if the pointer is over the button
    const buttonDistance = Phaser.Math.Distance.Between(this.buttonPoint.x, this.buttonPoint.y, pointer.x, pointer.y);
    if (pointer.isDown && buttonDistance < this.buttonRadius) {
        this.buttonSprite.isDown = true;
        this.button.isDown = true;
        this.buttonSprite.setFrame(1);
    }

    return reset;
  }

  // Move the joystick based on pointer position
  moveJoystick(pointer) {
      // Calculate x/y of pointer from joystick center
      var deltaX = pointer.x - this.joystickPoint.x;
      var deltaY = pointer.y - this.joystickPoint.y;

      // Get the angle (radians) of the pointer on the joystick
      const rotation = Phaser.Math.Angle.Between(this.joystickPoint.x, this.joystickPoint.y, pointer.x, pointer.y);

      // Set bounds on joystick pad
      if (Phaser.Math.Distance.Between(this.joystickPoint.x, this.joystickPoint.y, pointer.x, pointer.y) > this.joystickRadius) {
          deltaX = (deltaX === 0) ? 0 : Math.cos(rotation) * this.joystickRadius;
          deltaY = (deltaY === 0) ? 0 : Math.sin(rotation) * this.joystickRadius;
      }

      // Normalize x/y
      this.joystick.properties.x = Phaser.Math.RoundTo(deltaX / this.joystickRadius * 100);
      this.joystick.properties.y = Phaser.Math.RoundTo(deltaY / this.joystickRadius * 100);

      // Set polar coordinates
      this.joystick.properties.rotation = rotation;
      this.joystick.properties.angle = Phaser.Math.RadToDeg(rotation);
      this.joystick.properties.distance = Phaser.Math.RoundTo(Phaser.Math.Distance.Between(this.joystickPoint.x, this.joystickPoint.y, pointer.x, pointer.y) / this.joystickRadius * 100);

      // Set d-pad directions
      this.joystick.properties.up.isDown = (rotation > this.UP_LOWER_BOUND && rotation <= this.UP_UPPER_BOUND);
      this.joystick.properties.down.isDown = (rotation > this.DOWN_LOWER_BOUND && rotation <= this.DOWN_UPPER_BOUND);
      this.joystick.properties.right.isDown = (rotation > this.RIGHT_LOWER_BOUND && rotation <= this.RIGHT_UPPER_BOUND);
      this.joystick.properties.left.isDown = (rotation > this.LEFT_LOWER_BOUND || rotation <= this.LEFT_UPPER_BOUND);

      // Fix situation where left/right is true if X/Y is centered
      if (this.joystick.properties.x === 0 && this.joystick.properties.y === 0) {
          this.joystick.properties.right.isDown = false;
          this.joystick.properties.left.isDown = false;
      }

      // Move joystick pad images
      this.joystickPad.x = this.joystickPoint.x + deltaX;
      this.joystickPad.y = this.joystickPoint.y + deltaY;
  }
}