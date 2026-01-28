(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('[data-reveal]');

  if (prefersReduced) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((el) => observer.observe(el));
  }

  const focusDetail = (target) => {
    if (!target || target.tagName.toLowerCase() !== 'details') return;
    target.setAttribute('open', '');
    target.classList.add('is-focus');
    setTimeout(() => target.classList.remove('is-focus'), 1200);
  };

  const indexLinks = document.querySelectorAll('.project-index a');
  if (indexLinks.length) {
    indexLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        focusDetail(target);
      });
    });
  }

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    focusDetail(target);
  }
})();
