const transactionsScreen = {
  async render() {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold flex-1">${__('transactions.title')}</h1>
          <button id="btn-export" class="text-primary-container text-label-sm flex items-center gap-1 hover:underline">
            <span class="material-symbols-outlined text-[18px]">download</span> ${__('transactions.exportCsv')}
          </button>
          <button id="btn-export-pdf" class="text-primary-container text-label-sm flex items-center gap-1 hover:underline">
            <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span> ${__('transactions.exportPdf')}
          </button>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="relative mb-4">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
            <input id="tx-search" type="text" placeholder="${__('transactions.searchPlaceholder')}" class="w-full bg-surface-container border border-white/10 rounded-xl pl-12 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md"/>
          </div>

          <div class="flex gap-2 mb-2 overflow-x-auto scrollbar-hide" id="filter-tabs">
            <button class="filter-btn active px-4 py-2 rounded-full text-label-sm bg-primary-container text-on-primary" data-filter="">${__('transactions.all')}</button>
            <button class="filter-btn px-4 py-2 rounded-full text-label-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" data-filter="INCOME">${__('transactions.income')}</button>
            <button class="filter-btn px-4 py-2 rounded-full text-label-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" data-filter="EXPENSE">${__('transactions.expenses')}</button>
          </div>

          <div class="flex gap-2 mb-6 overflow-x-auto scrollbar-hide" id="category-tabs">
            ${['', 'FOOD', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH'].map(c =>
              `<button class="cat-filter px-3 py-1.5 rounded-full text-label-sm transition-colors ${!c ? 'bg-primary-container/20 text-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}" data-cat="${c}">${c ? tc(c) : __('transactions.all')}</button>`
            ).join('')}
          </div>

          <div id="transactions-list" class="space-y-1">
            <div class="flex items-center justify-center py-12">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>

          <div id="summary-section" class="mt-8 space-y-4 hidden"></div>
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
            <a href="#/transactions" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-primary-fixed-dim font-bold transition-all nav-link relative group" data-route="/transactions">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1">receipt_long</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.history')}</span>
              </div>
              <div class="absolute -top-px left-1/4 right-1/4 h-[3px] bg-primary-container rounded-full nav-indicator opacity-100"></div>
            </a>
            <div class="flex items-center justify-center flex-[0.8] relative">
              <button id="fab-add-tx" class="absolute -top-5 bg-primary-container text-on-primary w-12 h-12 rounded-full center-button-glow active:scale-90 hover:scale-105 transition-all shadow-lg shadow-primary-container/30 flex items-center justify-center">
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

    this.currentFilter = '';
    this.currentCategory = '';
    this.searchTerm = '';
    this.allTransactions = [];
    this.summaryData = null;

    await this.loadTransactions();
    this.loadSummary();

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.className = 'filter-btn px-4 py-2 rounded-full text-label-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors';
        });
        btn.className = 'filter-btn active px-4 py-2 rounded-full text-label-sm bg-primary-container text-on-primary';
        this.currentFilter = btn.dataset.filter;
        await this.loadTransactions();
      });
    });

    document.querySelectorAll('.cat-filter').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('.cat-filter').forEach(b => {
          b.className = 'cat-filter px-3 py-1.5 rounded-full text-label-sm transition-colors bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
        });
        btn.className = 'cat-filter px-3 py-1.5 rounded-full text-label-sm transition-colors bg-primary-container/20 text-primary-container';
        this.currentCategory = btn.dataset.cat;
        await this.loadTransactions();
      });
    });

    document.getElementById('tx-search')?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.renderTransactions();
    });

    document.getElementById('btn-export')?.addEventListener('click', () => this.exportCSV());
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => this.exportPDF());
    document.getElementById('fab-add-tx')?.addEventListener('click', () => transactionModal.show('create'));
  },

  async loadTransactions() {
    const list = document.getElementById('transactions-list');
    try {
      const params = {};
      if (this.currentFilter) params.type = this.currentFilter;
      const res = await api.transactions.list(params);
      this.allTransactions = res.data || [];
      this.renderTransactions();
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12">${__('transactions.failedToLoad')}</p>`;
    }
  },

  async loadSummary() {
    try {
      const res = await api.transactions.summary();
      this.summaryData = res.data;
      this.renderSummary();
    } catch (err) {
    }
  },

  renderTransactions() {
    const list = document.getElementById('transactions-list');
    let filtered = this.allTransactions || [];

    if (this.currentCategory) {
      filtered = filtered.filter(t => t.category === this.currentCategory);
    }
    if (this.searchTerm) {
      filtered = filtered.filter(t =>
        (t.description || '').toLowerCase().includes(this.searchTerm) ||
        (t.category || '').toLowerCase().includes(this.searchTerm) ||
        (t.note || '').toLowerCase().includes(this.searchTerm)
      );
    }

    if (filtered.length === 0) {
      list.innerHTML = `<p class="text-center text-on-surface-variant text-body-md py-12">${__('transactions.noTransactions')}</p>`;
      this.attachCardEvents();
      return;
    }

    const groups = this.groupByDate(filtered);
    list.innerHTML = groups.map(group => `
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-3 mt-2">
          <span class="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">${escapeHtml(group.label)}</span>
          <div class="flex-1 h-px bg-white/5"></div>
          <span class="text-label-sm text-on-surface-variant">${group.transactions.length} items</span>
        </div>
        <div class="space-y-2">
          ${group.transactions.map(t => this.renderTransactionCard(t)).join('')}
        </div>
      </div>
    `).join('');
    this.attachCardEvents();
  },

  groupByDate(transactions) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (d) => {
      const date = new Date(d + 'T00:00:00');
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const dateStr = date.toISOString().split('T')[0];

      if (dateStr === todayStr) return __('transactions.today');
      if (dateStr === yesterdayStr) return __('transactions.yesterday');

      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const groups = {};
    transactions.forEach(t => {
      const key = t.date || 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    return sortedKeys.map(key => ({
      label: formatDate(key),
      date: key,
      transactions: groups[key]
    }));
  },

  renderTransactionCard(t) {
    const catIcons = {
      FOOD: 'restaurant', TRANSPORT: 'directions_car', SHOPPING: 'shopping_bag',
      ENTERTAINMENT: 'movie', BILLS: 'receipt', HEALTH: 'local_hospital',
      SALARY: 'payments', FREELANCE: 'computer', INVESTMENT: 'trending_up',
      EDUCATION: 'school', OTHER: 'more_horiz'
    };
    const icon = catIcons[t.category] || (t.type === 'INCOME' ? 'payments' : 'shopping_bag');
    const isExpense = t.type === 'EXPENSE';
    const time = t.createdAt ? new Date(t.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';

    return `
      <div class="tx-card glass-card rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container/80 transition-all slide-up" data-id="${escapeAttr(t.id)}">
        <div class="flex items-center gap-4 min-w-0 flex-1">
          <div class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'INCOME' ? 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim' : 'bg-secondary/10 text-secondary'}">
            <span class="material-symbols-outlined text-[20px]">${icon}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-body-md font-semibold truncate">${escapeHtml(t.description)}</p>
              ${t.status === 'PENDING' ? '<span class="text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full flex-shrink-0">' + __('transactions.pending') + '</span>' : ''}
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-label-sm text-on-surface-variant">${tc(t.category)}</span>
              <span class="text-label-sm text-on-surface-variant/50">·</span>
              <span class="text-label-sm text-on-surface-variant">${escapeHtml(t.date)}</span>
              ${time ? `<span class="text-label-sm text-on-surface-variant/50">${escapeHtml(time)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-3">
          <p class="text-body-md font-bold tabular-nums ${t.type === 'INCOME' ? 'text-tertiary-fixed-dim' : ''}">
            ${formatCurrencySign(t.amount, t.type)}
          </p>
          <button class="tx-menu-btn material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface-variant p-1 rounded-full hover:bg-white/5 transition-all text-[18px]" data-id="${escapeAttr(t.id)}">more_vert</button>
        </div>
      </div>
    `;
  },

  renderSummary() {
    const section = document.getElementById('summary-section');
    const s = this.summaryData;
    if (!s) return;

    const changePercent = Number(s.expenseChangePercent || 0);
    const isLower = changePercent <= 0;
    const percentText = Math.abs(changePercent).toFixed(1);
    const trendText = isLower
      ? __('transactions.expensesLower').replace('{{percent}}', percentText)
      : __('transactions.expensesHigher').replace('{{percent}}', percentText);
    const trendIcon = isLower ? 'trending_down' : 'trending_up';
    const trendColor = isLower ? 'text-tertiary-fixed-dim' : 'text-error';

    const topCat = s.topCategory;
    const breakdown = s.categoryBreakdown || [];

    section.classList.remove('hidden');
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-4">
        <span class="text-headline-md font-semibold">${__('transactions.spendingSummary')}</span>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="glass-card rounded-xl p-4">
          <p class="text-label-sm text-on-surface-variant mb-1">${__('transactions.monthlyExpenses')}</p>
          <p class="text-body-md font-bold tabular-nums">${formatCurrency(s.monthlyExpenses || 0)}</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[14px] ${trendColor}">${trendIcon}</span>
            <span class="text-label-sm ${trendColor}">${trendText}</span>
          </div>
        </div>
        <div class="glass-card rounded-xl p-4">
          <p class="text-label-sm text-on-surface-variant mb-1">${__('transactions.monthlyIncome')}</p>
          <p class="text-body-md font-bold text-tertiary-fixed-dim tabular-nums">${formatCurrency(s.monthlyIncome || 0)}</p>
        </div>
      </div>

      ${topCat ? `
      <div class="glass-card rounded-xl p-4 mb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-secondary text-[20px]">${catIcon(topCat.category)}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-label-sm text-on-surface-variant">${__('transactions.topCategory')}</p>
            <p class="text-body-md font-semibold">${tc(topCat.category)}</p>
            <div class="w-full bg-white/5 rounded-full h-1.5 mt-1.5">
              <div class="bg-secondary h-1.5 rounded-full transition-all" style="width:${Math.min(topCat.percentage, 100)}%"></div>
            </div>
            <p class="text-label-sm text-on-surface-variant mt-0.5">${topCat.percentage.toFixed(1)}% ${__('transactions.ofTotalSpending')}</p>
          </div>
          <p class="text-body-md font-bold tabular-nums">${formatCurrency(topCat.total)}</p>
        </div>
      </div>` : ''}

      ${breakdown.length > 1 ? `
      <div class="glass-card rounded-xl p-4 mb-3">
        <p class="text-label-sm text-on-surface-variant mb-3">${__('transactions.all')} (${__('transactions.expenses')})</p>
        <div class="space-y-2.5">
          ${breakdown.map(c => `
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-surface-container-high/50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-on-surface-variant text-[16px]">${catIcon(c.category)}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-label-sm">${tc(c.category)}</span>
                <span class="text-label-sm text-on-surface-variant">${c.percentage.toFixed(1)}%</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1">
                <div class="bg-primary-container/60 h-1 rounded-full transition-all" style="width:${Math.min(c.percentage, 100)}%"></div>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>` : ''}

      <div class="glass-card rounded-xl p-4 bg-gradient-to-r from-primary-container/5 to-secondary/5 border border-primary-container/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-primary-container text-[20px]">insights</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-body-md font-semibold">${__('transactions.optimizeTitle')}</p>
            <p class="text-label-sm text-on-surface-variant">${__('transactions.optimizeDesc')}</p>
          </div>
          <button class="bg-primary-container/20 text-primary-container text-label-sm px-4 py-2 rounded-full hover:bg-primary-container/30 transition-all flex-shrink-0">${__('transactions.optimizeAction')}</button>
        </div>
      </div>
    `;
  },

  applyClientFilter() {
    this.renderTransactions();
  },

  attachCardEvents() {
    document.querySelectorAll('.tx-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.tx-menu-btn')) return;
        const id = card.dataset.id;
        const tx = this.allTransactions.find(t => t.id === id);
        if (tx) transactionModal.show('edit', tx);
      });
    });

    document.querySelectorAll('.tx-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.showContextMenu(btn, id);
      });
    });
  },

  showContextMenu(anchor, txId) {
    const existing = document.querySelector('.tx-context-menu');
    if (existing) existing.remove();

    const tx = this.allTransactions.find(t => t.id === txId);
    const rect = anchor.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.className = 'tx-context-menu fixed z-[200] bg-surface-container border border-white/10 rounded-xl p-1.5 shadow-elevated slide-up';
    menu.style.top = (rect.top - 80) + 'px';
    menu.style.right = (window.innerWidth - rect.right + 8) + 'px';
    menu.style.minWidth = '160px';

    menu.innerHTML = `
      <button class="ctx-item flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-label-sm text-on-surface hover:bg-white/5 transition-colors">
        <span class="material-symbols-outlined text-[18px]">edit</span> ${__('transactions.edit')}
      </button>
      <button class="ctx-item flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-label-sm text-error hover:bg-error/10 transition-colors">
        <span class="material-symbols-outlined text-[18px]">delete</span> ${__('transactions.delete')}
      </button>
    `;

    menu.querySelectorAll('.ctx-item')[0].addEventListener('click', () => {
      menu.remove();
      if (tx) transactionModal.show('edit', tx);
    });

    menu.querySelectorAll('.ctx-item')[1].addEventListener('click', async () => {
      menu.remove();
      if (!confirm(__('transactions.deleteConfirm'))) return;
      try {
        await api.transactions.delete(txId);
        toast.success(__('transactions.transactionDeleted'));
        await this.loadTransactions();
        this.loadSummary();
      } catch (err) {
        toast.error(__('transactions.failedToDelete'));
      }
    });

    document.body.appendChild(menu);
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  },

  exportCSV() {
    const txs = this.allTransactions || [];
    if (txs.length === 0) { toast.info(__('transactions.noDataExport')); return; }
    const rows = [__('transactions.csvHeaders').split(',')];
    txs.forEach(t => rows.push([t.date, t.type, t.category, `"${t.description}"`, t.amount, t.status || 'COMPLETED']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'LifeOS_transactions.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success(__('transactions.csvExported'));
  },

  exportPDF() {
    const txs = this.allTransactions || [];
    if (txs.length === 0) { toast.info(__('transactions.noDataExport')); return; }
    const printWin = window.open('', '_blank');
    printWin.document.write(`<html><head><title>LifeOS ${__('transactions.title')}</title><style>
      body { font-family: Inter, sans-serif; padding: 40px; background: #0A0A0B; color: #e5e2e3; }
      h1 { color: #00dce5; } table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #3a393a; color: #b9caca; font-size: 12px; text-transform: uppercase; }
      td { padding: 12px 8px; border-bottom: 1px solid #201f20; }
      .income { color: #00e475; } .expense { color: #ffb4ab; }
    </style></head><body><h1>LifeOS ${__('transactions.title')}</h1>
    <table><tr><th>${__('transactions.csvHeaders').split(',')[0]}</th><th>${__('transactions.csvHeaders').split(',')[1]}</th><th>${__('transactions.csvHeaders').split(',')[2]}</th><th>${__('transactions.csvHeaders').split(',')[3]}</th><th>${__('transactions.csvHeaders').split(',')[4]}</th></tr>`);
    txs.forEach(t => printWin.document.write(
      `<tr><td>${t.date}</td><td class="${t.type.toLowerCase()}">${t.type}</td><td>${t.category}</td><td>${escapeHtml(t.description)}</td><td class="${t.type.toLowerCase()}">${formatCurrencySign(t.amount, t.type)}</td></tr>`
    ));
    printWin.document.write('</table></body></html>');
    printWin.document.close();
    printWin.print();
    toast.success(__('transactions.pdfExported'));
  }
};

router.add('/transactions', () => transactionsScreen.render());

function catIcon(category) {
  const icons = {
    FOOD: 'restaurant', TRANSPORT: 'directions_car', SHOPPING: 'shopping_bag',
    ENTERTAINMENT: 'movie', BILLS: 'receipt', HEALTH: 'local_hospital',
    SALARY: 'payments', FREELANCE: 'computer', INVESTMENT: 'trending_up',
    EDUCATION: 'school', OTHER: 'more_horiz'
  };
  return icons[category] || 'receipt_long';
}
