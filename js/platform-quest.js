// Kyle Platform Quest (original Mario-like platformer, no copyrighted assets)
const COLORS = {
  sky: 0x132029,
  bg: 0x0b0f14,
  ground: 0x2d3b24,
  platform: 0x405530,
  accent: 0x6F8F3E,
  accentLight: 0xA3C76E,
  enemy: 0x6a2e2e,
  star: 0xf5d565
};

class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){}
  create(){
    // Generate textures
    const g = this.add.graphics();
    // ground tile
    g.fillStyle(COLORS.ground,1).fillRect(0,0,32,32);
    g.lineStyle(2, COLORS.platform,1).strokeRect(0,0,32,32);
    g.generateTexture('tile',32,32); g.clear();

    // player sprite (original)
    g.fillStyle(COLORS.accent,1).fillRoundedRect(0,0,24,28,6);
    g.lineStyle(2,0xffffff,.8).strokeRoundedRect(0,0,24,28,6);
    g.generateTexture('player',24,28); g.clear();

    // enemy (original)
    g.fillStyle(COLORS.enemy,1).fillCircle(12,12,12);
    g.lineStyle(2,0x000000,.2).strokeCircle(12,12,12);
    g.generateTexture('enemy',24,24); g.clear();

    // star collectible
    g.fillStyle(COLORS.star,1);
    const s=10; g.beginPath();
    for(let i=0;i<5;i++){
      const a = i*2*Math.PI/5 - Math.PI/2;
      const x = 12 + Math.cos(a)*s;
      const y = 12 + Math.sin(a)*s;
      if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
      const a2 = a + Math.PI/5;
      g.lineTo(12 + Math.cos(a2)*s*0.5, 12 + Math.sin(a2)*s*0.5);
    }
    g.closePath(); g.fillPath();
    g.lineStyle(2,0x7a5d1a,1).strokePath();
    g.generateTexture('star',24,24); g.clear();

    // flag
    g.fillStyle(COLORS.accent,1).fillRect(0,0,6,64);
    g.fillStyle(COLORS.accentLight,1).fillTriangle(6,8, 42,20, 6,32);
    g.generateTexture('flag',42,64); g.clear();

    // cloud
    g.fillStyle(0x254056,1).fillCircle(20,14,12);
    g.fillCircle(32,18,9); g.fillCircle(12,18,9);
    g.fillCircle(25,22,8);
    g.generateTexture('cloud',48,32); g.clear();

    this.scene.start('Title');
  }
}

class Title extends Phaser.Scene {
  constructor(){ super('Title'); }
  create(){
    this.cameras.main.setBackgroundColor(COLORS.sky);
    const w=this.scale.width,h=this.scale.height;
    this.add.text(w/2,h*0.3,"Kyle Platform Quest", {fontFamily:'monospace',fontSize:48,color:'#A3C76E'}).setOrigin(0.5);
    this.add.text(w/2,h*0.42,"A playable portfolio (original, Mario-inspired)", {fontFamily:'monospace',fontSize:18,color:'#c6d7ab'}).setOrigin(0.5);

    const btn = (y, label, fn) => {
      const t = this.add.text(w/2, y, label, {fontFamily:'monospace',fontSize:28,color:'#ffffff'}).setOrigin(0.5).setInteractive({useHandCursor:true});
      t.on('pointerover',()=>t.setColor('#A3C76E'));
      t.on('pointerout',()=>t.setColor('#ffffff'));
      t.on('pointerup', fn);
    };
    btn(h*0.58, '▶ Start', ()=> this.scene.start('Level1'));
    btn(h*0.58+44, '📝 Resume', ()=> window.open('assets/docs/Kyle Colglazier Resume_Master.docx','_blank'));
    btn(h*0.58+88, '✉ Contact', ()=> window.open('mailto:kpcolgla@gmail.com','_blank'));
  }
}

class HUD extends Phaser.Scene {
  constructor(){ super('HUD'); }
  create(){
    this.score=0; this.total=6;
    this.scoreText = this.add.text(10,8,`Skills: 0/${this.total}`,{fontFamily:'monospace',fontSize:14,color:'#A3C76E'}).setScrollFactor(0).setDepth(1000);
    this.hint = this.add.text(10,26,``,{fontFamily:'monospace',fontSize:13,color:'#cfd6dd'}).setScrollFactor(0).setDepth(1000);

    // mobile pads
    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS){
      const py = this.scale.height - 84;
      const mk = (x, txt) => {
        const c = this.add.circle(x, py, 30, 0x1d2a1a).setStrokeStyle(2, COLORS.accent).setInteractive();
        this.add.text(x-6, py-8, txt, {fontFamily:'monospace',fontSize:18,color:'#A3C76E'});
        return c;
      };
      this.left = mk(70,"◀"); this.right = mk(140,"▶"); this.jump = mk(this.scale.width-70,"⤒"); this.act = mk(this.scale.width-140,"E");
      const emit=(name,down)=> this.events.emit('pad',name,down);
      [ ['left',this.left], ['right',this.right], ['jump',this.jump], ['act',this.act] ].forEach(([n,c])=>{
        c.on('pointerdown',()=>emit(n,true)); c.on('pointerup',()=>emit(n,false)); c.on('pointerout',()=>emit(n,false));
      });
    }
    this.events.on('score', (s)=>{ this.score=s; this.scoreText.setText(`Skills: ${s}/${this.total}`); });
    this.events.on('hint', (msg)=>{ this.hint.setText(msg); this.time.delayedCall(2600, ()=>{ if(this.hint.text===msg) this.hint.setText(''); }); });
  }
}

class Level1 extends Phaser.Scene {
  constructor(){ super('Level1'); }
  create(){
    // Parallax background
    this.cameras.main.setBackgroundColor(COLORS.sky);
    this.bg1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'cloud').setOrigin(0,0).setScrollFactor(0.2,0);
    this.bg1.setAlpha(0.25);

    // Tilemap
    const map = this.make.tilemap({ data: this.makeMap(), tileWidth:32, tileHeight:32 });
    const tiles = map.addTilesetImage('tile', null, 32, 32);
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.setCollisionByExclusion([-1]);

    // Player
    this.player = this.physics.add.sprite(64, 0, 'player').setCollideWorldBounds(true);
    this.player.body.setSize(18,26).setOffset(3,1);
    this.physics.add.collider(this.player, layer);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Camera + world bounds
    this.cameras.main.startFollow(this.player,true,0.1,0.1);
    this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
    this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);

    // Stars (skills)
    this.stars = this.physics.add.group();
    const positions = [{x:240,y:180},{x:520,y:140},{x:760,y:220},{x:1040,y:160},{x:1300,y:120},{x:1560,y:180}];
    positions.forEach(p=>{
      const s = this.stars.create(p.x,p.y,'star').setCircle(10).setBounce(0.2).setCollideWorldBounds(true);
    });
    this.physics.add.collider(this.stars, layer);
    this.collected = 0;
    this.physics.add.overlap(this.player, this.stars, (pl, star)=>{
      star.destroy();
      this.collected++;
      this.scene.get('HUD').events.emit('score', this.collected);
      this.scene.get('HUD').events.emit('hint','⭐ Skill acquired!');
    });

    // Enemies (patrol)
    this.enemies = this.physics.add.group({ allowGravity:true, immovable:false });
    const enemySpawns = [ {x:600,y:180, min:560, max:720}, {x:1200,y:180, min:1160, max:1320} ];
    enemySpawns.forEach(sp=>{
      const e = this.enemies.create(sp.x, sp.y, 'enemy');
      e.min = sp.min; e.max = sp.max; e.dir = Math.random() > .5 ? 1 : -1;
      e.setBounce(0.1).setCollideWorldBounds(true);
    });
    this.physics.add.collider(this.enemies, layer);
    this.physics.add.collider(this.player, this.enemies, (pl, en)=>{
      // If falling onto enemy, defeat it; otherwise "hit" (knockback)
      if (pl.body.velocity.y > 100 && pl.y < en.y) {
        en.disableBody(true,true);
        this.scene.get('HUD').events.emit('hint','Enemy cleared');
        pl.setVelocityY(-220);
      } else {
        pl.setVelocityX((pl.x < en.x) ? -220 : 220);
        pl.setVelocityY(-160);
        this.scene.get('HUD').events.emit('hint','Ouch! Avoid or jump on them.');
      }
    });

    // Goal flag
    this.flag = this.physics.add.staticImage(1840, 160, 'flag').setOrigin(0.5,1);
    this.physics.add.overlap(this.player, this.flag, ()=> this.levelComplete(), null, this);

    // HUD
    this.scene.launch('HUD');
    this.scene.get('HUD').events.emit('score', 0);
    this.scene.get('HUD').events.emit('hint', 'Collect stars and reach the flag →');

    // Mobile pad hooks
    const hud = this.scene.get('HUD');
    hud.events.on('pad', (name,down)=>{
      if(name==='left') this.padLeft = down;
      if(name==='right') this.padRight = down;
      if(name==='jump' && down) this.tryJump();
      if(name==='act' && down) this.tryInteract();
    });
  }

  makeMap(){
    // 70x14 tiles
    const cols = 70, rows = 14;
    const g = Array.from({length:rows}, ()=> Array(cols).fill(-1));
    // ground
    for(let x=0;x<cols;x++){ g[rows-1][x]=1; }
    // platforms
    const plats = [
      [6,10,3],[12,9,4],[20,8,3],[28,9,4],[36,7,5],[44,8,3],[52,9,3],[60,8,5]
    ];
    plats.forEach(([x,y,len])=>{ for(let i=0;i<len;i++) g[y][x+i]=1; });
    return g;
  }

  tryJump(){
    if(this.player.body.onFloor() || this.player.body.blocked.down) {
      this.player.setVelocityY(-300);
    }
  }
  tryInteract(){
    // placeholder for future NPCs/portals
  }

  update(time, delta){
    // parallax scroll
    this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2;

    // enemy patrol AI
    this.enemies.children.iterate(e=>{
      if(!e) return;
      if (e.x <= e.min) e.dir = 1;
      if (e.x >= e.max) e.dir = -1;
      e.setVelocityX(80 * e.dir);
    });

    // controls
    const left = this.cursors.left.isDown || this.A.isDown || this.padLeft;
    const right = this.cursors.right.isDown || this.D.isDown || this.padRight;
    const speed = 180;
    if(left) this.player.setVelocityX(-speed);
    else if(right) this.player.setVelocityX(speed);
    else this.player.setVelocityX(0);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.W))
      this.tryJump();
    if (Phaser.Input.Keyboard.JustDown(this.E)) this.tryInteract();
  }

  levelComplete(){
    // Overlay
    if(this.done) return; this.done=true;
    const w=this.scale.width, h=this.scale.height;
    const cam = this.cameras.main;
    const cx = cam.worldView.centerX, cy = cam.worldView.centerY;
    const bg = this.add.rectangle(cx,cy, 360, 240, 0x10161d, 0.96).setStrokeStyle(2, COLORS.accent).setDepth(2000);
    const txt = this.add.text(cx, cy-70, "Level Complete!", {fontFamily:'monospace',fontSize:28,color:'#A3C76E'}).setOrigin(0.5).setDepth(2001);
    const sum = this.add.text(cx, cy-30, `Skills collected: ${this.scene.get('HUD').score}/6`, {fontFamily:'monospace',fontSize:16,color:'#cfd6dd'}).setOrigin(0.5).setDepth(2001);

    const mkBtn = (y, label, fn)=>{
      const t = this.add.text(cx, y, label, {fontFamily:'monospace',fontSize:18,color:'#ffffff'}).setOrigin(0.5).setInteractive({useHandCursor:true}).setDepth(2001);
      t.on('pointerover',()=>t.setColor('#A3C76E'));
      t.on('pointerout',()=>t.setColor('#ffffff'));
      t.on('pointerup', fn);
      return t;
    };
    mkBtn(cy+10, 'Open Work / Case Studies', ()=> window.open('work.html','_blank'));
    mkBtn(cy+40, 'Open Resume', ()=> window.open('assets/docs/Kyle Colglazier Resume_Master.docx','_blank'));
    mkBtn(cy+70, 'Contact Kyle', ()=> window.open('mailto:kpcolgla@gmail.com','_blank'));

    this.physics.pause();
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#0b0f14',
  scale: { parent:'game', mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 960, height: 540 },
  physics: { default:'arcade', arcade:{ gravity:{ y: 520 }, debug:false }},
  scene: [Boot, Title, Level1, HUD]
};

window.addEventListener('load', ()=>{
  const game = new Phaser.Game(config);
});
