export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Add sprite
      this.paddle = scene.playerGroup.create(x, y, "pong").setScale(0.025).setOrigin(0.5, 0.5).setImmovable();
      this.paddle.setCollideWorldBounds(true);
      this.paddle.type = 'Left';

    }
  
  
    update() {
      
      const scene = this.scene;
      const paddle = this.paddle;
  
      // keyboard controls
      if (scene.cursors.up.isDown) {
        paddle.setVelocityY(-15);     
      }
      else if (scene.cursors.down.isDown) {     
        paddle.setVelocityY(15);
      }
      else {       
        paddle.setVelocityY(0);
          
      }
   
    }

  }