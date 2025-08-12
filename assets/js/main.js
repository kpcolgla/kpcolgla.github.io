
(function(){
  // Theme
  const KEY='theme-preference';
  const get=()=>localStorage.getItem(KEY);
  const set=v=>localStorage.setItem(KEY,v);
  function apply(v){ document.documentElement.classList.toggle('dark', v==='dark'); }
  const saved=get(); if(saved) apply(saved);
  const toggleBtn=document.querySelector('[data-theme-toggle]');
  if(toggleBtn){
    const label = toggleBtn.querySelector('.state');
    function setIcon(){
      const isDark = document.documentElement.classList.contains('dark');
      label.textContent = isDark ? '🌙' : '☀️';
      toggleBtn.setAttribute('aria-label','Toggle light/dark theme');
      toggleBtn.title='Switch between light and dark mode';
    }
    setIcon();
    toggleBtn.addEventListener('click', ()=>{
      const cur = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = cur==='dark' ? 'light' : 'dark';
      set(next); apply(next); setIcon();
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id=a.getAttribute('href').slice(1);
      const el=document.getElementById(id);
      if(!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Scroll reveals
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target); }
      });
    }, {threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=> el.classList.add('show'));
  }

  // Timeline expand/collapse
  document.querySelectorAll('.ti button[data-more]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.ti');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', item.classList.contains('open'));
    });
  });

  // Scroll-to-top
  const topBtn = document.querySelector('.scrolltop');
  const showAt = 400;
  window.addEventListener('scroll', ()=>{
      if(window.scrollY > showAt) topBtn.classList.add('show'); else topBtn.classList.remove('show');
  });
  topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // Plausible stub (won't error locally)
  window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments) };
  document.querySelectorAll('[data-event]').forEach(el=>{
    el.addEventListener('click', ()=> plausible(el.getAttribute('data-event')));
  });
})();