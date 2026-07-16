(async function() {
  await i18n.init();

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate('/login');
  }

  router.add('/login', () => authScreen.render());
  router.add('/register', () => authScreen.render());
  router.add('/', () => dashboardScreen.render());
  router.add('/transactions', () => transactionsScreen.render());
  router.add('/budgets', () => budgetsScreen.render());
  router.add('/goals', () => goalsScreen.render());
  router.add('/profile', () => profileScreen.render());

  router.start();
})();
