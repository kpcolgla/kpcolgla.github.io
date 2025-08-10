import Title from './scenes/Title.js';
import Hub from './scenes/Hub.js';
import Level from './scenes/Level.js';
import UIScene from './scenes/UI.js';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#0b0f14',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1024, height: 576, parent: 'game' },
  physics: { default: 'arcade', arcade: { gravity:{ y: 900 }, debug:false } },
  scene: [Title, Hub, Level, UIScene],
};

window.addEventListener('load', () => new Phaser.Game(config));
