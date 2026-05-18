/**
 * gallery.js — Stack gallery component
 *
 * Auto-initializes all .gallery-stack elements on the page.
 * Interaction: click image · prev/next buttons · ← → arrow keys when focused.
 *
 * Fonts: Source Serif 4 (body) · Space Grotesk (headings) · Inter (UI)
 */

(function () {
  'use strict';

  function initGallery(root) {
    var items     = root.querySelectorAll('.gallery-stack__item');
    var captionEl = root.querySelector('.gallery-stack__caption');
    var counterEl = root.querySelector('.gallery-stack__counter');
    var prevBtn   = root.querySelector('[data-dir="-1"]');
    var nextBtn   = root.querySelector('[data-dir="1"]');
    var stage     = root.querySelector('.gallery-stack__stage');
    var total     = items.length;
    var current   = 0;
    var animating = false;

    if (!total) return;

    /* Make the stage focusable so keyboard works after a click */
    if (stage) stage.setAttribute('tabindex', '0');

    function getCaption(i) {
      var el = items[i].querySelector('.gallery-stack__slide-caption');
      return el ? el.textContent.trim() : '';
    }

    function sync(i) {
      if (captionEl) captionEl.textContent = getCaption(i);
      /* narrow no-break space around slash: "1 / 8" */
      if (counterEl) counterEl.textContent = (i + 1) + ' / ' + total;
      if (prevBtn)   prevBtn.disabled = (i === 0);
      if (nextBtn)   nextBtn.disabled = (i === total - 1);
    }

    function goTo(next, dir) {
      if (animating || next === current || next < 0 || next >= total) return;
      animating = true;

      var from = items[current];
      var to   = items[next];

      /* Exit current slide */
      from.classList.remove('gallery-stack__item--active');
      from.classList.add('gallery-stack__item--exiting');
      from.setAttribute('aria-hidden', 'true');
      /* Going backward: mirror the drift direction */
      if (dir < 0) from.style.transform = 'translateX(6%)';

      /* Enter next slide — force reflow between entering and active
         so the CSS transition fires properly */
      to.classList.add('gallery-stack__item--entering');
      to.offsetHeight; /* eslint-disable-line no-unused-expressions */
      to.classList.remove('gallery-stack__item--entering');
      to.classList.add('gallery-stack__item--active');
      to.setAttribute('aria-hidden', 'false');

      sync(next);

      setTimeout(function () {
        from.classList.remove('gallery-stack__item--exiting');
        from.style.transform = '';
        current   = next;
        animating = false;
      }, 230);
    }

    /* Click anywhere on the stage → advance */
    if (stage) {
      stage.addEventListener('click', function () {
        goTo(current + 1, 1);
      });
    }

    /* Prev / next buttons */
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current - 1, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current + 1, 1);
      });
    }

    /* Keyboard — fires when focus is inside this gallery (events bubble up) */
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1,  1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1, -1); }
    });

    /* Initial state */
    sync(0);
  }

  document.querySelectorAll('.gallery-stack').forEach(initGallery);
})();
