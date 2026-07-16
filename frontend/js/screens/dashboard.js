const dashboardScreen = {
  async render() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'U').charAt(0).toUpperCase();

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-5 h-16 sticky top-0 z-50">
          <div class="flex items-center gap-3">
            <img src="images/logo_lifeos.png" class="w-10 h-10" alt="LifeOS Logo">
            <span class="text-headline-md font-semibold text-primary-fixed-dim">${__('app.shortName')}</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#/alerts" class="relative p-2 rounded-full hover:bg-surface-bright/20 text-on-surface-variant">
              <span class="material-symbols-outlined">notifications</span>
              <span id="alert-badge" class="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 hidden">0</span>
            </a>
            <a href="#/profile" class="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center hover:brightness-110 transition-all">
              <span class="text-label-md font-bold text-primary-container">${escapeHtml(initials)}</span>
            </a>
          </div>
        </header>

        <main class="relative z-10 max-w-7xl mx-auto px-5 pt-8 pb-32">
          <div id="dashboard-loading" class="flex items-center justify-center py-20">
            <span class="material-symbols-outlined animate-spin text-primary-container text-4xl">sync</span>
          </div>
          <div id="dashboard-content" class="hidden grid grid-cols-1 md:grid-cols-12 gap-6"></div>
        </main>

        <nav class="bg-surface-container/90 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 flex justify-around items-end pb-4 pt-2 px-4 h-20">
          <a href="#/" class="flex flex-col items-center justify-center text-primary-fixed-dim font-bold transition-all nav-link" data-route="/">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">home</span>
            <span class="text-label-sm">${__('nav.home')}</span>
          </a>
          <a href="#/transactions" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/transactions">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="text-label-sm">${__('nav.history')}</span>
          </a>
          <button id="fab-add" class="mb-4 bg-primary-container text-on-primary p-4 rounded-full center-button-glow active:scale-90 transition-all">
            <span class="material-symbols-outlined text-3xl">add</span>
          </button>
          <a href="#/budgets" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/budgets">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <span class="text-label-sm">${__('nav.budget')}</span>
          </a>
          <a href="#/profile" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/profile">
            <span class="material-symbols-outlined">person</span>
            <span class="text-label-sm">${__('nav.profile')}</span>
          </a>
        </nav>
      </div>
    `;

    try {
      const [dashRes, alertsRes] = await Promise.all([
        api.dashboard.get(),
        api.alerts.count()
      ]);
      this.renderContent(dashRes.data, alertsRes.data);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        router.navigate('/login');
        return;
      }
      const loading = document.getElementById('dashboard-loading');
      if (loading) {
        loading.innerHTML = `<div class="text-center py-12">
          <span class="material-symbols-outlined text-5xl text-error mb-4">error</span>
          <p class="text-body-md text-on-surface-variant mb-2">${__('dashboard.failedToLoad')}</p>
          <p class="text-label-sm text-error">${escapeHtml(err.message)}</p>
          <button onclick="location.reload()" class="mt-4 bg-primary-container text-on-primary px-5 py-2 rounded-full text-label-sm hover:brightness-110 transition-all">${__('dashboard.retry')}</button>
        </div>`;
      }
    }
  },

  renderContent(data, alertsCount) {
    const content = document.getElementById('dashboard-content');
    document.getElementById('dashboard-loading').classList.add('hidden');
    content.classList.remove('hidden');
    const badge = document.getElementById('alert-badge');
    if (badge && alertsCount > 0) {
      badge.textContent = alertsCount;
      badge.classList.remove('hidden');
    }

    const recentHtml = (data.recentTransactions || []).map(t => `
      <div class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-bright/10 transition-colors cursor-pointer">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim' : 'bg-secondary-fixed/10 text-secondary'}">
            <span class="material-symbols-outlined">${t.type === 'INCOME' ? 'payments' : 'shopping_bag'}</span>
          </div>
          <div>
            <p class="text-body-md font-semibold">${escapeHtml(t.description)}</p>
            <p class="text-label-sm text-on-surface-variant">${tc(t.category)} · ${escapeHtml(t.date)}</p>
          </div>
        </div>
        <p class="text-body-md font-bold ${t.type === 'INCOME' ? 'text-tertiary-fixed-dim' : ''}">
          ${t.type === 'INCOME' ? '+' : '-'}$${Number(t.amount).toLocaleString()}
        </p>
      </div>
    `).join('');

    content.innerHTML = `
      <section class="md:col-span-8">
        <div class="glass-card rounded-2xl p-6 h-full relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px]"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-8">
              <div>
                <p class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">${__('dashboard.totalBalance')}</p>
                <h1 class="text-display text-primary">$${Number(data.totalBalance).toLocaleString()}</h1>
              </div>
              <div class="bg-primary-container/20 text-primary-container px-3 py-1 rounded-full text-label-sm flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">trending_up</span>
                ${data.incomeChangePercent}%
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-auto">
              <button id="btn-add-income" class="bg-primary-container text-on-primary text-label-md py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                <span class="material-symbols-outlined">add_circle</span>
                ${__('dashboard.addIncome')}
              </button>
              <button id="btn-add-expense" class="bg-surface-container-highest/50 border border-white/10 text-on-surface text-label-md py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all active:scale-95">
                <span class="material-symbols-outlined">remove_circle</span>
                ${__('dashboard.addExpense')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="md:col-span-4">
        <div class="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
          <p class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-6">${__('dashboard.thisMonth')}</p>
          <div class="grid grid-cols-2 gap-6 w-full">
            <div>
              <p class="text-label-sm text-tertiary-fixed-dim mb-1">${__('dashboard.income')}</p>
              <p class="text-numerical-lg text-tertiary-fixed-dim">$${Number(data.monthlyIncome).toLocaleString()}</p>
            </div>
            <div>
              <p class="text-label-sm text-on-surface-variant mb-1">${__('dashboard.expenses')}</p>
              <p class="text-numerical-lg text-on-surface">$${Number(data.monthlyExpenses).toLocaleString()}</p>
            </div>
          </div>
          <a href="#/goals" class="mt-6 text-label-md text-primary-container hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">flag</span> ${__('dashboard.viewGoals')}
          </a>
        </div>
      </section>

      <section class="md:col-span-12 lg:col-span-7">
        <div class="glass-card rounded-2xl p-6">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-headline-md">${__('dashboard.analytics')}</h3>
          </div>
          <div class="h-64 w-full flex items-end justify-between gap-2 px-2" id="chart-bars">
            ${(() => {
              const chart = data.monthlyChart || [];
              const maxVal = Math.max(...chart.map(x => Math.max(Number(x.income), Number(x.expense))), 1);
              return chart.map(m => {
                const incH = (Number(m.income) / maxVal) * 200;
                const expH = (Number(m.expense) / maxVal) * 200;
                return `
                  <div class="flex-1 flex flex-col items-end justify-end gap-1">
                    <div class="w-full bg-secondary-container/40 rounded-t-lg transition-all hover:bg-secondary-container" style="height:${Math.max(expH, 4)}px"></div>
                    <div class="w-full bg-primary-container/40 rounded-t-lg transition-all hover:bg-primary-container" style="height:${Math.max(incH, 4)}px"></div>
                    <span class="text-[10px] text-on-surface-variant uppercase mt-2">${escapeHtml(m.month)}</span>
                  </div>
                `;
              }).join('');
            })()}
          </div>
        </div>
      </section>

      <section class="md:col-span-12 lg:col-span-5">
        <div class="glass-card rounded-2xl p-6 h-full">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-headline-md">${__('dashboard.activity')}</h3>
            <a href="#/transactions" class="text-primary-container text-label-sm hover:underline">${__('dashboard.viewAll')}</a>
          </div>
          <div class="space-y-4">
            ${recentHtml || '<p class="text-on-surface-variant text-body-md text-center py-8">' + __('dashboard.noTransactions') + '</p>'}
          </div>
        </div>
      </section>
    `;

    document.getElementById('fab-add')?.addEventListener('click', () => transactionModal.show('create'));
    document.getElementById('btn-add-income')?.addEventListener('click', () => transactionModal.show('create', null, 'INCOME'));
    document.getElementById('btn-add-expense')?.addEventListener('click', () => transactionModal.show('create', null, 'EXPENSE'));
  }
};

router.add('/', () => dashboardScreen.render());
