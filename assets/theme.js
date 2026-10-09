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

  // Blurred black header once the page scrolls
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var drawer = header.querySelector('[data-drawer]');
    if (drawer) {
      drawer.addEventListener('toggle', function () {
        document.documentElement.classList.toggle('drawer-open', drawer.open);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.open) {
          drawer.open = false;
          drawer.querySelector('summary').focus();
        }
      });
    }
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

  function init() {
    initReveal();
    initHeader();
    initVariantPicker();
    initAutoSubmit();
    initDialogs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Re-run when sections are edited in the theme editor
  document.addEventListener('shopify:section:load', function (e) {
    initReveal(e.target);
    initVariantPicker(e.target);
  });
})();
