
(function(){
  const KEY='theme-preference';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  function apply(pref){ document.documentElement.classList.toggle('dark', pref==='dark'); }
  const saved=get(); if(saved) apply(saved);
  document.addEventListener('click', e=>{
    const t=e.target.closest('[data-toggle-theme]'); if(!t) return;
    const cur=get()||'system';
    const next= cur==='light' ? 'dark' : cur==='dark' ? 'system' : 'light';
    set(next); apply(next);
    t.setAttribute('aria-label','Theme: '+next);
    t.textContent = next==='light' ? '🌞' : next==='dark' ? '🌙' : '🖥️';
  });
  document.addEventListener('click', e=>{
    const m=e.target.closest('[data-menu-btn]'); if(!m) return;
    const links=document.querySelector('.nav-links'); if(links) links.classList.toggle('open');
  });
  const stamp=document.querySelector('[data-last-updated]');
  if(stamp && !stamp.textContent.trim()){
    const d=new Date();
    stamp.textContent=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  }
})();
