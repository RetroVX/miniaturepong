import Player from "./player.js";
import AI from "./ai.js";

/**
 * level Scene
 */
export default class levelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'levelScene' });
  }

  preload() {
    this.load.image("ball", "assets/ball2.png");
    this.load.image("pong", "assets/pong.png");

    this.load.audio('left', [
        'sounds/left.wav'
    ]);
    this.load.audio('right', [
        'sounds/right.wav'
    ]);
    this.load.audio('wall', [
        'sounds/wall.wav'
    ]);
    this.load.audio('goal', [
        'sounds/goal.wav'
    ]);

  }

  create() {

    // set world bounds
    this.physics.world.setBounds(0, 0, 18, 10, true, true, true, true);

    // camera
    this.cam = this.cameras.main;
    this.cam.flash();

    // add line down the middle
    let graphics = this.add.graphics({ lineStyle: { width: 0.5, color: 0xffffff } });
    let line = new Phaser.Geom.Line(9, 0, 9, 10);
    graphics.strokeLineShape(line);

    // add sounds for ball when hitting walls or paddles
    this.leftAudio = this.sound.add('left');
    this.rightAudio = this.sound.add('right');
    this.wallAudio = this.sound.add('wall');
    this.goalAudio = this.sound.add('goal');

    // create inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // create player group for player and ai
    this.playerGroup = this.physics.add.group();
    // Add ball Group
    this.ballGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });

    // create player
    this.player = new Player(this, 2, 5);
    this.playerScore = 0;
    document.querySelector('#scoreOne').innerHTML = this.playerScore;

    //create ai
    this.ai = new AI(this, 16, 5);
    this.aiScore = 0;
    document.querySelector('#scoreTwo').innerHTML = this.aiScore;

    //particles to follow the ball
    this.particles = this.add.particles('ball');

    this.emitter = this.particles.createEmitter({
        speed: 10,
        scale: { start: 0.008, end: 0 },
        lifespan: 350,
        blendMode: 'SCREEN'
    });

    // create the ball
    this.ball = this.ballGroup.create(9, 5, "ball").setOrigin(0.5, 0.5);
    this.ball.setScale(0.02, 0.02);
    this.ball.setMaxVelocity(15);
    this.ball.setMass(1);
    this.ball.setCircle(38);
    this.ball.body.onWorldBounds = true;
    this.ball.type = 'ball';
    this.ball.setData('inMiddle', true);
    // particle emitter follow ball
    this.emitter.startFollow(this.ball);

    // Space key to start the game and to continue when a player scores
    this.input.keyboard.on('keydown_SPACE', function (event) {
      if (this.ball.getData('inMiddle')) {
    
      this.ball.setActive(true);
      // 'randomly' choose which way the ball goes
      if(Math.random() > 0.49) {
        this.ball.setVelocity(-20, Phaser.Math.Between(-1, -4));
      }
      else {
        this.ball.setVelocity(20, Phaser.Math.Between(1, 4));
      }
      this.ball.setData('inMiddle', false);

    }

    }, this);

    // if ball hits world bounds, play wall sound
    this.physics.world.on('worldbounds', function(body){
        if(body.gameObject.type === 'ball') {
            this.wallAudio.play();
        } 
    },this);

    this.physics.add.collider(this.ball, this.playerGroup, this.hitPaddle, null, this);

  }

  update(time, delta) {
    this.player.update();
    this.ai.update(this.ball);

    // if ball goes out on left side (player)
    if (this.ball.x < 1) {
        this.aiScore += 1;
        document.querySelector('#scoreTwo').innerHTML = this.aiScore;
        this.resetBall();
    }
    // ball goes out on right side (ai)
    if (this.ball.x > 17) {
        this.playerScore += 1;
        document.querySelector('#scoreOne').innerHTML = this.playerScore;
        this.resetBall();
    }
  }

  hitPaddle(ball, paddle) {

    let diff = 0;

    if(paddle.type === 'Left') {
        this.leftAudio.play();
    }
    else if(paddle.type === 'Right') {
        this.rightAudio.play();
    }

    // above
    if (ball.y < paddle.y) {
        // ball is on the left-hand side of the paddle
        diff = ball.y - paddle.y;
        ball.setVelocityY(12 * diff);

    }
    // below
    else if (ball.y > paddle.y) {
        // ball is on the right-hand side of the paddle
        diff = paddle.y + ball.y;
        ball.setVelocityY(12 * diff);

   
    }
    // middle
    else {
        // ball is perfectly in the middle
        ball.setVelocityY(2 + Math.random() * 10);

    }
}

resetBall() {
    // goal!
    this.goalAudio.play();
    this.cam.shake(100, 0.01);

    // set ball back to starting position
    this.ball.setActive(false);
    this.ball.setVelocity(0);
    this.ball.setPosition(9, 5);
    this.ball.setData('inMiddle', true);
    this.player.paddle.y = 5;
}

}