'use strict';
const button = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-items');
if (button && nav) {
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
  });
}
const filter = document.getElementById('filter');
const count = document.getElementById('match-count');
if (filter) {
  const items = [...document.querySelectorAll('.wiki-entry')];
  const update = () => {
    const query = filter.value.normalize('NFKC').toLocaleLowerCase().trim();
    let shown = 0;
    for (const item of items) {
      const hit = (item.textContent || '').normalize('NFKC').toLocaleLowerCase().includes(query);
      item.classList.toggle('is-hidden', !hit);
      if (hit) shown++;
    }
    if (count) count.textContent = `${shown} / ${items.length} pages`;
  };
  filter.addEventListener('input', update);
  update();
}

const followButton = document.getElementById('follow-toggle');
const profileUrls = document.getElementById('profile-urls');
if (followButton && profileUrls) {
  followButton.addEventListener('click', () => {
    const open = profileUrls.classList.toggle('is-open');
    followButton.setAttribute('aria-expanded', String(open));
  });
}


const themeToggle = document.getElementById('theme-toggle');
const themeAuto = document.getElementById('theme-auto');
const themePreference = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const storedTheme = () => {
  try {
    const choice = window.localStorage.getItem('noda-site-theme');
    return choice === 'light' || choice === 'dark' ? choice : null;
  } catch (_) {
    return null;
  }
};
// Keep manual choices in memory even if the browser blocks localStorage.
let manualTheme = storedTheme();
const systemTheme = () => themePreference && themePreference.matches ? 'dark' : 'light';
const applyTheme = (value) => {
  document.documentElement.setAttribute('data-theme', value);
  if (themeToggle) {
    const label = value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }
  if (themeAuto) {
    const automatic = manualTheme === null;
    themeAuto.setAttribute('aria-pressed', String(automatic));
    themeAuto.setAttribute('title', automatic ? 'Following system appearance' : 'Follow system appearance');
  }
};
applyTheme(manualTheme || systemTheme());
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    manualTheme = nextTheme;
    try {
      window.localStorage.setItem('noda-site-theme', nextTheme);
    } catch (_) {
      // Manual appearance still applies during this page view without storage.
    }
    applyTheme(nextTheme);
  });
}
if (themeAuto) {
  themeAuto.addEventListener('click', () => {
    manualTheme = null;
    try {
      window.localStorage.removeItem('noda-site-theme');
    } catch (_) {
      // Return to system appearance during this page view without storage.
    }
    applyTheme(systemTheme());
  });
}
if (themePreference) {
  const syncWithSystem = (event) => {
    if (manualTheme === null) applyTheme(event.matches ? 'dark' : 'light');
  };
  if (themePreference.addEventListener) themePreference.addEventListener('change', syncWithSystem);
  else if (themePreference.addListener) themePreference.addListener(syncWithSystem);
}
// Keep open tabs synchronized when the preference changes elsewhere.
window.addEventListener('storage', (event) => {
  if (event.key === 'noda-site-theme' || event.key === null) {
    manualTheme = storedTheme();
    applyTheme(manualTheme || systemTheme());
  }
});
