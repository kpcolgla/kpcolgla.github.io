export default class Title extends Phaser.Scene {
  constructor(){ super('Title'); }
  create(){
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x0b0f14);
    const title = this.add.text(w/2, h*0.28, "PORTFOLIO ODYSSEY", { fontFamily:'monospace', fontSize: 48, color:'#A3C76E' }).setOrigin(0.5);
    const sub = this.add.text(w/2, h*0.40, "A playable portfolio by Kyle Colglazier", { fontFamily:'monospace', fontSize: 18, color:'#cfd6dd' }).setOrigin(0.5);

    const menu = [
      ["▶ Start", ()=> this.scene.start('Hub')],
      ["⚙ Settings", ()=> this.openSettings()],
      ["📝 Resume", ()=> window.open('assets/docs/Kyle Colglazier Resume_Master.docx','_blank')],
      ["✉ Contact", ()=> window.open('mailto:kpcolgla@gmail.com','_blank')],
    ];
    let y = h*0.55;
    menu.forEach(([label, fn], i)=>{
      const t = this.add.text(w/2, y + i*46, label, { fontFamily:'monospace', fontSize:28, color:'#ffffff' }).setOrigin(0.5).setInteractive({useHandCursor:true});
      t.on('pointerover', ()=> t.setColor('#A3C76E'));
      t.on('pointerout', ()=> t.setColor('#ffffff'));
      t.on('pointerup', fn);
    });

    this.add.text(w/2, h*0.88, "Move: Arrows/WASD • Jump: Space/Up • Interact: E • Pause: P", { fontFamily:'monospace', fontSize:14, color:'#9aa4b2'}).setOrigin(0.5);

    // Restore settings (reduced motion, assist mode) from localStorage
    const saved = JSON.parse(localStorage.getItem('kpo-settings') || '{}');
    this.registry.set('reducedMotion', !!saved.reducedMotion);
    this.registry.set('assistMode', !!saved.assistMode);
    this.registry.set('musicVol', saved.musicVol ?? 0.5);
    this.registry.set('sfxVol', saved.sfxVol ?? 0.8);
  }

  openSettings(){
    const w = this.scale.width, h = this.scale.height;
    const box = this.add.rectangle(w/2, h/2, 520, 340, 0x10161d, .96).setStrokeStyle(2, 0x6F8F3E);
    const t = this.add.text(w/2, h/2-140, "Settings", { fontFamily:'monospace', fontSize:22, color:'#e5e7eb'}).setOrigin(0.5);

    const reduced = this.add.text(w/2-180, h/2-80, "[ ] Reduced motion", { fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setInteractive();
    const assist  = this.add.text(w/2-180, h/2-40, "[ ] Assist mode (double jump)", { fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setInteractive();
    const music   = this.add.text(w/2-180, h/2+10, "Music volume: 50%", { fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setInteractive();
    const sfx     = this.add.text(w/2-180, h/2+50, "SFX volume: 80%", { fontFamily:'monospace', fontSize:16, color:'#cfd6dd'}).setInteractive();
    const saveBtn = this.add.text(w/2, h/2+110, "Save & Close", { fontFamily:'monospace', fontSize:18, color:'#A3C76E'}).setOrigin(0.5).setInteractive({useHandCursor:true});

    const state = {
      reduced: this.registry.get('reducedMotion'),
      assist:  this.registry.get('assistMode'),
      music:   this.registry.get('musicVol'),
      sfx:     this.registry.get('sfxVol'),
    };
    const sync = ()=>{
      reduced.setText(`${state.reduced?'[x]':'[ ]'} Reduced motion`);
      assist.setText(`${state.assist?'[x]':'[ ]'} Assist mode (double jump)`);
      music.setText(`Music volume: ${Math.round(state.music*100)}%`);
      sfx.setText(`SFX volume: ${Math.round(state.sfx*100)}%`);
    };
    sync();

    reduced.on('pointerup', ()=>{ state.reduced = !state.reduced; sync(); });
    assist.on('pointerup',  ()=>{ state.assist  = !state.assist;  sync(); });
    music.on('pointerup',   ()=>{ state.music  = Math.min(1, Math.max(0, state.music + 0.1)); sync(); });
    sfx.on('pointerup',     ()=>{ state.sfx    = Math.min(1, Math.max(0, state.sfx + 0.1));   sync(); });

    saveBtn.on('pointerup', ()=>{
      localStorage.setItem('kpo-settings', JSON.stringify({
        reducedMotion: state.reduced,
        assistMode: state.assist,
        musicVol: state.music,
        sfxVol: state.sfx
      }));
      this.registry.set('reducedMotion', state.reduced);
      this.registry.set('assistMode', state.assist);
      this.registry.set('musicVol', state.music);
      this.registry.set('sfxVol', state.sfx);
      box.destroy(); t.destroy(); reduced.destroy(); assist.destroy(); music.destroy(); sfx.destroy(); saveBtn.destroy();
    });
  }
}
