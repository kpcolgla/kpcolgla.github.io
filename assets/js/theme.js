
(function(){
  const KEY='theme-preference';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  function apply(v){
    if(v==='dark'){ document.documentElement.classList.add('dark'); }
    else if(v==='light'){ document.documentElement.classList.remove('dark'); }
    else { document.documentElement.classList.remove('dark'); } // system default
  }
  const saved=get(); if(saved) apply(saved);
  document.addEventListener('click', (e)=>{
    const t=e.target.closest('[data-toggle-theme]'); if(!t) return;
    const cur=get()||'system';
    const next= cur==='light'?'dark': cur==='dark'?'system':'light';
    set(next); apply(next);
    t.textContent = next==='light'?'🌞': next==='dark'?'🌙':'🖥️';
    t.setAttribute('aria-label','Theme: '+next);
  });
  document.addEventListener('click',(e)=>{
    const b=e.target.closest('[data-menu-btn]'); if(!b) return;
    const n=document.querySelector('.nav-links'); if(n) n.classList.toggle('open');
  });
})();