const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const reveals = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('.stagger-group');
const heroBg = document.querySelector('.parallax-bg');

const carousel = document.querySelector('[data-carousel]');
const carouselTrack = carousel?.querySelector('.carousel-track');
const carouselViewport = carousel?.querySelector('.carousel-viewport');
const carouselCards = carouselTrack ? Array.from(carouselTrack.children) : [];
const carouselPrev = carousel?.querySelector('.carousel-nav.prev');
const carouselNext = carousel?.querySelector('.carousel-nav.next');

const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const testimonialPrev = document.querySelector('.testimonials-slider .slider-nav.prev');
const testimonialNext = document.querySelector('.testimonials-slider .slider-nav.next');

let carouselIndex = 0;
let testimonialIndex = 0;
let rafScroll = null;

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

const updateCarousel = () => {
  if (!carouselTrack || !carouselCards.length || !carouselViewport) return;

  const cardWidth = carouselCards[0].getBoundingClientRect().width;
  const gap = 16;
  const viewportWidth = carouselViewport.clientWidth;
  const offset = Math.max(0, (cardWidth + gap) * carouselIndex - (viewportWidth - cardWidth) / 2);

  carouselTrack.style.transform = `translateX(-${offset}px)`;

  carouselCards.forEach((card, idx) => {
    const active = idx === carouselIndex;
    card.classList.toggle('is-active', active);
    card.classList.toggle('is-side', Math.abs(idx - carouselIndex) === 1 || (!active && window.innerWidth >= 780));
  });
};

carouselPrev?.addEventListener('click', () => {
  carouselIndex = (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
  updateCarousel();
});

carouselNext?.addEventListener('click', () => {
  carouselIndex = (carouselIndex + 1) % carouselCards.length;
  updateCarousel();
});

let touchStartX = 0;
carouselViewport?.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
}, { passive: true });

carouselViewport?.addEventListener('touchend', (event) => {
  const delta = touchStartX - event.changedTouches[0].clientX;
  if (Math.abs(delta) < 35) return;
  carouselIndex = delta > 0
    ? (carouselIndex + 1) % carouselCards.length
    : (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
  updateCarousel();
}, { passive: true });

const updateTestimonials = (index) => {
  if (!testimonialCards.length) return;
  testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === testimonialIndex);
  });
};

testimonialPrev?.addEventListener('click', () => updateTestimonials(testimonialIndex - 1));
testimonialNext?.addEventListener('click', () => updateTestimonials(testimonialIndex + 1));

if (!reduceMotion && testimonialCards.length) {
  setInterval(() => updateTestimonials(testimonialIndex + 1), 6500);
}

const updateParallax = () => {
  if (!heroBg || reduceMotion) return;

  const offset = Math.min(window.scrollY * 0.18, 140);
  heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
};

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

  updateCarousel();
});

updateHeader();
updateParallax();
updateCarousel();
updateTestimonials(0);
