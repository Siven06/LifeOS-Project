const dashboardScreen = {
  sections: [],

  registerSection(id, span, renderFn) {
    this.sections.push({ id, span, renderFn });
    return this;
  },

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

        <nav class="bg-surface-container/90 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 h-[72px]">
          <div class="max-w-lg mx-auto h-full flex items-stretch px-2 relative">
            <a href="#/" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-primary-fixed-dim font-bold transition-all nav-link relative group" data-route="/">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1">home</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.home')}</span>
              </div>
              <div class="absolute -top-px left-1/4 right-1/4 h-[3px] bg-primary-container rounded-full nav-indicator opacity-100"></div>
            </a>
            <a href="#/transactions" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-on-surface-variant transition-all nav-link relative group" data-route="/transactions">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.history')}</span>
              </div>
              <div class="absolute -top-px left-1/3 right-1/3 h-[3px] bg-primary-container rounded-full nav-indicator opacity-0 transition-all duration-200"></div>
            </a>
            <div class="flex items-center justify-center flex-[0.8] relative">
              <button id="fab-add" class="absolute -top-5 bg-primary-container text-on-primary w-12 h-12 rounded-full center-button-glow active:scale-90 hover:scale-105 transition-all shadow-lg shadow-primary-container/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <a href="#/budgets" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-on-surface-variant transition-all nav-link relative group" data-route="/budgets">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.budget')}</span>
              </div>
              <div class="absolute -top-px left-1/3 right-1/3 h-[3px] bg-primary-container rounded-full nav-indicator opacity-0 transition-all duration-200"></div>
            </a>
            <a href="#/debts" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-on-surface-variant transition-all nav-link relative group" data-route="/debts">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]">credit_score</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.debts')}</span>
              </div>
              <div class="absolute -top-px left-1/3 right-1/3 h-[3px] bg-primary-container rounded-full nav-indicator opacity-0 transition-all duration-200"></div>
            </a>
            <a href="#/profile" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-on-surface-variant transition-all nav-link relative group" data-route="/profile">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]">person</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.profile')}</span>
              </div>
              <div class="absolute -top-px left-1/3 right-1/3 h-[3px] bg-primary-container rounded-full nav-indicator opacity-0 transition-all duration-200"></div>
            </a>
          </div>
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

    content.innerHTML = this.sections.map(s =>
      `<section class="${s.span}">${s.renderFn(data)}</section>`
    ).join('');

    document.getElementById('fab-add')?.addEventListener('click', () => transactionModal.show('create'));
    document.getElementById('btn-add-income')?.addEventListener('click', () => transactionModal.show('create', null, 'INCOME'));
    document.getElementById('btn-add-expense')?.addEventListener('click', () => transactionModal.show('create', null, 'EXPENSE'));
  },

  sectionBalance(data) {
    return `
      <div class="glass-card rounded-2xl p-6 h-full relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px]"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-8">
            <div>
              <p class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">${__('dashboard.totalBalance')}</p>
              <h1 class="text-display text-primary">${formatCurrency(data.totalBalance)}</h1>
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
      </div>`;
  },

  sectionMonthly(data) {
    return `
      <div class="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
        <p class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-6">${__('dashboard.thisMonth')}</p>
        <div class="grid grid-cols-2 gap-6 w-full">
          <div>
            <p class="text-label-sm text-tertiary-fixed-dim mb-1">${__('dashboard.income')}</p>
            <p class="text-numerical-lg text-tertiary-fixed-dim">${formatCurrency(data.monthlyIncome)}</p>
          </div>
          <div>
            <p class="text-label-sm text-on-surface-variant mb-1">${__('dashboard.expenses')}</p>
            <p class="text-numerical-lg text-on-surface">${formatCurrency(data.monthlyExpenses)}</p>
          </div>
        </div>
        <a href="#/goals" class="mt-6 text-label-md text-primary-container hover:underline flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">flag</span> ${__('dashboard.viewGoals')}
        </a>
      </div>`;
  },

  sectionAnalytics(data) {
    const chart = data.monthlyChart || [];
    const maxVal = Math.max(...chart.map(x => Math.max(Number(x.income), Number(x.expense))), 1);
    const bars = chart.map(m => {
      const incH = (Number(m.income) / maxVal) * 200;
      const expH = (Number(m.expense) / maxVal) * 200;
      return `
        <div class="flex-1 flex flex-col items-end justify-end gap-1">
          <div class="w-full bg-secondary-container/40 rounded-t-lg transition-all hover:bg-secondary-container" style="height:${Math.max(expH, 4)}px"></div>
          <div class="w-full bg-primary-container/40 rounded-t-lg transition-all hover:bg-primary-container" style="height:${Math.max(incH, 4)}px"></div>
          <span class="text-[10px] text-on-surface-variant uppercase mt-2">${escapeHtml(m.month)}</span>
        </div>`;
    }).join('');

    return `
      <div class="glass-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-headline-md">${__('dashboard.analytics')}</h3>
        </div>
        <div class="h-64 w-full flex items-end justify-between gap-2 px-2">
          ${bars || `<p class="text-on-surface-variant text-body-md text-center w-full py-12">${__('dashboard.noData')}</p>`}
        </div>
      </div>`;
  },

  sectionActivity(data) {
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
          ${formatCurrencySign(t.amount, t.type)}
        </p>
      </div>
    `).join('');

    return `
      <div class="glass-card rounded-2xl p-6 h-full">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-headline-md">${__('dashboard.activity')}</h3>
          <a href="#/transactions" class="text-primary-container text-label-sm hover:underline">${__('dashboard.viewAll')}</a>
        </div>
        <div class="space-y-4">
          ${recentHtml || '<p class="text-on-surface-variant text-body-md text-center py-8">' + __('dashboard.noTransactions') + '</p>'}
        </div>
      </div>`;
  },

  sectionDebtsSummary(data) {
    const hasDebts = data.activeDebtsCount > 0;
    if (!hasDebts) {
      return `
        <div class="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-full bg-surface-container-highest/50 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-on-surface-variant text-3xl">credit_score</span>
          </div>
          <p class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">${__('debts.summary')}</p>
          <p class="text-body-md text-on-surface-variant mb-4">${__('debts.noDebts')}</p>
          <a href="#/debts" class="bg-primary-container text-on-primary px-5 py-2 rounded-full text-label-sm hover:brightness-110 transition-all flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">add</span> ${__('debts.addDebt')}
          </a>
        </div>`;
    }

    return `
      <div class="glass-card rounded-2xl p-6 h-full">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-headline-md">${__('debts.summary')}</h3>
          <a href="#/debts" class="text-primary-container text-label-sm hover:underline">${__('dashboard.viewAll')}</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="flex items-center gap-4 p-4 bg-surface-container-highest/50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-secondary">credit_score</span>
            </div>
            <div class="min-w-0">
              <p class="text-label-sm text-on-surface-variant truncate">${__('debts.totalDebt')}</p>
              <p class="text-body-md font-bold text-secondary">${formatCurrency(data.totalDebt)}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-surface-container-highest/50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-primary-container">payments</span>
            </div>
            <div class="min-w-0">
              <p class="text-label-sm text-on-surface-variant truncate">${__('debts.monthlyPayment')}</p>
              <p class="text-body-md font-bold text-primary-container">${formatCurrency(data.monthlyDebtPayment)}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-surface-container-highest/50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-tertiary-fixed-dim">fact_check</span>
            </div>
            <div class="min-w-0">
              <p class="text-label-sm text-on-surface-variant truncate">${__('debts.activeDebts')}</p>
              <p class="text-body-md font-bold text-tertiary-fixed-dim">${data.activeDebtsCount}</p>
            </div>
          </div>
        </div>
        ${data.nextDebtPaymentAmount > 0 ? `
        <div class="mt-4 flex items-center justify-between p-4 bg-primary-container/10 rounded-xl border border-primary-container/20">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary-container">event</span>
            <div>
              <p class="text-label-sm text-on-surface-variant">${__('debts.nextPayment')}</p>
              <p class="text-body-md font-bold text-primary-container">${formatCurrency(data.nextDebtPaymentAmount)}</p>
            </div>
          </div>
          <span class="text-label-sm text-on-surface-variant">${data.nextDebtPaymentDate ? new Date(data.nextDebtPaymentDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''}</span>
        </div>` : ''}
      </div>`;
  }
};

dashboardScreen
  .registerSection('balance', 'col-span-12 md:col-span-7', (d) => dashboardScreen.sectionBalance(d))
  .registerSection('monthly', 'col-span-12 md:col-span-5', (d) => dashboardScreen.sectionMonthly(d))
  .registerSection('analytics', 'col-span-12 md:col-span-7', (d) => dashboardScreen.sectionAnalytics(d))
  .registerSection('activity', 'col-span-12 md:col-span-5', (d) => dashboardScreen.sectionActivity(d))
  .registerSection('debts', 'col-span-12', (d) => dashboardScreen.sectionDebtsSummary(d));

router.add('/', () => dashboardScreen.render());
