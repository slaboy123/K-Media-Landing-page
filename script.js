const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const reveals = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('.stagger-group');
const heroBg = document.querySelector('.parallax-bg');
const carousels = document.querySelectorAll('[data-carousel]');
let rafScroll = null;
let rafCarousel = null;

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
  heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
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

window.addEventListener('scroll', () => {
  updateHeader();

  if (rafScroll || reduceMotion) return;

  rafScroll = requestAnimationFrame(() => {
    updateParallax();
    rafScroll = null;
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 780) {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

updateHeader();
updateParallax();
