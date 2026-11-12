'use strict';
// Apply the saved theme or system appearance before styles render.
(function () {
  let saved = null;
  try {
    saved = window.localStorage.getItem('noda-site-theme');
  } catch (_) {
    // Private browsing may disable storage.
  }
  const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved === 'dark' || saved === 'light' ? saved : dark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
