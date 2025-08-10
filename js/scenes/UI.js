export default class UIScene extends Phaser.Scene{
  constructor(){ super('UI'); }
  create(){
    this.hint = this.add.text(12,12,'',{fontFamily:'monospace', fontSize:14, color:'#cfd6dd'}).setScrollFactor(0).setDepth(2000);
    this.score = this.add.text(12,32,'Stars: 0/0',{fontFamily:'monospace', fontSize:14, color:'#A3C76E'}).setScrollFactor(0).setDepth(2000);
    this.paused = this.add.text(this.scale.width/2, 20, '', {fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setOrigin(0.5).setScrollFactor(0).setDepth(2000);

    // Mobile controls
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    if(isMobile){
      const y = this.scale.height - 70;
      const left = this.add.circle(70,y,28,0x1d2a1a).setStrokeStyle(2,0x6F8F3E).setInteractive();
      const right= this.add.circle(140,y,28,0x1d2a1a).setStrokeStyle(2,0x6F8F3E).setInteractive();
      const jump = this.add.circle(this.scale.width-70,y,32,0x1d2a1a).setStrokeStyle(2,0x6F8F3E).setInteractive();
      const pause= this.add.circle(this.scale.width-140,y,24,0x1d2a1a).setStrokeStyle(2,0x6F8F3E).setInteractive();
      [left,right,jump,pause].forEach(b=> b.setScrollFactor(0).setDepth(2000));
      this.add.text(left.x-6,left.y-8,'◀',{fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setDepth(2000).setScrollFactor(0);
      this.add.text(right.x-6,right.y-8,'▶',{fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setDepth(2000).setScrollFactor(0);
      this.add.text(jump.x-6,jump.y-8,'⤒',{fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setDepth(2000).setScrollFactor(0);
      this.add.text(pause.x-5,pause.y-8,'⏸',{fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setDepth(2000).setScrollFactor(0);

      left.on('pointerdown', ()=> this.events.emit('pad','left',true));
      left.on('pointerup',   ()=> this.events.emit('pad','left',false));
      left.on('pointerout',  ()=> this.events.emit('pad','left',false));

      right.on('pointerdown', ()=> this.events.emit('pad','right',true));
      right.on('pointerup',   ()=> this.events.emit('pad','right',false));
      right.on('pointerout',  ()=> this.events.emit('pad','right',false));

      jump.on('pointerdown', ()=> this.events.emit('pad','jump',true));
      pause.on('pointerdown', ()=> this.events.emit('pad','pause',true));
    }

    // Hooks
    this.scene.get('Level')?.events.on('hint', (msg)=>{
      this.hint.setText(msg);
      this.time.delayedCall(2400, ()=>{ if(this.hint.text===msg) this.hint.setText(''); });
    });
    this.scene.get('Level')?.events.on('score', (v,total)=>{
      this.score.setText(`Stars: ${v}/${total}`);
    });
    this.events.on('paused', (flag)=>{
      this.paused.setText(flag ? 'Paused — press P to resume' : '');
    });
  }
}
