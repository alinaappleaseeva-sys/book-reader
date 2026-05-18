/**
 * search.js — Client-side chapter search
 *
 * Indexes text from every section[id] in .col-right.
 * Uses String.includes for matching — no external dependency.
 *
 * Results show an excerpt with the matched phrase highlighted via <mark>.
 * Clicking a result closes the overlay and scrolls to the section.
 *
 * Depends on toc.js having run first (reads window.__tocOverlay).
 */

(function () {
  'use strict';

  var toc = window.__tocOverlay;
  if (!toc) return;

  var input       = toc.input;
  var chapterList = toc.chapterList;
  var resultsList = toc.resultsList;

  var EXCERPT_RADIUS = 70;   /* chars of context around the match */

  /* -----------------------------------------------------------------------
     Build search index from .col-right section[id] elements
     ----------------------------------------------------------------------- */
  var index = [];

  document.querySelectorAll('.col-right section[id]').forEach(function (section) {
    if (section.classList.contains('footnotes')) return;

    var h2 = section.querySelector(':scope > h2');
    var heading = h2 ? h2.textContent.trim() : section.id;

    /* Clone, strip headings, collapse whitespace */
    var clone = section.cloneNode(true);
    clone.querySelectorAll('h2, h3').forEach(function (h) { h.remove(); });
    var text = clone.textContent.replace(/\s+/g, ' ').trim();

    index.push({ id: section.id, heading: heading, text: text });
  });

  /* -----------------------------------------------------------------------
     Search
     ----------------------------------------------------------------------- */
  function search(query) {
    var q = query.toLowerCase().trim();
    if (!q) return [];

    return index
      .filter(function (entry) {
        return entry.heading.toLowerCase().includes(q) ||
               entry.text.toLowerCase().includes(q);
      })
      .map(function (entry) {
        return {
          id:      entry.id,
          heading: entry.heading,
          excerpt: buildExcerpt(entry.text, q),
          query:   q,
        };
      });
  }

  function buildExcerpt(text, q) {
    var lower = text.toLowerCase();
    var pos   = lower.indexOf(q);

    if (pos === -1) {
      /* Match was in heading — show start of body text */
      var end = Math.min(text.length, EXCERPT_RADIUS * 2);
      return text.slice(0, end) + (text.length > end ? '…' : '');
    }

    var start = Math.max(0, pos - EXCERPT_RADIUS);
    var stop  = Math.min(text.length, pos + q.length + EXCERPT_RADIUS);

    return (start > 0 ? '…' : '') +
           text.slice(start, stop) +
           (stop < text.length ? '…' : '');
  }

  /* -----------------------------------------------------------------------
     Render
     ----------------------------------------------------------------------- */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(str, q) {
    var safe    = escapeHtml(str);
    var escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re      = new RegExp('(' + escaped + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  function renderResults(results, query) {
    resultsList.innerHTML = '';

    if (!results.length) {
      var empty = document.createElement('li');
      empty.className = 'toc-overlay__no-results';
      empty.textContent = 'No results for “' + query + '”';
      resultsList.appendChild(empty);
      chapterList.hidden = true;
      resultsList.hidden = false;
      return;
    }

    results.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'toc-overlay__result-item';

      var a = document.createElement('a');
      a.className = 'toc-overlay__result-link';
      a.href = '#' + r.id;

      var headingEl = document.createElement('div');
      headingEl.className = 'toc-overlay__result-heading';
      headingEl.innerHTML = highlight(r.heading, r.query);

      var excerptEl = document.createElement('div');
      excerptEl.className = 'toc-overlay__result-excerpt';
      excerptEl.innerHTML = highlight(r.excerpt, r.query);

      a.appendChild(headingEl);
      a.appendChild(excerptEl);

      a.addEventListener('click', function (e) {
        e.preventDefault();
        toc.close();
        var target = document.getElementById(r.id);
        if (target) {
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      });

      li.appendChild(a);
      resultsList.appendChild(li);
    });

    chapterList.hidden = true;
    resultsList.hidden = false;
  }

  /* -----------------------------------------------------------------------
     Input — debounced
     ----------------------------------------------------------------------- */
  var timer = null;

  input.addEventListener('input', function () {
    clearTimeout(timer);
    var q = input.value.trim();

    if (!q) {
      toc.showChapters();
      return;
    }

    timer = setTimeout(function () {
      renderResults(search(q), q);
    }, 160);
  });

})();
