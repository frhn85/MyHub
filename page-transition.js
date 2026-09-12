/* MyHub Page Transition — smooth top-to-bottom entrance */
(function () {
  document.documentElement.classList.add('myhub-transition-ready');

  function isInternal(link) {
    if (!link || !link.href) return false;
    if (link.target === '_blank' || link.hasAttribute('download')) return false;
    try {
      const url = new URL(link.href, location.href);
      return url.origin === location.origin && url.pathname.endsWith('.html');
    } catch (_) { return false; }
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!isInternal(link)) return;

    // Ignore same-page links.
    const target = new URL(link.href, location.href);
    if (target.pathname === location.pathname && target.search === location.search) return;

    event.preventDefault();
    document.body.classList.add('page-leaving');

    window.setTimeout(function () {
      window.location.href = link.href;
    }, 220);
  });
})();
