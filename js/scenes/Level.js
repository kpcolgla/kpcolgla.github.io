export default class Level extends Phaser.Scene{
  constructor(){ super('Level'); }
  init(data){ this.id = data.id || 'L1'; }
  preload(){
    // Generate textures
    const g = this.add.graphics();
    // ground tile
    g.fillStyle(0x23331a,1).fillRect(0,0,32,32);
    g.lineStyle(2,0x3b4f2a,1).strokeRect(0,0,32,32); g.generateTexture('tile',32,32); g.clear();
    // player
    g.fillStyle(0x6F8F3E,1).fillRect(0,0,28,28);
    g.lineStyle(2,0xffffff,.8).strokeRect(0,0,28,28); g.generateTexture('player',28,28); g.clear();
    // star
    g.fillStyle(0xf2d96b,1); g.fillCircle(10,10,10);
    g.lineStyle(2,0x80610f,1).strokeCircle(10,10,10); g.generateTexture('star',20,20); g.clear();
    // enemy
    g.fillStyle(0x9a3f3f,1).fillRect(0,0,24,18); g.generateTexture('enemy',24,18); g.clear();
    // flag
    g.fillStyle(0x10161d, .92).fillRoundedRect(0,0,200,160,12); g.lineStyle(2,0x6F8F3E,1).strokeRoundedRect(0,0,200,160,12); g.generateTexture('panel',200,160); g.clear();
  }
  create(){
    const w=1024, h=576;
    this.cameras.main.setBackgroundColor(0x132029);
    // Build tilemap
    const mapData = this.makeMap(this.id);
    const map = this.make.tilemap({ data: mapData, tileWidth:32, tileHeight:32 });
    const tiles = map.addTilesetImage('tile', null, 32, 32);
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.setCollisionByExclusion([-1]);
    // Player
    this.player = this.physics.add.sprite(64, 64, 'player').setCollideWorldBounds(true);
    this.player.body.setSize(24,26).setOffset(2,2);
    this.physics.add.collider(this.player, layer);
    // Camera & bounds
    this.cameras.main.startFollow(this.player,true,.1,.1);
    this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
    this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);

    // Stars (collectibles)
    this.stars = this.physics.add.group();
    this.starTotal = 6;
    const positions = this.samplePositions(mapData, this.starTotal);
    positions.forEach(p=>{
      const s = this.stars.create(p.x, p.y, 'star').setCircle(10).setBounce(0.2).setCollideWorldBounds(true);
    });
    this.physics.add.collider(this.stars, layer);
    this.collected=0;
    this.physics.add.overlap(this.player, this.stars, (pl, s)=>{ s.destroy(); this.collected++; this.events.emit('score', this.collected, this.starTotal); });

    // Enemies (simple patrol)
    this.enemies = this.physics.add.group();
    this.spawnEnemies(mapData, 5);
    this.physics.add.collider(this.enemies, layer);
    this.physics.add.overlap(this.player, this.enemies, ()=>{
      // soft penalty: knockback
      const dir = Math.sign(this.player.body.velocity.x || 1);
      this.player.setVelocity(-dir*180, -280);
      this.events.emit('hint','Ouch! Avoid patrols.');
    });

    // Finish area
    this.finishX = map.widthInPixels - 96;
    this.finish = this.add.rectangle(this.finishX, 64, 24, 120, 0x8FB957,.8);
    this.physics.add.existing(this.finish, true);
    this.physics.add.overlap(this.player, this.finish, ()=> this.levelComplete(), null, this);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    // Launch UI
    this.scene.launch('UI');
    this.scene.get('UI').events.emit('score', this.collected, this.starTotal);
    this.scene.get('UI').events.emit('hint', 'Collect Skill Stars and reach the green goal.');
    this.scene.get('UI').events.on('pad', (dir,down)=>{
      if(dir==='left') this.padLeft=down;
      if(dir==='right') this.padRight=down;
      if(dir==='jump'&&down) this.tryJump();
      if(dir==='pause'&&down) this.togglePause();
      if(dir==='interact'&&down) this.tryInteract();
    });

    // Assist mode
    this.assist = this.registry.get('assistMode');
    this.jumps = 0;

    // Pause
    this.input.keyboard.on('keydown-P', ()=> this.togglePause());
  }

  tryJump(){
    const onGround = this.player.body.onFloor() || this.player.body.touching.down;
    if(onGround){ this.jumps=0; }
    if(onGround || (this.assist && this.jumps<1)){
      this.player.setVelocityY(-400);
      this.jumps++;
    }
  }
  tryInteract(){ /* reserved for NPCs later */ }

  togglePause(){
    if(this.scene.isPaused('Level')){
      this.scene.resume(); this.events.emit('hint','Resumed.');
      this.scene.get('UI').events.emit('paused', false);
    } else {
      this.scene.pause(); this.scene.get('UI').events.emit('paused', true);
    }
  }

  update(){
    const speed=220;
    const left = this.cursors.left.isDown || this.keyA.isDown || this.padLeft;
    const right = this.cursors.right.isDown || this.keyD.isDown || this.padRight;
    if(left){ this.player.setVelocityX(-speed); }
    else if(right){ this.player.setVelocityX(speed); }
    else { this.player.setVelocityX(0); }
    const jumpKey = this.cursors.up.isDown || this.keyW.isDown || this.input.keyboard.checkDown(this.cursors.space, 1);
    if(jumpKey) this.tryJump();
  }

  levelComplete(){
    // Save progress
    const slot = this.registry.get('slot') || {L1:false,L2:false,L3:false};
    slot[this.id] = true;
    localStorage.setItem('kpo-slot', JSON.stringify(slot));
    // Panel
    const {x,y} = this.player;
    const panel = this.add.image(x, y-60, 'panel').setOrigin(0.5).setDepth(999);
    const t1 = this.add.text(x, y-100, "Level Complete!", {fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setOrigin(0.5).setDepth(1000);
    const t2 = this.add.text(x, y-65, `Skill Stars: ${this.collected}/${this.starTotal}`, {fontFamily:'monospace', fontSize:14, color:'#cfd6dd'}).setOrigin(0.5).setDepth(1000);
    const b1 = this.add.text(x, y-25, "View Work", {fontFamily:'monospace', fontSize:16, color:'#ffffff'}).setOrigin(0.5).setInteractive().setDepth(1000);
    const b2 = this.add.text(x, y+5, "Resume", {fontFamily:'monospace', fontSize:16, color:'#ffffff'}).setOrigin(0.5).setInteractive().setDepth(1000);
    const b3 = this.add.text(x, y+35, "Contact", {fontFamily:'monospace', fontSize:16, color:'#ffffff'}).setOrigin(0.5).setInteractive().setDepth(1000);
    [b1,b2,b3].forEach(b=>{
      b.on('pointerover',()=> b.setColor('#A3C76E'));
      b.on('pointerout',()=> b.setColor('#ffffff'));
    });
    b1.on('pointerup', ()=> window.location.href='work.html');
    b2.on('pointerup', ()=> window.open('assets/docs/Kyle Colglazier Resume_Master.docx','_blank'));
    b3.on('pointerup', ()=> window.open('mailto:kpcolgla@gmail.com','_blank'));
  }

  makeMap(id){
    // Generate a varied, intuitive layout per level id
    const cols = 80, rows = 18;
    const grid = Array.from({length:rows},()=>Array(cols).fill(-1));
    // ground
    for(let x=0;x<cols;x++){ grid[rows-1][x]=1; }
    // gentle ramps and platforms
    const bands = id==='L1' ? [14,12,10] : id==='L2' ? [13,11,9] : [12,10,8];
    bands.forEach((row, i)=>{
      for(let x=6+i*16; x<cols-10; x+=8){
        grid[row][x]=1; grid[row][x+1]=1; grid[row][x+2]=1;
      }
    });
    return grid;
  }

  samplePositions(grid, n){
    const out=[]; const rows=grid.length, cols=grid[0].length;
    while(out.length<n){
      const x = Phaser.Math.Between(6, cols-6)*32;
      const yRow = Phaser.Math.Between(6, rows-4);
      if(grid[yRow][(x/32)|0]===-1 && grid[yRow+1][(x/32)|0]===-1){ out.push({x,y:yRow*32}); }
    }
    return out;
  }

  spawnEnemies(grid, n){
    const rows=grid.length, cols=grid[0].length;
    for(let i=0;i<n;i++){
      const x = Phaser.Math.Between(8, cols-8)*32, y = (rows-2)*32;
      const e = this.enemies.create(x,y,'enemy').setCollideWorldBounds(true);
      e.setBounce(0); e.body.setSize(22,16).setOffset(1,1);
      e.setVelocityX( Phaser.Math.Between(-80,80) || 60 );
    }
    this.time.addEvent({
      delay: 800,
      loop: true,
      callback: ()=>{
        this.enemies.children.iterate((e)=>{
          if(!e) return;
          if(e.body.blocked.left) e.setVelocityX(80);
          else if(e.body.blocked.right) e.setVelocityX(-80);
        });
      }
    });
  }
}
