// Theme toggle and interactive script for Kyle Colglazier's portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle setup
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  /**
   * Apply the chosen theme to the document and update the toggle button.
   * @param {string} theme Either 'dark' or 'light'.
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
      if (themeToggleBtn) {
        themeToggleBtn.textContent = '☀️';
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      html.classList.remove('dark');
      if (themeToggleBtn) {
        themeToggleBtn.textContent = '🌙';
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  // Determine initial theme: use stored preference or system setting
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  // Toggle theme on button click and persist preference
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Card tilt on hover (desktop) respecting reduced motion
  document.querySelectorAll('.card').forEach(card => {
    let rect;
    const tiltAmount = 18;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleEnter = () => {
      rect = card.getBoundingClientRect();
    };
    const handleMove = (e) => {
      if (reduceMotion.matches) return;
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-y * tiltAmount).toFixed(2)}deg) rotateY(${(x * tiltAmount).toFixed(2)}deg)`;
    };
    const handleLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  });

  // Filter chips to show/hide cards
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('.cards .card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const key = chip.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = key === 'all' || tags.includes(key);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Quick-view modal data
  const CASES = {
    paypal: {
      title: 'Global Sales Enablement — PayPal',
      kicker: 'Designed and delivered training across the globe; built AI role-play simulations; supported onboarding relaunches.',
      bullets: [
        'Designed and delivered training for global sales teams.',
        'Developed AI role-play simulations for objection handling and value discovery.',
        'Supported the relaunch of a large-scale onboarding program.'
      ]
    },
    meta: {
      title: 'Digital Marketing Certification — Meta',
      kicker: 'eLearning + vILT for Blueprint; helped SMBs and agencies adopt ad products and get certified.',
      bullets: [
        'Developed e-learning and virtual instructor-led training for Meta’s Blueprint certification.',
        'Helped global SMBs and agencies master ad products and achieve certification.',
        'Iterated content to keep pace with evolving ad features.'
      ]
    },
    sidley: {
      title: 'Leadership & Compliance — Sidley Austin LLP',
      kicker: 'Scenario-based training with video, interactive modules, and assessments.',
      bullets: [
        'Created leadership and compliance training using video and interactive modules.',
        'Ensured high completion rates and strong retention without disrupting client work.',
        'Blended media for clarity and engagement.'
      ]
    },
    uni: {
      title: 'Public Speaking — University Teaching',
      kicker: 'Taught public speaking at Syracuse University and Texas A&M.',
      bullets: [
        'Helped students develop clear, confident communication skills.',
        'Guided practice through constructive feedback and coaching.',
        'Bridged theory and practice for real-world application.'
      ]
    }
  };

  // Quick view modal functionality
  const modal = document.getElementById('case-modal');
  if (modal) {
    const titleEl = modal.querySelector('#case-title');
    const kickerEl = modal.querySelector('.kicker');
    const listEl = modal.querySelector('.bullets');
    const closeBtn = modal.querySelector('.close');
    const backdrop = modal.querySelector('.case-backdrop');
    document.querySelectorAll('.btn.more').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.case;
        const data = CASES[id];
        if (!data) return;
        titleEl.textContent = data.title;
        kickerEl.textContent = data.kicker;
        listEl.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
        modal.hidden = false;
        closeBtn.focus();
      });
    });
    const hideModal = () => {
      modal.hidden = true;
    };
    closeBtn.addEventListener('click', hideModal);
    backdrop.addEventListener('click', hideModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) hideModal();
    });
  }
});
