const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const reveals = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('.stagger-group');
const heroBg = document.querySelector('.parallax-bg');
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
});

updateHeader();
updateParallax();
