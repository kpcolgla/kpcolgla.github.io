(function(){
  const STORAGE_KEY = 'theme-preference';
  const getPref = () => localStorage.getItem(STORAGE_KEY);
  const setPref = v => localStorage.setItem(STORAGE_KEY, v);

  function applyTheme(pref){
    if (pref === 'light') document.documentElement.classList.remove('dark');
    else if (pref === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark'); // system
  }

  // init
  const saved = getPref();
  if (saved) applyTheme(saved);

  // theme toggle
  document.addEventListener('click', function(e){
    const t = e.target.closest('[data-toggle-theme]');
    if (!t) return;
    const current = getPref() || 'system';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    setPref(next); applyTheme(next);
    t.setAttribute('aria-label', 'Theme: ' + next);
    t.textContent = next === 'light' ? '🌞' : next === 'dark' ? '🌙' : '🖥️';
  });

  // mobile menu (this is not a "mobile theme"; it's just nav)
  document.addEventListener('click', function(e){
    const btn = e.target.closest('[data-menu-btn]');
    if (!btn) return;
    const links = document.querySelector('.nav-links');
    if (links) links.classList.toggle('open');
  });
})();