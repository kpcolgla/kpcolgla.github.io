// Theme toggle script. Handles switching between light and dark modes.
(function () {
  const toggleButton = document.querySelector('[data-theme-toggle]');
  const darkStyle = document.getElementById('dark-mode-stylesheet');

  // Determine the initial theme: check localStorage or system preference
  function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      enableDark();
    } else if (stored === 'light') {
      disableDark();
    } else {
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDark();
      } else {
        disableDark();
      }
    }
  }

  function enableDark() {
    darkStyle.removeAttribute('disabled');
    localStorage.setItem('theme', 'dark');
    updateToggleLabel('light');
  }

  function disableDark() {
    darkStyle.setAttribute('disabled', '');
    localStorage.setItem('theme', 'light');
    updateToggleLabel('dark');
  }

  function updateToggleLabel(nextTheme) {
    if (!toggleButton) return;
    toggleButton.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    toggleButton.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
  }

  // Toggle between themes when button clicked
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const isDark = !darkStyle.hasAttribute('disabled');
      if (isDark) {
        disableDark();
      } else {
        enableDark();
      }
    });
  }

  initTheme();
})();