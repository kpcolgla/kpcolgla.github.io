
(function(){
  const KEY='theme-preference';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  function apply(v){ document.documentElement.classList.toggle('dark', v==='dark'); }
  const saved=get(); if(saved) apply(saved);
  document.addEventListener('click', e=>{
    const t=e.target.closest('[data-theme]'); if(!t) return;
    const cur=get()||'system';
    const next = cur==='light' ? 'dark' : cur==='dark' ? 'system' : 'light';
    set(next); apply(next);
    t.textContent = next==='light' ? '🌞' : next==='dark' ? '🌙' : '🖥️';
    t.setAttribute('aria-label','Theme: '+next);
  });
})();