/**
 * cms-loader.js
 * Pulls live content from the admin panel into pages marked with data-cms.
 */
(function () {
  const API_BASE = 'https://render-backend-k4co.onrender.com';

  const scriptTag = document.currentScript;
  const pageSlug = scriptTag.getAttribute('data-cms-page');
  const isPreview = document.body.hasAttribute('data-cms-preview');
  const endpoint = isPreview
    ? `${API_BASE}/api/content/${pageSlug}/preview`
    : `${API_BASE}/api/content/${pageSlug}`;

  fetch(endpoint)
    .then((r) => r.json())
    .then((content) => {
      document.querySelectorAll('[data-cms]').forEach((el) => {
        const key = el.getAttribute('data-cms');
        const block = content[key];
        if (!block) return;

        if (block.type === 'image') {
          el.src = block.value;
        } else {
          el.innerHTML = block.value;
        }
      });
    })
    .catch((err) => console.warn('CMS content failed to load, showing defaults', err));
})();
