// components/SpaceShooterGame.jsx

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const SpaceShooterGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    let player, cursors, bullets, enemies, lastFired = 0, score = 0, scoreText;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {
      this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
      this.load.image('player', 'https://labs.phaser.io/assets/sprites/player.png');
      this.load.image('bullet', 'https://labs.phaser.io/assets/bullets/bullet7.png');
      this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png');
    }

    function create() {
      this.add.tileSprite(400, 300, 800, 600, 'background');

      player = this.physics.add.image(400, 500, 'player').setScale(0.5);
      player.setCollideWorldBounds(true);

      bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 20,
      });

      enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 100, y: 50, stepX: 120 },
      });

      enemies.children.iterate(enemy => {
        enemy.setVelocityY(50);
      });

      cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.addCapture('SPACE');

      scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff',
      });

      this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
    }

    function update(time) {
      if (cursors.left.isDown) {
        player.setVelocityX(-200);
      } else if (cursors.right.isDown) {
        player.setVelocityX(200);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.space.isDown && time > lastFired) {
        const bullet = bullets.get(player.x, player.y - 20);

        if (bullet) {
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.body.enable = true;
          bullet.setVelocityY(-300);
          lastFired = time + 300;
        }
      }

      bullets.children.iterate(bullet => {
        if (bullet.y < 0) {
          bullets.killAndHide(bullet);
          bullet.body.enable = false;
        }
      });
    }

    function hitEnemy(bullet, enemy) {
      bullet.disableBody(true, true);
      enemy.disableBody(true, true);
      score += 10;
      scoreText.setText('Score: ' + score);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="phaser-container" />;
};

export default SpaceShooterGame;
