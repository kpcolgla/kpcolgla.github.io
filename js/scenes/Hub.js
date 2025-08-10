export default class Hub extends Phaser.Scene{
  constructor(){ super('Hub'); }
  create(){
    const w=this.scale.width,h=this.scale.height;
    this.cameras.main.setBackgroundColor(0x0b0f14);
    // Parallax background
    this.bg1 = this.add.rectangle(0,0,w,h,0x0f1720).setOrigin(0);
    this.bg2 = this.add.rectangle(0,0,w,h,0x111c26).setOrigin(0).setAlpha(.6);
    this.add.text(w/2, 60, "Career Hub", {fontFamily:'monospace', fontSize:32, color:'#A3C76E'}).setOrigin(0.5);
    this.add.text(w/2, 96, "Choose a portal to explore a chapter", {fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setOrigin(0.5);

    const portals = [
      {label:'Higher Ed Hills', key:'L1', color:0x2b3a22, desc:'Roots in communication & facilitation', x:w*0.25},
      {label:'Corporate City', key:'L2', color:0x243144, desc:'Enterprise ID & certification', x:w*0.5},
      {label:'FinTech Fortress', key:'L3', color:0x30263d, desc:'Global enablement & AI sims', x:w*0.75},
    ];
    portals.forEach((p,i)=>{
      const r = this.add.rectangle(p.x, h*0.55, 200, 140, p.color, .9).setStrokeStyle(2, 0x6F8F3E).setInteractive({useHandCursor:true});
      this.add.text(p.x, h*0.55-40, p.label, {fontFamily:'monospace', fontSize:18, color:'#e5e7eb'}).setOrigin(0.5);
      this.add.text(p.x, h*0.55+24, p.desc, {fontFamily:'monospace', fontSize:14, color:'#9aa4b2', align:'center'}).setOrigin(0.5).setWordWrapWidth(160);
      r.on('pointerover', ()=> r.setScale(1.05));
      r.on('pointerout', ()=> r.setScale(1));
      r.on('pointerup', ()=> this.scene.start('Level',{ id: p.key }));
    });

    // Footer menu
    const footer = this.add.text(w/2, h-40, "Resume • Work • Contact", {fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setOrigin(0.5);
    footer.setInteractive();
    footer.on('pointerup', (p)=>{
      // Simple area mapping (left/center/right click)
      const rel = this.input.activePointer.x / w;
      if(rel < 0.33) window.open('assets/docs/Kyle Colglazier Resume_Master.docx','_blank');
      else if(rel < 0.66) window.location.href='work.html';
      else window.open('mailto:kpcolgla@gmail.com','_blank');
    });

    // Auto-save slot
    this.registry.set('slot', JSON.parse(localStorage.getItem('kpo-slot')||'{"L1":false,"L2":false,"L3":false}'));
  }
}
