document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

(function () {
  // Reveal elements as they enter the viewport
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Language switch. English text lives in the HTML; Danish is defined here.
  var da = {
    'meta.title': '99WRLDWIDE | Kommer snart',
    'hero.soon': 'Kommer snart',
    'hero.meta': 'København',
    'drop.label': 'Første drop',
    'drop.title': '99-trøjen',
    'drop.p1': 'En sort fodboldtrøje med nålestriber, polokrave, tre hvide knapper og tre striber på hvert ærme.',
    'drop.p2': '99-emblemet sidder på brystet. På ryggen står NINETY over et stort 99.',
    'drop.p3': 'Laves på bestilling. Sendes fra EU.',
    'follow.title': 'Vær først i køen',
    'follow.p': 'Følg os på Instagram for udgivelsesdatoen.',
    'footer.part': ', en del af 99'
  };

  var en = { 'meta.title': document.title };
  var nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach(function (el) { en[el.dataset.i18n] = el.textContent; });

  var btn = document.getElementById('lang');
  var current = 'en';

  function setLang(lang) {
    var dict = lang === 'da' ? da : en;
    nodes.forEach(function (el) { el.textContent = dict[el.dataset.i18n]; });
    document.title = dict['meta.title'];
    document.documentElement.lang = lang;
    btn.textContent = lang === 'da' ? 'EN' : 'DA';
    btn.setAttribute('aria-label', lang === 'da' ? 'Switch to English' : 'Skift til dansk');
    current = lang;
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  btn.addEventListener('click', function () {
    setLang(current === 'da' ? 'en' : 'da');
  });

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'da' || (!saved && /^da\b/.test(navigator.language || ''))) setLang('da');
})();
