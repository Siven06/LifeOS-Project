const budgetsScreen = {
  async render() {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold flex-1">${__('budgets.title')}</h1>
          <a href="#/alerts" class="relative p-2 rounded-full hover:bg-surface-bright/20 text-on-surface-variant">
            <span class="material-symbols-outlined">notifications</span>
            <span id="budget-alert-badge" class="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 hidden">0</span>
          </a>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-headline-md font-semibold">${__('budgets.overview')}</h2>
          </div>

          <div class="flex gap-3 mb-6 overflow-x-auto scrollbar-hide" id="summary-cards">
            <div class="glass-card rounded-xl p-4 min-w-[130px] flex-1">
              <p class="text-label-sm text-on-surface-variant mb-1">${__('budgets.totalBudget')}</p>
              <p class="text-body-md font-bold tabular-nums" id="total-budget">$0</p>
            </div>
            <div class="glass-card rounded-xl p-4 min-w-[130px] flex-1">
              <p class="text-label-sm text-on-surface-variant mb-1">${__('budgets.totalSpent')}</p>
              <p class="text-body-md font-bold tabular-nums text-secondary" id="total-spent">$0</p>
            </div>
            <div class="glass-card rounded-xl p-4 min-w-[130px] flex-1">
              <p class="text-label-sm text-on-surface-variant mb-1">${__('budgets.budgetHealth')}</p>
              <p class="text-body-md font-bold" id="budget-health">--</p>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <h3 class="text-headline-md font-semibold">${__('budgets.monthlyBudgets')}</h3>
            <button id="btn-add-budget" class="bg-primary-container text-on-primary px-4 py-2 rounded-xl text-label-md flex items-center gap-2 hover:brightness-110 transition-all">
              <span class="material-symbols-outlined text-[18px]">add</span> ${__('budgets.addBudget')}
            </button>
          </div>

          <div id="budgets-list" class="space-y-3">
            <div class="flex items-center justify-center py-12">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>

          <div id="spending-distribution" class="mt-8 hidden">
            <div class="flex items-center gap-3 mb-4">
              <h3 class="text-headline-md font-semibold">${__('budgets.spendingDistribution')}</h3>
              <div class="flex-1 h-px bg-white/5"></div>
            </div>
            <div class="glass-card rounded-xl p-5" id="distribution-chart"></div>
          </div>

          <div id="smart-alerts" class="mt-8 hidden">
            <div class="flex items-center gap-3 mb-4">
              <span class="material-symbols-outlined text-primary-container">bolt</span>
              <h3 class="text-headline-md font-semibold flex-1">${__('budgets.smartAlerts')}</h3>
            </div>
            <div class="space-y-3" id="alerts-container"></div>
            <button class="w-full mt-3 bg-surface-container text-on-surface-variant text-label-md py-3 rounded-xl border border-white/10 hover:bg-surface-container-high transition-all">${__('budgets.configureNotifications')}</button>
          </div>
        </main>

        <nav class="bg-surface-container/90 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 h-[72px]">
          <div class="max-w-lg mx-auto h-full flex items-stretch px-2 relative">
            <a href="#/" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-on-surface-variant transition-all nav-link relative group" data-route="/">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]">home</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.home')}</span>
              </div>
              <div class="absolute -top-px left-1/3 right-1/3 h-[3px] bg-primary-container rounded-full nav-indicator opacity-0 transition-all duration-200"></div>
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
              <button id="fab-add-budget" class="absolute -top-5 bg-primary-container text-on-primary w-12 h-12 rounded-full center-button-glow active:scale-90 hover:scale-105 transition-all shadow-lg shadow-primary-container/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <a href="#/budgets" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-primary-fixed-dim font-bold transition-all nav-link relative group" data-route="/budgets">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1">account_balance_wallet</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.budget')}</span>
              </div>
              <div class="absolute -top-px left-1/4 right-1/4 h-[3px] bg-primary-container rounded-full nav-indicator opacity-100"></div>
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

    this.budgets = [];
    this.attachHeaderEvents();
    await this.loadBudgets();
    this.loadAlerts();
  },

  attachHeaderEvents() {
    document.getElementById('btn-add-budget')?.addEventListener('click', () => this.showBudgetModal('create'));
    document.getElementById('fab-add-budget')?.addEventListener('click', () => this.showBudgetModal('create'));
  },

  async loadBudgets() {
    const list = document.getElementById('budgets-list');
    try {
      const res = await api.budgets.list();
      this.budgets = res.data || [];
      this.renderBudgets();
      this.renderDistribution();
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12">${__('budgets.failedToLoad')}</p>`;
    }
  },

  renderBudgets() {
    const list = document.getElementById('budgets-list');
    const budgets = this.budgets;

    if (budgets.length === 0) {
      list.innerHTML = `
        <div class="glass-card rounded-2xl p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-surface-container-highest/50 flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant">account_balance_wallet</span>
          </div>
          <p class="text-body-md text-on-surface-variant">${__('budgets.noBudgets')}</p>
          <p class="text-label-sm text-on-surface-variant mt-1 mb-4">${__('budgets.noBudgetsHint')}</p>
          <button class="bg-primary-container text-on-primary px-5 py-2 rounded-full text-label-sm hover:brightness-110 transition-all inline-flex items-center gap-1" onclick="budgetsScreen.showBudgetModal('create')">
            <span class="material-symbols-outlined text-[16px]">add</span> ${__('budgets.addBudget')}
          </button>
        </div>`;
      this.updateSummary();
      return;
    }

    list.innerHTML = budgets.map(b => this.renderBudgetCard(b)).join('');

    this.updateSummary();
    this.attachBudgetEvents();
  },

  renderBudgetCard(b) {
    const pct = b.usagePercent || 0;
    const barColor = pct > 80 ? 'bg-error' : pct > 50 ? 'bg-secondary' : 'bg-tertiary-fixed-dim';
    const iconColor = pct > 80 ? 'bg-error/10 text-error' : 'bg-primary-container/10 text-primary-container';

    return `
      <div class="glass-card rounded-xl p-5 slide-up budget-card" data-id="${escapeAttr(b.id)}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-11 h-11 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-[20px]">${budgetCatIcon(b.category)}</span>
            </div>
            <div class="min-w-0">
              <p class="text-body-md font-semibold truncate">${tc(b.category)}</p>
              <p class="text-label-sm text-on-surface-variant">${formatCurrency(b.spentAmount)} / ${formatCurrency(b.limitAmount)}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-3">
            <p class="text-body-md font-bold tabular-nums ${pct > 80 ? 'text-error' : pct > 50 ? 'text-secondary' : 'text-tertiary-fixed-dim'}">${pct}% ${__('budgets.used')}</p>
          </div>
        </div>
        <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-3">
          <div class="h-full rounded-full transition-all duration-700 ${barColor}" style="width:${pct}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-label-sm text-on-surface-variant">${pct > 80 ? __('budgets.overLimit') : __('budgets.remaining', { amount: formatCurrency(b.remainingAmount) })}</span>
          <button class="edit-limit-btn text-label-sm text-primary-container hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">edit</span> ${__('budgets.editLimit')}
          </button>
        </div>
      </div>`;
  },

  attachBudgetEvents() {
    document.querySelectorAll('.edit-limit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.budget-card');
        const id = card?.dataset.id;
        const budget = this.budgets.find(b => b.id === id);
        if (budget) this.showBudgetModal('edit', budget);
      });
    });
  },

  updateSummary() {
    const budgets = this.budgets;
    const totalBudget = budgets.reduce((s, b) => s + Number(b.limitAmount), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spentAmount), 0);
    const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    document.getElementById('total-budget').textContent = formatCurrency(totalBudget);
    document.getElementById('total-spent').textContent = formatCurrency(totalSpent);

    const healthEl = document.getElementById('budget-health');
    if (budgets.length === 0) {
      healthEl.textContent = '--';
    } else if (overallPct > 80) {
      healthEl.innerHTML = `<span class="text-error flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">warning</span> ${__('budgets.overspent')}</span>`;
    } else if (overallPct > 50) {
      healthEl.innerHTML = `<span class="text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">trending_up</span> ${__('budgets.atRisk')}</span>`;
    } else {
      healthEl.innerHTML = `<span class="text-tertiary-fixed-dim flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">check_circle</span> ${__('budgets.onTrack')}</span>`;
    }
  },

  renderDistribution() {
    const section = document.getElementById('spending-distribution');
    const chart = document.getElementById('distribution-chart');
    const budgets = this.budgets;

    if (budgets.length === 0) return;

    const maxVal = Math.max(...budgets.map(b => Number(b.limitAmount)), 1);

    section.classList.remove('hidden');
    chart.innerHTML = `
      <div class="flex items-center gap-4 mb-5">
        <div class="flex items-center gap-2 text-label-sm">
          <div class="w-3 h-3 rounded bg-primary-container/60"></div>
          <span class="text-on-surface-variant">${__('budgets.actual')}</span>
        </div>
        <div class="flex items-center gap-2 text-label-sm">
          <div class="w-3 h-3 rounded bg-white/20"></div>
          <span class="text-on-surface-variant">${__('budgets.planned')}</span>
        </div>
      </div>
      <div class="space-y-4">
        ${budgets.map(b => {
          const limit = Number(b.limitAmount);
          const spent = Number(b.spentAmount);
          const limitH = Math.max((limit / maxVal) * 120, 8);
          const spentH = Math.max((spent / maxVal) * 120, 4);
          return `
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <div class="flex items-center gap-2 min-w-0">
                <span class="material-symbols-outlined text-on-surface-variant text-[16px]">${budgetCatIcon(b.category)}</span>
                <span class="text-label-sm truncate">${tc(b.category)}</span>
              </div>
              <span class="text-label-sm text-on-surface-variant tabular-nums">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
            </div>
            <div class="flex items-end gap-1 h-[120px] items-end">
              <div class="flex-1 flex flex-col justify-end">
                <div class="w-full bg-primary-container/60 rounded-t-sm transition-all" style="height:${spentH}px"></div>
              </div>
              <div class="flex-1 flex flex-col justify-end">
                <div class="w-full bg-white/20 rounded-t-sm transition-all" style="height:${limitH}px"></div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
  },

  async loadAlerts() {
    try {
      const res = await api.alerts.list();
      const alerts = res.data || [];
      if (alerts.length === 0) return;

      const section = document.getElementById('smart-alerts');
      const container = document.getElementById('alerts-container');
      section.classList.remove('hidden');

      const badge = document.getElementById('budget-alert-badge');
      if (badge && alerts.length > 0) {
        badge.textContent = alerts.length;
        badge.classList.remove('hidden');
      }

      container.innerHTML = alerts.slice(0, 4).map(a => `
        <div class="glass-card rounded-xl p-4 slide-up alert-card" data-id="${escapeAttr(a.id)}">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full ${alertSeverityClass(a.severity)} flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[18px]">${alertIcon(a.type)}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-body-md font-semibold">${escapeHtml(a.title)}</p>
              <p class="text-label-sm text-on-surface-variant mt-0.5">${escapeHtml(a.message)}</p>
              ${a.actionLabel ? `<button class="mt-2 text-label-sm text-primary-container hover:underline">${escapeHtml(a.actionLabel)}</button>` : ''}
            </div>
            <button class="dismiss-alert material-symbols-outlined text-on-surface-variant/50 hover:text-on-surface-variant text-[18px] p-1 rounded-full hover:bg-white/5">close</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.dismiss-alert').forEach(btn => {
        btn.addEventListener('click', async () => {
          const card = btn.closest('.alert-card');
          const id = card?.dataset.id;
          if (!id) return;
          try {
            await api.alerts.dismiss(id);
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'translateX(20px)';
            setTimeout(() => card.remove(), 300);
          } catch (err) {}
        });
      });
    } catch (err) {}
  },

  showBudgetModal(mode = 'create', budget = null) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${mode === 'create' ? __('budgets.newBudget') : __('budgets.editBudget')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <form id="budget-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('budgets.category')}</label>
            <select name="category" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" ${mode === 'edit' ? 'disabled' : 'required'}>
              <option value="">${__('budgets.selectCategory')}</option>
              ${['FOOD', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH', 'EDUCATION', 'OTHER'].map(c =>
                `<option value="${c}" ${budget?.category === c ? 'selected' : ''}>${tc(c)}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('budgets.monthlyLimit')}</label>
            <input type="number" name="limitAmount" step="0.01" min="0.01" value="${budget?.limitAmount || ''}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="500.00" required/>
          </div>
          ${mode === 'edit' ? `
          <button type="button" id="btn-delete-budget" class="w-full text-error text-label-sm py-3 flex items-center justify-center gap-2 hover:bg-error/10 rounded-xl transition-all">
            <span class="material-symbols-outlined text-[18px]">delete</span> ${__('transactions.delete')}
          </button>` : ''}
          <p id="budget-error" class="text-error text-label-sm hidden"></p>
          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">
            ${mode === 'create' ? __('budgets.createBudget') : __('budgets.editBudget')}
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    if (mode === 'edit' && budget) {
      overlay.querySelector('#btn-delete-budget')?.addEventListener('click', async () => {
        if (!confirm(__('budgets.deleteConfirm'))) return;
        try {
          await api.budgets.delete(budget.id);
          toast.success(__('budgets.budgetDeleted'));
          overlay.remove();
          await this.loadBudgets();
        } catch (err) {
          toast.error(__('budgets.failedToDelete'));
        }
      });
    }

    overlay.querySelector('#budget-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const errorEl = overlay.querySelector('#budget-error');
        errorEl.classList.add('hidden');

        const data = {
          category: form.category.value,
          limitAmount: parseFloat(form.limitAmount.value)
        };

        if (mode === 'create') {
          await api.budgets.create(data);
          toast.success(__('budgets.budgetCreated'));
        } else {
          await api.budgets.update(budget.id, data);
          toast.success(__('budgets.budgetUpdated'));
        }

        overlay.remove();
        await this.loadBudgets();
      } catch (err) {
        const errorEl = overlay.querySelector('#budget-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};

router.add('/budgets', () => budgetsScreen.render());

function budgetCatIcon(category) {
  const icons = {
    FOOD: 'restaurant', TRANSPORT: 'directions_car', SHOPPING: 'shopping_bag',
    ENTERTAINMENT: 'theater_comedy', BILLS: 'receipt_long', HEALTH: 'favorite',
    EDUCATION: 'school', SALARY: 'payments', FREELANCE: 'work',
    INVESTMENT: 'trending_up', OTHER: 'more_horiz'
  };
  return icons[category] || 'more_horiz';
}

function alertIcon(type) {
  const icons = {
    BUDGET_OVERSPENT: 'warning', GOAL_MILESTONE: 'savings',
    SUBSCRIPTION_RENEWAL: 'event_repeat', PATTERN_DETECTED: 'search_check',
    LOW_BALANCE: 'account_balance', BILL_DUE: 'payments'
  };
  return icons[type] || 'notifications';
}

function alertSeverityClass(severity) {
  const classes = {
    WARNING: 'bg-secondary/10 text-secondary',
    DANGER: 'bg-error/10 text-error',
    SUCCESS: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim',
    INFO: 'bg-primary-container/10 text-primary-container'
  };
  return classes[severity] || 'bg-primary-container/10 text-primary-container';
}
