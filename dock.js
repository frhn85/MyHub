/* MyHub Dock — React Bits inspired magnification */
(function () {
  const dock = document.querySelector('.bottom-nav');
  if (!dock) return;

  const items = [...dock.querySelectorAll('a')];
  const page = location.pathname.split('/').pop() || 'index.html';
  const activeMap = {
    'index.html': 'home',
    'quick-access.html': 'quick',
    'finance.html': 'finance',
    'settings.html': 'settings'
  };
  const active = activeMap[page];
  if (active) {
    items.forEach(item => item.classList.toggle('active', item.dataset.nav === active));
  }

  const supportsPointer = window.matchMedia('(pointer:fine)').matches;
  if (!supportsPointer) return;

  dock.addEventListener('pointermove', function (event) {
    const rect = dock.getBoundingClientRect();
    const x = event.clientX;
    const maxDistance = 125;

    items.forEach(item => {
      const r = item.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const distance = Math.abs(x - center);
      const influence = Math.max(0, 1 - distance / maxDistance);
      const scale = 1 + influence * 0.28;
      const lift = influence * -7;
      item.style.setProperty('--dock-scale', scale.toFixed(3));
      item.style.setProperty('--dock-lift', lift.toFixed(2) + 'px');
    });
  });

  dock.addEventListener('pointerleave', function () {
    items.forEach(item => {
      item.style.setProperty('--dock-scale', '1');
      item.style.setProperty('--dock-lift', '0px');
    });
  });
})();
