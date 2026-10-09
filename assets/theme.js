document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

(function () {
  // Reveal elements as they enter the viewport
  function initReveal(root) {
    var items = (root || document).querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Nav: blurred black background after scrolling, full-screen menu on phones
  function initHeader() {
    var nav = document.querySelector('[data-header]');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = nav.querySelector('[data-nav-toggle]');
    if (!toggle) return;
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Language flag: flip to the other flag, then switch language
  function initFlags() {
    document.addEventListener('click', function (e) {
      var flag = e.target.closest('[data-flag]');
      if (!flag || !flag.form) return;
      e.preventDefault();
      flag.classList.add('is-flipping');
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = flag.name;
      input.value = flag.value;
      flag.form.appendChild(input);
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () { flag.form.submit(); }, reduce ? 0 : 450);
    });
  }

  // Jersey drawing: front/back switch
  function initJersey(root) {
    (root || document).querySelectorAll('[data-jersey]').forEach(function (view) {
      view.querySelectorAll('[data-side]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var back = btn.dataset.side === 'back';
          view.classList.toggle('is-back', back);
          view.querySelectorAll('[data-side]').forEach(function (b) {
            var on = b === btn;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', String(on));
          });
        });
      });
    });
  }

  // Size picker: find the variant matching the checked options, then update
  // the form's variant id, price, button, URL and the matching image.
  function initVariantPicker(root) {
    (root || document).querySelectorAll('[data-product]').forEach(function (product) {
      var picker = product.querySelector('[data-variant-picker]');
      if (!picker) return;
      var data = picker.querySelector('[data-variants]');
      if (!data) return;
      var variants = JSON.parse(data.textContent);
      var addBtn = product.querySelector('[data-add]');

      picker.addEventListener('change', function () {
        var groups = picker.querySelectorAll('fieldset');
        var selected = [];
        groups.forEach(function (fs) {
          var checked = fs.querySelector('input:checked');
          selected.push(checked ? checked.value : null);
          var current = fs.querySelector('[data-option-current]');
          if (current && checked) current.textContent = checked.value;
        });

        var variant = variants.find(function (v) {
          return v.options.every(function (opt, i) { return opt === selected[i]; });
        });

        product.querySelectorAll('[data-variant-id]').forEach(function (input) {
          input.value = variant ? variant.id : '';
        });

        if (addBtn) {
          addBtn.disabled = !variant || !variant.available;
          if (!variant) addBtn.textContent = addBtn.dataset.unavailable;
          else addBtn.textContent = variant.available ? addBtn.dataset.addLabel : addBtn.dataset.soldOut;
        }

        if (!variant) return;

        var price = product.querySelector('[data-price]');
        if (price) price.innerHTML = variant.price;

        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());

        if (variant.media) {
          var fig = product.querySelector('[data-media-id="' + variant.media + '"]');
          if (fig && window.matchMedia('(max-width: 989px)').matches) {
            fig.parentElement.scrollTo({ left: fig.offsetLeft, behavior: 'smooth' });
          } else if (fig) {
            fig.parentElement.prepend(fig);
          }
        }
      });
    });
  }

  // Selects and cart quantity inputs that submit their form on change
  function initAutoSubmit() {
    var timer;
    document.addEventListener('change', function (e) {
      var el = e.target.closest('[data-auto-submit]');
      if (!el || !el.form) return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (el.form.requestSubmit) el.form.requestSubmit();
        else el.form.submit();
      }, el.tagName === 'SELECT' ? 0 : 400);
    });
  }

  // <dialog> open/close (size guide)
  function initDialogs() {
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-dialog-open]');
      if (opener) {
        var dialog = document.getElementById(opener.dataset.dialogOpen);
        if (dialog && dialog.showModal) {
          dialog.showModal();
          document.documentElement.classList.add('dialog-open');
        }
        return;
      }
      var closer = e.target.closest('[data-dialog-close]');
      if (closer) {
        closer.closest('dialog').close();
        return;
      }
      // Click on the backdrop closes it
      if (e.target.tagName === 'DIALOG') e.target.close();
    });
    // 'close' doesn't bubble, so listen in the capture phase
    document.addEventListener('close', function (e) {
      if (e.target.tagName === 'DIALOG') document.documentElement.classList.remove('dialog-open');
    }, true);
  }

  // First visit: ask Denmark or rest of the world (sets the Shopify country and currency)
  function initRegion() {
    var dialog = document.querySelector('[data-region]');
    if (!dialog || !dialog.showModal) return;
    var KEY = 'region-chosen';
    var remember = function () { try { localStorage.setItem(KEY, '1'); } catch (e) {} };
    var seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch (e) { seen = true; }
    if (!seen) dialog.showModal();
    dialog.addEventListener('close', remember);
    dialog.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', remember);
    });
    // Changing the "ship to" country picks the rest-of-world option straight away
    var select = dialog.querySelector('select[name="country_code"]');
    if (select) select.addEventListener('change', function () { remember(); select.form.submit(); });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-region-open]')) dialog.showModal();
    });
  }

  function init() {
    initReveal();
    initHeader();
    initFlags();
    initJersey();
    initRegion();
    initVariantPicker();
    initAutoSubmit();
    initDialogs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Re-run when sections are edited in the theme editor
  document.addEventListener('shopify:section:load', function (e) {
    initReveal(e.target);
    initJersey(e.target);
    initVariantPicker(e.target);
  });
})();
