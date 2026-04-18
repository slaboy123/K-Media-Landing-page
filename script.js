const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const reveals = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('.stagger-group');
const heroSection = document.querySelector('.hero');
const heroBg = document.querySelector('.parallax-bg');
const motionImages = document.querySelectorAll('.project-media img, .member-photo img');
const carousels = document.querySelectorAll('[data-carousel]');
const sections = document.querySelectorAll('main section[id]');
let rafScroll = null;
let rafCarousel = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 10);
};

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

const setActiveNavLink = (sectionId) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', target);
  });
};

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      setActiveNavLink(entry.target.id);
    });
  }, {
    threshold: 0.45,
    rootMargin: '-10% 0px -35% 0px',
  });

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

reveals.forEach((element, index) => {
  element.style.setProperty('--d', `${(index % 8) * 70}ms`);
  revealObserver.observe(element);
});

staggerGroups.forEach((group) => {
  group.querySelectorAll('.reveal').forEach((item, index) => {
    item.style.setProperty('--d', `${index * 90}ms`);
  });
});

const updateParallax = () => {
  if (!heroBg || reduceMotion) return;

  const offset = Math.min(window.scrollY * 0.18, 140);
  heroBg.style.setProperty('--hero-scroll', `${offset}px`);
};

const updateMediaScrollMotion = () => {
  if (reduceMotion || !motionImages.length) return;

  const viewportHalf = window.innerHeight / 2;

  motionImages.forEach((img) => {
    const rect = img.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const center = rect.top + rect.height / 2;
    const normalized = clamp((center - viewportHalf) / viewportHalf, -1, 1);
    const speed = img.closest('.project-media') ? 18 : 12;

    img.style.setProperty('--scroll-shift', `${normalized * speed}px`);
  });
};

const setupPointerImageMotion = (img) => {
  if (reduceMotion || !pointerFine) return;

  const surface = img.parentElement;
  if (!surface) return;

  const reset = () => {
    img.style.setProperty('--mx', '0px');
    img.style.setProperty('--my', '0px');
  };

  surface.addEventListener('pointermove', (event) => {
    const rect = surface.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    const moveX = (relX - 0.5) * 14;
    const moveY = (relY - 0.5) * 12;

    img.style.setProperty('--mx', `${moveX.toFixed(2)}px`);
    img.style.setProperty('--my', `${moveY.toFixed(2)}px`);
  });

  surface.addEventListener('pointerleave', reset);
  surface.addEventListener('pointercancel', reset);
};

const setupHeroPointerParallax = () => {
  if (reduceMotion || !pointerFine || !heroSection || !heroBg) return;

  const reset = () => {
    heroBg.style.setProperty('--hero-mx', '0px');
    heroBg.style.setProperty('--hero-my', '0px');
  };

  heroSection.addEventListener('pointermove', (event) => {
    const rect = heroSection.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    const moveX = (relX - 0.5) * 20;
    const moveY = (relY - 0.5) * 14;

    heroBg.style.setProperty('--hero-mx', `${moveX.toFixed(2)}px`);
    heroBg.style.setProperty('--hero-my', `${moveY.toFixed(2)}px`);
  });

  heroSection.addEventListener('pointerleave', reset);
  heroSection.addEventListener('pointercancel', reset);
};

const updateCarouselState = (track, cards, prevButton, nextButton) => {
  const maxScrollLeft = track.scrollWidth - track.clientWidth - 2;
  const atStart = track.scrollLeft <= 2;
  const atEnd = track.scrollLeft >= maxScrollLeft;

  prevButton?.classList.toggle('is-disabled', atStart);
  nextButton?.classList.toggle('is-disabled', atEnd);

  const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
  let activeCard = cards[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card) => {
    const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
    const distance = Math.abs(cardCenter - trackCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      activeCard = card;
    }
  });

  cards.forEach((card) => {
    card.classList.toggle('is-active', card === activeCard);
  });
};

const setupCarousel = (track) => {
  const shell = track.closest('.carousel-shell');
  const prevButton = shell?.querySelector('[data-carousel-prev]');
  const nextButton = shell?.querySelector('[data-carousel-next]');
  const cards = Array.from(track.querySelectorAll('.carousel-card'));

  if (!cards.length) return;

  const scrollByAmount = (direction) => {
    const distance = Math.max(track.clientWidth * 0.82, 280);
    track.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  prevButton?.addEventListener('click', () => scrollByAmount(-1));
  nextButton?.addEventListener('click', () => scrollByAmount(1));

  track.addEventListener('wheel', (event) => {
    if (reduceMotion) return;
    if (window.innerWidth < 780) return;

    const hasHorizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (hasHorizontalIntent) return;

    event.preventDefault();
    track.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
  }, { passive: false });

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByAmount(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByAmount(-1);
    }
  });

  const syncCarousel = () => {
    if (rafCarousel) return;

    rafCarousel = requestAnimationFrame(() => {
      updateCarouselState(track, cards, prevButton, nextButton);
      rafCarousel = null;
    });
  };

  track.addEventListener('scroll', syncCarousel, { passive: true });
  window.addEventListener('resize', syncCarousel);

  syncCarousel();
};

carousels.forEach(setupCarousel);
motionImages.forEach(setupPointerImageMotion);
setupHeroPointerParallax();

window.addEventListener('scroll', () => {
  updateHeader();

  if (rafScroll || reduceMotion) return;

  rafScroll = requestAnimationFrame(() => {
    updateParallax();
    updateMediaScrollMotion();
    rafScroll = null;
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 780) {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  updateParallax();
  updateMediaScrollMotion();
});

updateHeader();
updateParallax();
updateMediaScrollMotion();
