/**
 * nav.js — TOC sidebar + scroll-spy
 *
 * Builds the sidebar section list from actual headings in the chapter,
 * then highlights the current section as the reader scrolls.
 *
 * Entries:
 *   h2  → uses the parent <section id="..."> as the scroll target
 *   h3  → gets a generated id and is observed directly
 *
 * Scroll-spy: passive scroll listener + getBoundingClientRect.
 * The "active" entry is the last one whose top has crossed 30% of the viewport.
 */

(function () {
  'use strict';

  var main        = document.querySelector('.col-right');
  var sectionList = document.querySelector('.col-middle__sections');
  if (!main || !sectionList) return;

  /* -----------------------------------------------------------------------
     Slugify — generate a URL-safe id from heading text
     ----------------------------------------------------------------------- */
  function slugify(text) {
    return text.toLowerCase()
      .replace(/<[^>]*>/g, '')   /* strip inner HTML tags */
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /* -----------------------------------------------------------------------
     Build entries — [{el, id, text, level}, …]
     el  is the element whose .getBoundingClientRect().top drives scroll-spy.
     id  is the href anchor.
     ----------------------------------------------------------------------- */
  var entries = [];

  main.querySelectorAll('section[id]').forEach(function (section) {
    if (section.classList.contains('footnotes')) return;

    var h2 = section.querySelector(':scope > h2');
    if (!h2) return;

    entries.push({
      el:       h2,      /* scroll-spy tracks h2 position, not section top */
      scrollTo: section, /* click scrolls to section start */
      id:       section.id,
      text:     h2.textContent.trim(),
      level:    2
    });

    /* h3 inside this section */
    section.querySelectorAll('h3').forEach(function (h3) {
      if (h3.closest('.footnotes')) return;

      if (!h3.id) h3.id = slugify(h3.textContent);

      entries.push({
        el:       h3,
        scrollTo: h3,
        id:       h3.id,
        text:     h3.textContent.trim(),
        level:    3
      });
    });
  });

  if (!entries.length) return;

  /* -----------------------------------------------------------------------
     Render sidebar list
     ----------------------------------------------------------------------- */
  sectionList.innerHTML = '';

  entries.forEach(function (entry) {
    var li = document.createElement('li');
    li.className = 'col-middle__section-item';

    var a = document.createElement('a');
    a.href = '#' + entry.id;
    a.className = 'col-middle__section-link';
    if (entry.level === 3) a.classList.add('col-middle__section-link--h3');
    a.textContent = entry.text;

    a.addEventListener('click', function (e) {
      e.preventDefault();
      entry.scrollTo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    li.appendChild(a);
    sectionList.appendChild(li);
  });

  /* -----------------------------------------------------------------------
     Scroll-spy
     ----------------------------------------------------------------------- */
  var links     = sectionList.querySelectorAll('.col-middle__section-link');
  var activeIdx = -1;

  function setActive(idx) {
    if (idx === activeIdx) return;
    activeIdx = idx;
    links.forEach(function (a, i) {
      a.classList.toggle('col-middle__section-link--active', i === idx);
    });
  }

  function updateActive() {
    /* h3 entries: activate when heading crosses 22% mark — gives them
       a comfortable lead-in window before the next heading takes over.
       h2 entries: activate only when heading is ≤80px from top — this
       delays the h2 "taking over", so any preceding h3 stays highlighted
       across the full sub-section scroll range. */
    var thresholdH3 = window.innerHeight * 0.55;
    var thresholdH2 = 80;
    var best = 0;
    entries.forEach(function (entry, i) {
      var t = entry.level === 2 ? thresholdH2 : thresholdH3;
      if (entry.el.getBoundingClientRect().top <= t) best = i;
    });
    setActive(best);
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();   /* run once on load */
})();
