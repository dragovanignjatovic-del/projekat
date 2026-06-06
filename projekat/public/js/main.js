document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  initSearch();

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});
