document.addEventListener('DOMContentLoaded', () => {
  // 3D tilt (desktop only)
  document.querySelectorAll('.card').forEach(card => {
    let rect;
    const d = 18;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const enter = () => rect = card.getBoundingClientRect();
    const move = e => {
      if (reduce.matches) return;
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y*d}deg) rotateY(${x*d}deg)`;
    };
    const leave = () => card.style.transform = '';
    card.addEventListener('mouseenter', enter);
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
  });

  // Filter chips
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('.cards .card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const key = chip.dataset.filter;
    cards.forEach(card => {
      const show = key === 'all' || (card.dataset.tags || '').includes(key);
      card.style.display = show ? '' : 'none';
    });
  }));

  // Quick-view modal
  const CASES = {
    paypal: {
      title: 'Global Sales Enablement — PayPal',
      kicker: 'Designed and delivered training across the globe; built AI role-play sims; supported onboarding relaunches.',
      bullets: [
        'Sales training across 10+ regions and global teams.',
        'AI objection-handling & value-discovery simulations.',
        'Supported large-scale onboarding program relaunches.'
      ]
    },
    meta: {
      title: 'Digital Marketing Certification — Meta',
      kicker: 'eLearning + vILT for Blueprint; helped SMBs and agencies adopt ad products and get certified.',
      bullets: [
        'Curriculum updates to track evolving product features.',
        'Global audience fit: async + live delivery.'
      ]
    },
    sidley: {
      title: 'Leadership & Compliance — Sidley Austin LLP',
      kicker: 'Scenario-based training with video, interactives, and assessments.',
      bullets: [
        'Kept completion high without disrupting client work.',
        'Blended media for clarity and retention.'
      ]
    },
    uni: {
      title: 'Public Speaking — University Teaching',
      kicker: 'Taught public speaking at Syracuse and Texas A&M.',
      bullets: [
        'Helped students present with clarity and confidence.'
      ]
    }
  };

  const modal = document.getElementById('case-modal');
  if (!modal) return;
  const title = modal.querySelector('#case-title');
  const kicker = modal.querySelector('.kicker');
  const list = modal.querySelector('.bullets');

  document.querySelectorAll('.btn.more').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.case;
      const data = CASES[id];
      if (!data) return;
      title.textContent = data.title;
      kicker.textContent = data.kicker;
      list.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
      modal.hidden = false;
      modal.querySelector('.close').focus();
    });
  });
  modal.querySelector('.close').addEventListener('click', () => modal.hidden = true);
  modal.querySelector('.case-backdrop').addEventListener('click', () => modal.hidden = true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) modal.hidden = true; });
});
