
(function(){
  const KEY='theme-pref';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  function apply(v){
    document.documentElement.classList.toggle('dark', v==='dark');
    document.querySelector('[data-theme]').textContent = v==='dark'?'🌙':'🌞';
    document.querySelector('[data-theme]').setAttribute('aria-label','Toggle theme (current: '+(v==='dark'?'dark':'light')+')');
  }
  // Init: system preference default to light UI, but honor stored pref
  const saved=get(); apply(saved||'light');
  document.addEventListener('click', e=>{
    const t=e.target.closest('[data-theme]'); if(!t) return;
    const cur=get()||'light'; const next= cur==='light'?'dark':'light'; set(next); apply(next);
  });
  // Reduced motion
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.classList.add('prefers-reduced-motion');
  }
  // Last updated
  const el=document.querySelector('[data-last-updated]');
  if(el && !el.textContent.trim()){
    const d=new Date(); el.textContent=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  }
})();
