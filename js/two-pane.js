/**
 * two-pane.js — Entrance reveal for .two-pane blocks
 *
 * Watches each .two-pane with IntersectionObserver.
 * When 15% of the block enters the viewport, adds .two-pane--revealed
 * which triggers the CSS fade + lift transition (380ms ease).
 * Once revealed the element is unobserved — no re-animation on scroll back.
 */

(function () {
  'use strict';

  var blocks = document.querySelectorAll('.two-pane');
  if (!blocks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('two-pane--revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  blocks.forEach(function (el) { observer.observe(el); });
})();
