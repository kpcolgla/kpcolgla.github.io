
(function(){
  const KEY='theme';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  const apply=v=>document.documentElement.classList.toggle('dark', v==='dark');
  const saved=get(); if(saved) apply(saved);
  document.addEventListener('click', e=>{
    const btn=e.target.closest('[data-theme]'); if(!btn) return;
    const cur=get()||'system'; const next = cur==='light'?'dark':cur==='dark'?'system':'light';
    set(next); apply(next);
    btn.textContent = next==='light'?'🌞': next==='dark'?'🌙':'🖥️';
    btn.setAttribute('aria-label','Theme: '+next);
  });
  const stamp = document.querySelector('[data-last]');
  if(stamp && !stamp.textContent.trim()){
    const d=new Date(); stamp.textContent=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  }
})();
