import levelScene from "./levelScene.js";

const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 18,
    height: 10,
    transparent: true,
    resolution: 2,
    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: levelScene
};

const game = new Phaser.Game(config);