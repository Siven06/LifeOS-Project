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

          <div id="transactions-list" class="space-y-3">
            <div class="flex items-center justify-center py-12">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>
        </main>
      </div>
    `;

    this.currentFilter = '';
    this.currentCategory = '';
    this.searchTerm = '';
    await this.loadTransactions();

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
      this.applyClientFilter();
    });

    document.getElementById('btn-export')?.addEventListener('click', () => this.exportCSV());
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => this.exportPDF());
  },

  async loadTransactions() {
    const list = document.getElementById('transactions-list');
    try {
      const params = {};
      if (this.currentFilter) params.type = this.currentFilter;
      const res = await api.transactions.list(params);
      this.allTransactions = res.data;
      this.applyClientFilter();
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12">${__('transactions.failedToLoad')}</p>`;
    }
  },

  applyClientFilter() {
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
      return;
    }

    list.innerHTML = filtered.map(t => `
      <div class="glass-card rounded-xl p-4 flex items-center justify-between slide-up">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim' : 'bg-secondary/10 text-secondary'}">
            <span class="material-symbols-outlined">${t.type === 'INCOME' ? 'payments' : 'shopping_bag'}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-body-md font-semibold">${escapeHtml(t.description)}</p>
              ${t.status === 'PENDING' ? '<span class="text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">' + __('transactions.pending') + '</span>' : ''}
            </div>
            <p class="text-label-sm text-on-surface-variant">${tc(t.category)} · ${escapeHtml(t.date)}</p>
          </div>
        </div>
        <p class="text-body-md font-bold ${t.type === 'INCOME' ? 'text-tertiary-fixed-dim' : ''}">
          ${t.type === 'INCOME' ? '+' : '-'}$${Number(t.amount).toLocaleString()}
        </p>
      </div>
    `).join('');
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
      `<tr><td>${t.date}</td><td class="${t.type.toLowerCase()}">${t.type}</td><td>${t.category}</td><td>${escapeHtml(t.description)}</td><td class="${t.type.toLowerCase()}">${t.type === 'INCOME' ? '+' : '-'}$${Number(t.amount).toLocaleString()}</td></tr>`
    ));
    printWin.document.write('</table></body></html>');
    printWin.document.close();
    printWin.print();
    toast.success(__('transactions.pdfExported'));
  }
};

router.add('/transactions', () => transactionsScreen.render());
