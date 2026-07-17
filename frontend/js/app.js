(async function() {
  await i18n.init();

  router.add('/login', () => authScreen.render());
  router.add('/register', () => authScreen.render());
  router.add('/', () => dashboardScreen.render());
  router.add('/transactions', () => transactionsScreen.render());
  router.add('/budgets', () => budgetsScreen.render());
  router.add('/goals', () => goalsScreen.render());
  router.add('/debts', () => debtsScreen.render());
  router.add('/alerts', () => alertsScreen.render());
  router.add('/profile', () => profileScreen.render());

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate('/login');
  }

  router.start();
})();
