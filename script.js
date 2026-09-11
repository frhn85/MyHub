document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  const dockItems = document.querySelectorAll('.dock-item');
  const viewPages = document.querySelectorAll('.view-page');
  const headerTitle = document.getElementById('header-title');

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const title = item.getAttribute('data-title');

      // Update active state in dock bar
      dockItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Switch active view page
      viewPages.forEach(page => {
        if (page.id === targetId) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      // Update header title
      if (headerTitle) {
        headerTitle.textContent = title;
      }
    });
  });
});
