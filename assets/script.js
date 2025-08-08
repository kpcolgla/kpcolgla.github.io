document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('nav .nav-links a');
  const progressBar = document.getElementById('progress');

  // reveal sections with IntersectionObserver
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
        // Stop observing once visible to prevent repeated triggers
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    if (!section.classList.contains('section-visible')) {
      revealObserver.observe(section);
    }
  });

  // nav active link update
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id || 'home';
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href').slice(1) === id);
        });
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(section => navObserver.observe(section));

  // progress bar update on scroll
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.height = progress + '%';
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
});
