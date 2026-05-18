/**
 * toc.js — Table of Contents overlay
 *
 * Opens on: .col-middle__toc-trigger click, ⌘K / Ctrl+K
 * Closes on: close button, Esc, backdrop click
 *
 * Renders the full book chapter list (hardcoded structure).
 * Chapter 4 (current page) is marked with --current modifier.
 *
 * Exposes window.__tocOverlay for search.js to wire into.
 */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Book structure
     id: 'current' marks the chapter loaded on this page
     id: null      marks chapters not yet linked
     ----------------------------------------------------------------------- */
  var BOOK = [
    {
      part: 'Part I — Foundations',
      chapters: [
        { num: 1,  title: 'What is a Job?',                              id: null      },
        { num: 2,  title: 'The Language of Jobs',                        id: null      },
        { num: 3,  title: 'Needs, Goals, and Emotions',                  id: null      },
        { num: 4,  title: 'How Value Flows from the Job Graph',          id: 'current' },
        { num: 5,  title: 'The Skeptic\'s Toolkit',                      id: null      },
      ]
    },
    {
      part: 'Part II — The Job Graph',
      chapters: [
        { num: 6,  title: 'Mapping the Job Graph',                       id: null },
        { num: 7,  title: 'Node Types and Edges',                        id: null },
        { num: 8,  title: 'Reading the Graph',                           id: null },
      ]
    },
    {
      part: 'Part III — The 50 Mechanics',
      chapters: [
        { num: 9,  title: 'Mechanics Overview',                          id: null },
        { num: 10, title: 'Energy Mechanics',                            id: null },
        { num: 11, title: 'Constraint Mechanics',                        id: null },
        { num: 12, title: 'Switching Mechanics',                         id: null },
      ]
    },
    {
      part: 'Part IV — Research & Interviews',
      chapters: [
        { num: 13, title: 'Interview Design',                            id: null },
        { num: 14, title: 'The "I want to {verb}" Template',             id: null },
        { num: 15, title: 'Segmentation by Job',                         id: null },
      ]
    },
    {
      part: 'Part V — Product Decisions',
      chapters: [
        { num: 16, title: 'Prioritization with Jobs',                    id: null },
        { num: 17, title: 'Positioning and Messaging',                   id: null },
        { num: 18, title: 'Pricing Through the Job Lens',                id: null },
      ]
    },
    {
      part: 'Part VI — Growth',
      chapters: [
        { num: 19, title: 'Acquisition and Jobs',                        id: null },
        { num: 20, title: 'Retention and the Job Graph',                 id: null },
        { num: 21, title: 'Expansion Revenue',                           id: null },
      ]
    },
    {
      part: 'Part VII — Case Studies',
      chapters: [
        { num: 22, title: 'B2C: Consumer Software',                      id: null },
        { num: 23, title: 'B2B: Enterprise Tools',                       id: null },
        { num: 24, title: 'Marketplaces',                                id: null },
      ]
    },
    {
      part: 'Part VIII — What Comes Next',
      chapters: [
        { num: 25, title: 'Limits of AJTBD',                             id: null },
        { num: 26, title: 'Open Questions',                              id: null },
        { num: 27, title: 'Where the Field Is Going',                    id: null },
      ]
    },
  ];

  /* -----------------------------------------------------------------------
     DOM
     ----------------------------------------------------------------------- */
  var overlay     = document.getElementById('toc-overlay');
  if (!overlay) return;

  var backdrop    = overlay.querySelector('.toc-overlay__backdrop');
  var closeBtn    = overlay.querySelector('.toc-overlay__close');
  var input       = overlay.querySelector('.toc-overlay__input');
  var chapterList = overlay.querySelector('#toc-chapter-list');
  var resultsList = overlay.querySelector('#toc-search-results');
  var trigger     = document.querySelector('.col-middle__toc-trigger');

  var isOpen = false;

  /* -----------------------------------------------------------------------
     Render chapter list (runs once on init)
     ----------------------------------------------------------------------- */
  function renderChapters() {
    var frag = document.createDocumentFragment();

    BOOK.forEach(function (section) {
      var labelEl = document.createElement('li');
      labelEl.className = 'toc-overlay__part-label';
      labelEl.setAttribute('aria-hidden', 'true');
      labelEl.textContent = section.part;
      frag.appendChild(labelEl);

      section.chapters.forEach(function (ch) {
        var li = document.createElement('li');
        li.className = 'toc-overlay__chapter-item';

        var a = document.createElement('a');
        a.href = ch.id === 'current' ? '#' : '#';
        a.className = 'toc-overlay__chapter-link';
        if (ch.id === 'current') {
          a.classList.add('toc-overlay__chapter-link--current');
          a.setAttribute('aria-current', 'page');
        }

        var num = document.createElement('span');
        num.className = 'toc-overlay__chapter-num';
        num.textContent = ch.num + '.';
        num.setAttribute('aria-hidden', 'true');

        a.appendChild(num);
        a.appendChild(document.createTextNode(ch.title));

        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (ch.id === 'current') {
            close();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            close();
          }
        });

        li.appendChild(a);
        frag.appendChild(li);
      });
    });

    chapterList.appendChild(frag);
  }

  /* -----------------------------------------------------------------------
     Open / close
     ----------------------------------------------------------------------- */
  function open() {
    if (isOpen) return;
    isOpen = true;
    input.value = '';
    showChapters();
    /* Remove [hidden], then trigger fade-in via rAF so transition fires */
    overlay.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('toc-overlay--open');
      });
    });
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 60);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('toc-overlay--open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* Restore [hidden] after fade-out transition */
    overlay.addEventListener('transitionend', function hide() {
      overlay.removeEventListener('transitionend', hide);
      if (!isOpen) overlay.hidden = true;
    });
  }

  function showChapters() {
    chapterList.hidden = false;
    resultsList.hidden = true;
  }

  /* -----------------------------------------------------------------------
     Event wiring
     ----------------------------------------------------------------------- */
  if (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    var isMac = /mac/i.test(navigator.platform);
    var modKey = isMac ? e.metaKey : e.ctrlKey;

    /* ⌘/ — open overlay and focus search (brief §7.3) */
    if (modKey && e.key === '/') {
      e.preventDefault();
      if (!isOpen) open();
      else input.focus();
      return;
    }

    /* ⌘K — also opens overlay (bonus, not in brief) */
    if (modKey && e.key === 'k') {
      e.preventDefault();
      isOpen ? close() : open();
      return;
    }

    if (e.key === 'Escape' && isOpen) {
      close();
    }
  });

  /* -----------------------------------------------------------------------
     Init
     ----------------------------------------------------------------------- */
  /* overlay starts with [hidden] in HTML — toc.js manages it from here */
  overlay.setAttribute('aria-hidden', 'true');
  renderChapters();

  /* Expose for search.js */
  window.__tocOverlay = {
    open:         open,
    close:        close,
    input:        input,
    chapterList:  chapterList,
    resultsList:  resultsList,
    showChapters: showChapters,
  };

})();
