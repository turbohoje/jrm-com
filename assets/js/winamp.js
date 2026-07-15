/**
 * winamp.js — dresses every .section as a classic Winamp window.
 * Builds a pinstriped titlebar from the section's heading, wraps the rest
 * of the section body so it can be shaded (collapsed), and remembers the
 * open/closed state per section in localStorage.
 */
(function () {
  var STORE_PREFIX = 'winamp-collapse-';

  // Sections that start shaded on first visit (until the user toggles them).
  var DEFAULT_COLLAPSED = ['pen-source-and-3d-printering'];

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function readState(key) {
    var def = DEFAULT_COLLAPSED.indexOf(key) !== -1;
    try {
      var v = localStorage.getItem(STORE_PREFIX + key);
      return v === null ? def : v === '1';
    } catch (e) {
      return def;
    }
  }

  function writeState(key, collapsed) {
    try {
      localStorage.setItem(STORE_PREFIX + key, collapsed ? '1' : '0');
    } catch (e) {
      /* private mode / storage disabled — collapse still works, just no memory */
    }
  }

  function init() {
    var sections = document.querySelectorAll('.section');

    Array.prototype.forEach.call(sections, function (section, index) {
      var inner = section.querySelector('.section-inner');
      if (!inner || inner.querySelector('.winamp-titlebar')) return;

      // Title comes from the section's heading; fall back to a generic label.
      var heading = inner.querySelector('.heading');
      var titleText = heading ? heading.textContent.trim() : '';
      if (!titleText) titleText = 'Section ' + (index + 1);

      var key = slug(titleText) || String(index);

      // Move everything currently in .section-inner into a body wrapper.
      var body = document.createElement('div');
      body.className = 'winamp-body';
      while (inner.firstChild) {
        body.appendChild(inner.firstChild);
      }

      // Build the titlebar:  [logo] [grip] [ TITLE ] [grip] [shade btn]
      var titlebar = document.createElement('div');
      titlebar.className = 'winamp-titlebar';

      var logo = document.createElement('span');
      logo.className = 'winamp-logo';
      logo.setAttribute('aria-hidden', 'true');

      var gripLeft = document.createElement('span');
      gripLeft.className = 'winamp-grip';
      gripLeft.setAttribute('aria-hidden', 'true');

      var titleSpan = document.createElement('span');
      titleSpan.className = 'winamp-title';
      titleSpan.textContent = titleText;

      var gripRight = document.createElement('span');
      gripRight.className = 'winamp-grip';
      gripRight.setAttribute('aria-hidden', 'true');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'winamp-btn';
      btn.setAttribute('aria-label', 'Collapse / expand ' + titleText);

      titlebar.appendChild(logo);
      titlebar.appendChild(gripLeft);
      titlebar.appendChild(titleSpan);
      titlebar.appendChild(gripRight);
      titlebar.appendChild(btn);

      inner.appendChild(titlebar);
      inner.appendChild(body);

      function render(collapsed) {
        section.classList.toggle('winamp-collapsed', collapsed);
        btn.textContent = collapsed ? '+' : '_';
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      }

      render(readState(key));

      function toggle() {
        var collapsed = !section.classList.contains('winamp-collapsed');
        render(collapsed);
        writeState(key, collapsed);
      }

      btn.addEventListener('click', toggle);
      // Double-clicking the titlebar also shades the window, like Winamp.
      titlebar.addEventListener('dblclick', function (e) {
        if (e.target !== btn) toggle();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
