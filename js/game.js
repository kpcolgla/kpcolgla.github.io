// Kyle's Career Quest - Starter
// Phaser 3 platformer with collectibles, NPC dialog, links, and mobile controls.
// Color palette: sage/olive accent.

const ACCENT = 0x6F8F3E;
const ACCENT_LIGHT = 0xA3C76E;
const BG_DARK = 0x0b0f14;
const SKY = 0x132029;

class TitleScene extends Phaser.Scene {
  constructor(){ super('Title'); }
  preload(){}
  create(){
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(BG_DARK);
    const title = this.add.text(w/2, h*0.3, "Kyle's Career Quest", {
      fontFamily: 'monospace', fontSize: 48, color: '#A3C76E'
    }).setOrigin(0.5);
    const sub = this.add.text(w/2, h*0.42, "A playable portfolio", {
      fontFamily: 'monospace', fontSize: 20, color: '#c6d7ab'
    }).setOrigin(0.5);

    // Menu options
    const opts = [
      ['▶ Start', () => this.scene.start('Game')],
      ['ℹ About', () => this.showAbout()],
      ['📝 Resume', () => window.open('assets/docs/Kyle Colglazier Resume_Master.docx', '_blank')],
      ['✉ Contact', () => window.open('mailto:kpcolgla@gmail.com','_blank')],
    ];
    let y = h*0.55;
    opts.forEach(([label, fn], i) => {
      const t = this.add.text(w/2, y + i*44, label, {
        fontFamily: 'monospace', fontSize: 28, color:'#ffffff'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerover', () => t.setColor('#A3C76E'));
      t.on('pointerout', () => t.setColor('#ffffff'));
      t.on('pointerup', fn);
    });

    this.add.text(w/2, h*0.9, "Use arrows/WASD to move, Space to jump, E to interact", {
      fontFamily: 'monospace', fontSize: 14, color:'#9aa4b2'
    }).setOrigin(0.5);
  }
  showAbout(){
    const w = this.scale.width, h = this.scale.height;
    const bg = this.add.rectangle(w/2, h/2, Math.min(520,w-40), Math.min(300,h-40), 0x10161d, 0.96).setStrokeStyle(2, ACCENT);
    const text = this.add.text(bg.x, bg.y, [
      "I'm Kyle Colglazier — Senior LXD & Sales Enablement pro.",
      "I build onboarding, AI role-play sims, and blended programs",
      "that actually move business metrics.",
      "",
      "Press Start to play through my career."
    ], { fontFamily:'monospace', fontSize:16, color:'#e5e7eb', align:'center' }).setOrigin(0.5);
    this.input.once('pointerup', ()=>{ bg.destroy(); text.destroy(); });
    this.input.keyboard.once('keydown', ()=>{ bg.destroy(); text.destroy(); });
  }
}

class UIScene extends Phaser.Scene {
  constructor(){ super('UI'); }
  create(){
    this.hints = this.add.text(10,10,"", { fontFamily:'monospace', fontSize:14, color:'#cfd6dd'})
      .setScrollFactor(0).setDepth(1000);
    this.scoreText = this.add.text(10,30,"Skills: 0/5",{ fontFamily:'monospace', fontSize:14, color:'#A3C76E'})
      .setScrollFactor(0).setDepth(1000);

    // Mobile controls
    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
      const padY = this.scale.height - 80;
      this.left = this.add.circle(70, padY, 28, 0x1d2a1a).setStrokeStyle(2, ACCENT).setInteractive();
      this.right = this.add.circle(140, padY, 28, 0x1d2a1a).setStrokeStyle(2, ACCENT).setInteractive();
      this.jump = this.add.circle(this.scale.width-70, padY, 32, 0x1d2a1a).setStrokeStyle(2, ACCENT).setInteractive();
      this.interact = this.add.circle(this.scale.width-140, padY, 28, 0x1d2a1a).setStrokeStyle(2, ACCENT).setInteractive();
      this.add.text(this.left.x-6, this.left.y-8, "◀",{fontFamily:'monospace', fontSize:18, color:'#A3C76E'});
      this.add.text(this.right.x-6, this.right.y-8, "▶",{fontFamily:'monospace', fontSize:18, color:'#A3C76E'});
      this.add.text(this.jump.x-6, this.jump.y-8, "⤒",{fontFamily:'monospace', fontSize:18, color:'#A3C76E'});
      this.add.text(this.interact.x-6, this.interact.y-8, "E",{fontFamily:'monospace', fontSize:18, color:'#A3C76E'});

      this.left.on('pointerdown', ()=> this.events.emit('pad','left', true));
      this.left.on('pointerup',   ()=> this.events.emit('pad','left', false));
      this.left.on('pointerout',  ()=> this.events.emit('pad','left', false));

      this.right.on('pointerdown', ()=> this.events.emit('pad','right', true));
      this.right.on('pointerup',   ()=> this.events.emit('pad','right', false));
      this.right.on('pointerout',  ()=> this.events.emit('pad','right', false));

      this.jump.on('pointerdown', ()=> this.events.emit('pad','jump', true));
      this.interact.on('pointerdown', ()=> this.events.emit('pad','interact', true));
    }

    this.events.on('hint', (msg)=>{
      this.hints.setText(msg);
      this.time.delayedCall(2600, ()=>{
        if(this.hints.text === msg) this.hints.setText('');
      });
    });
    this.events.on('score', (v,total)=>{
      this.scoreText.setText(`Skills: ${v}/${total}`);
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor(){ super('Game'); this.totalSkills = 5; }
  preload(){
    // Generate simple textures (no external PNGs)
    const g = this.add.graphics();
    // Ground tile
    g.fillStyle(0x2d3b24,1).fillRect(0,0,32,32);
    g.lineStyle(2,0x405530,1).strokeRect(0,0,32,32);
    g.generateTexture('tile',32,32); g.clear();

    // Player
    g.fillStyle(ACCENT,1).fillRect(0,0,28,28);
    g.lineStyle(2,0xffffff,0.8).strokeRect(0,0,28,28);
    g.generateTexture('player',28,28); g.clear();

    // Skill coin
    g.fillStyle(0xf5d565,1).fillCircle(10,10,10);
    g.lineStyle(2,0x7a5d1a,1).strokeCircle(10,10,10);
    g.generateTexture('skill',20,20); g.clear();

    // NPC bubble
    g.fillStyle(0x10161d,0.95).fillRoundedRect(0,0,240,100,10);
    g.lineStyle(2,ACCENT,1).strokeRoundedRect(0,0,240,100,10);
    g.generateTexture('bubble',240,100); g.clear();
  }
  create(){
    this.cameras.main.setBackgroundColor(SKY);
    // Build a simple tilemap from array (platforms)
    const map = this.make.tilemap({ data: this.makeLevel(), tileWidth:32, tileHeight:32 });
    const tiles = map.addTilesetImage('tile', null, 32, 32);
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.setCollisionByExclusion([-1]);

    // Player
    this.player = this.physics.add.sprite(64, 32, 'player').setBounce(0.05).setCollideWorldBounds(true);
    this.player.body.setSize(24,26).setOffset(2,2);
    this.physics.add.collider(this.player, layer);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0,0,map.widthInPixels, map.heightInPixels);

    // Skills (collectibles)
    this.skills = this.physics.add.group();
    const skillPositions = [{x:200,y:200},{x:420,y:140},{x:700,y:250},{x:980,y:180},{x:1250,y:100}];
    skillPositions.forEach(p=>{
      const c = this.skills.create(p.x, p.y, 'skill').setCircle(10).setBounce(0.2).setCollideWorldBounds(true);
    });
    this.physics.add.collider(this.skills, layer);
    this.collected = 0;
    this.physics.add.overlap(this.player, this.skills, (pl, coin)=>{
      coin.destroy();
      this.collected += 1;
      this.scene.get('UI').events.emit('score', this.collected, this.totalSkills);
      this.scene.get('UI').events.emit('hint', '🟡 Skill collected!');
    });

    // NPCs
    this.npcs = this.physics.add.staticGroup();
    const npcMeta = this.npcs.create(480, 260, null).setSize(28,28).setVisible(false); npcMeta.role = 'Meta'; npcMeta.action = ()=> this.openLink('https://www.facebook.com/business/learn/certification');
    const npcSidley = this.npcs.create(820, 260, null).setSize(28,28).setVisible(false); npcSidley.role = 'Sidley Austin'; npcSidley.action = ()=> this.showDialog("Leadership & staff L&D\nStoryline + Camtasia e-learning");
    const npcPayPal = this.npcs.create(1160, 260, null).setSize(28,28).setVisible(false); npcPayPal.role = 'PayPal'; npcPayPal.action = ()=> this.showDialog("Global Sales Enablement\nAI role-play simulations");
    this.physics.add.overlap(this.player, this.npcs, (pl, npc)=>{
      this.currentNPC = npc;
      this.scene.get('UI').events.emit('hint', `Press E to talk to ${npc.role}`);
    });

    // Help hint
    this.scene.launch('UI');
    this.scene.get('UI').events.emit('score', this.collected, this.totalSkills);
    this.scene.get('UI').events.emit('hint', 'Reach NPCs & collect skills. Press H for help.');

    // Mobile pad integration
    const ui = this.scene.get('UI');
    ui.events.on('pad', (dir, down)=>{
      if(dir==='left') this.padLeft = down;
      if(dir==='right') this.padRight = down;
      if(dir==='jump' && down) this.tryJump();
      if(dir==='interact' && down) this.tryInteract();
    });
  }

  makeLevel(){
    // Simple platform pattern (40x12 tiles)
    const cols = 42, rows = 12;
    const grid = Array.from({length: rows}, ()=> Array(cols).fill(-1));
    // Ground line
    for (let x=0; x<cols; x++) grid[rows-1][x] = 1;
    // A few platforms
    [[6,8],[12,9],[14,9],[18,7],[22,6],[26,8],[30,7],[34,6],[38,7]].forEach(([x,y])=>{
      grid[y][x]=1; grid[y][x+1]=1; grid[y][x+2]=1;
    });
    return grid;
  }

  openLink(url){
    window.open(url, '_blank', 'noopener');
    this.scene.get('UI').events.emit('hint', 'Opening link…');
  }

  showDialog(text){
    if (this.dialog) { this.dialog.destroy(); }
    const {x,y} = this.player;
    this.dialog = this.add.image(x, y-70, 'bubble').setOrigin(0.5).setDepth(999);
    const t = this.add.text(x, y-70, text, { fontFamily:'monospace', fontSize:14, color:'#e5e7eb', align:'center'})
      .setOrigin(0.5).setDepth(1000);
    this.time.delayedCall(2400, ()=>{ this.dialog?.destroy(); t.destroy(); });
  }

  tryJump(){
    if(this.player.body.onFloor() || this.player.body.touching.down) {
      this.player.setVelocityY(-280);
    }
  }
  tryInteract(){
    if(this.currentNPC && this.currentNPC.action) this.currentNPC.action();
  }

  update(){
    const speed = 160;
    let left = this.cursors.left.isDown || this.keyA.isDown || this.padLeft;
    let right = this.cursors.right.isDown || this.keyD.isDown || this.padRight;
    if (left) {
      this.player.setVelocityX(-speed);
    } else if (right) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }
    const jumpKey = this.cursors.up.isDown || this.keyW.isDown || this.input.keyboard.checkDown(this.cursors.space, 1);
    if (jumpKey) this.tryJump();
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.tryInteract();
    if (Phaser.Input.Keyboard.JustDown(this.keyH)) {
      this.scene.get('UI').events.emit('hint', 'Arrows/WASD move, Space jump, E interact');
    }
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#0b0f14',
  scale: { parent: 'game', mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 960, height: 540 },
  physics: { default: 'arcade', arcade: { gravity: { y: 500 }, debug: false } },
  scene: [TitleScene, GameScene, UIScene]
};

window.addEventListener('load', ()=>{
  new Phaser.Game(config);
});
