const budgetsScreen = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold">Budgets</h1>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-headline-md">Monthly Budgets</h2>
            <button id="btn-add-budget" class="bg-primary-container text-on-primary px-4 py-2 rounded-xl text-label-md flex items-center gap-2 hover:brightness-110 transition-all">
              <span class="material-symbols-outlined text-[18px]">add</span> Add Budget
            </button>
          </div>
          <div id="budgets-list" class="space-y-4">
            <div class="flex items-center justify-center py-12">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>
        </main>
      </div>
    `;

    document.getElementById('btn-add-budget')?.addEventListener('click', () => this.showBudgetModal());

    await this.loadBudgets();
  },

  async loadBudgets() {
    const list = document.getElementById('budgets-list');
    try {
      const res = await api.budgets.list();
      const budgets = res.data;

      if (budgets.length === 0) {
        list.innerHTML = `
          <div class="glass-card rounded-2xl p-8 text-center">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">account_balance_wallet</span>
            <p class="text-body-md text-on-surface-variant">No budgets set for this month</p>
            <p class="text-label-sm text-on-surface-variant mt-1">Create a budget to track your spending</p>
          </div>`;
        return;
      }

      list.innerHTML = budgets.map(b => `
        <div class="glass-card rounded-2xl p-5 slide-up">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full ${b.usagePercent > 80 ? 'bg-error/10 text-error' : 'bg-primary-container/10 text-primary-container'} flex items-center justify-center">
                <span class="material-symbols-outlined">${this.getCategoryIcon(b.category)}</span>
              </div>
              <div>
                <p class="text-body-md font-semibold">${b.category.charAt(0) + b.category.slice(1).toLowerCase()}</p>
                <p class="text-label-sm text-on-surface-variant">$${Number(b.spentAmount).toLocaleString()} / $${Number(b.limitAmount).toLocaleString()}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-body-md font-bold ${b.usagePercent > 80 ? 'text-error' : b.usagePercent > 50 ? 'text-secondary' : 'text-tertiary-fixed-dim'}">${b.usagePercent}%</p>
              <p class="text-label-sm text-on-surface-variant">${b.usagePercent > 80 ? 'Over limit!' : 'Remaining: $' + Number(b.remainingAmount).toLocaleString()}</p>
            </div>
          </div>
          <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700 ${b.usagePercent > 80 ? 'bg-error' : b.usagePercent > 50 ? 'bg-secondary' : 'bg-tertiary-fixed-dim'}" style="width:${b.usagePercent}%"></div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12">Failed to load budgets</p>`;
    }
  },

  getCategoryIcon(category) {
    const icons = {
      SALARY: 'payments', FREELANCE: 'work', INVESTMENT: 'trending_up',
      FOOD: 'restaurant', TRANSPORT: 'directions_car', SHOPPING: 'shopping_bag',
      ENTERTAINMENT: 'theater_comedy', BILLS: 'receipt_long', HEALTH: 'favorite',
      EDUCATION: 'school', OTHER: 'more_horiz'
    };
    return icons[category] || 'more_horiz';
  },

  showBudgetModal() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">New Budget</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <form id="budget-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Category</label>
            <select name="category" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required>
              <option value="">Select category</option>
              ${['FOOD', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH', 'EDUCATION', 'OTHER'].map(c =>
                `<option value="${c}">${c.charAt(0) + c.slice(1).toLowerCase()}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Monthly Limit ($)</label>
            <input type="number" name="limitAmount" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="500.00" required/>
          </div>
          <p id="budget-error" class="text-error text-label-sm hidden"></p>
          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">Create Budget</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#budget-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const errorEl = overlay.querySelector('#budget-error');
        errorEl.classList.add('hidden');
        await api.budgets.create({ category: form.category.value, limitAmount: parseFloat(form.limitAmount.value) });
        overlay.remove();
        toast.success('Budget created');
        this.loadBudgets();
      } catch (err) {
        const errorEl = overlay.querySelector('#budget-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};

router.add('/budgets', () => budgetsScreen.render());
