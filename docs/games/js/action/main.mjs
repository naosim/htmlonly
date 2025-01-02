// @ts-ignore
const Phaser = window.Phaser;

class Score {
  value = 0;
  sprite;
  create(scene) {
    this.sprite = scene.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  }

  add(/** @type {number}*/ point) {
    this.value += point;
    this.sprite.setText('Score: ' + this.value);
  }
}

class Player {
  sprite;
  cursors;
  preload(scene) {
    scene.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create(scene) {
    // The player and its settings
    const player = this.sprite = scene.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-160);
      this.sprite.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(160);
      this.sprite.anims.play('right', true);
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-330);
    }
  }
}

class ActionGame {
  gameOver = false;
  game;
  player;
  playerSprite = new Player();
  stars;
  bombs;
  platforms;
  scoreSprite = new Score();
  constructor({game}) {
    this.game = game;
  }

  preload (scene) {
    this.scene = scene;
    this.scene.load.image('sky', 'assets/sky.png');
    this.scene.load.image('ground', 'assets/platform.png');
    this.scene.load.image('star', 'assets/star.png');
    this.scene.load.image('bomb', 'assets/bomb.png');
    this.playerSprite.preload(scene);
  }

  create (scene) {
    //  A simple background for our game
    this.scene.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    const platforms = this.platforms = this.scene.physics.add.staticGroup();


    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.playerSprite.create(scene);

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    const stars = this.stars = this.scene.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.scene.physics.add.group();

    //  The score
    this.scoreSprite.create(this.scene);

    //  Collide the player and the stars with the platforms
    this.scene.physics.add.collider(this.playerSprite.sprite, platforms);
    this.scene.physics.add.collider(this.stars, platforms);
    this.scene.physics.add.collider(this.bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.scene.physics.add.overlap(this.playerSprite.sprite, this.stars, (a,b) => this.collectStar(a,b), null, this.scene);
    this.scene.physics.add.collider(this.playerSprite.sprite, this.bombs, (a,b) => this.hitBomb(a,b), null, this.scene);
  }

  update () {
    if (this.gameOver) {
      return;
    }
    this.playerSprite.update();
  }

  collectStar (player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    this.scoreSprite.add(10);

    if (this.stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
  }


  hitBomb (player, bomb) {
    this.scene.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');

    this.gameOver = true;
  }
}

// var player;
// var stars;
// var bombs;
// var platforms;
// var cursors;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: function() { actionGame.preload(this) },
      create: function() { actionGame.create(this) },
      update: function() { actionGame.update() }
  }
};


var game = new Phaser.Game(config);
var actionGame = new ActionGame({game});
var phaser = game;