/**
 * Vanilla JS replacement for jQuery + main.js + util.js + jquery.scrollex.
 * Three responsibilities:
 *   1. Remove is-preload after 100ms (triggers CSS entry animations)
 *   2. Toggle header .alt (transparent) while the banner is visible on screen
 *   3. Slide-out menu: show/hide/toggle with 350ms debounce lock, Escape dismiss
 */

// --- 1. Preload ---

window.addEventListener('load', () => {
  setTimeout(() => document.body.classList.remove('is-preload'), 100);
});

// --- 2. Header alt state ---

const header = document.getElementById('header');
const banner = document.getElementById('banner');

if (header && banner && header.classList.contains('alt')) {
  const updateAlt = () => {
    const bannerBottom = banner.getBoundingClientRect().bottom;
    if (bannerBottom > header.offsetHeight) {
      header.classList.add('alt');
    } else {
      header.classList.remove('alt');
    }
  };

  window.addEventListener('scroll', updateAlt, { passive: true });
  window.addEventListener('resize', updateAlt, { passive: true });
  updateAlt(); // set correct state on initial load (handles pre-scrolled pages)
}

// --- 3. Menu ---

const menu = document.getElementById('menu');

// Move menu to body root so it sits above #page-wrapper (matches original jQuery behaviour)
if (menu) document.body.appendChild(menu);

let menuLocked = false;

const lockMenu = (): boolean => {
  if (menuLocked) return false;
  menuLocked = true;
  setTimeout(() => { menuLocked = false; }, 350);
  return true;
};

const hideMenu = () => { if (lockMenu()) document.body.classList.remove('is-menu-visible'); };
const toggleMenu = () => { if (lockMenu()) document.body.classList.toggle('is-menu-visible'); };

if (menu) {
  // Click on the backdrop (outside .inner) → close
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    hideMenu();
  });

  const inner = menu.querySelector<HTMLElement>('.inner');
  if (inner) {
    // Clicks inside the panel don't bubble to the backdrop
    inner.addEventListener('click', (e) => e.stopPropagation());

    // Close button
    inner.querySelector('.close')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideMenu();
    });

    // Nav links: close first, then navigate after the CSS transition (350ms)
    inner.querySelectorAll<HTMLAnchorElement>('a:not(.close)').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.href;
        e.preventDefault();
        e.stopPropagation();
        hideMenu();
        setTimeout(() => { window.location.href = href; }, 350);
      });
    });
  }
}

// "Menu" trigger button anywhere on the page
document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a[href="#menu"]')) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  }
});

// Escape key dismissal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideMenu();
});
