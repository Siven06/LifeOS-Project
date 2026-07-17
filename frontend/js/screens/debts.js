const debtsScreen = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-5 h-16 sticky top-0 z-50">
          <div class="flex items-center gap-3">
            <img src="images/logo_lifeos.png" class="w-10 h-10" alt="LifeOS Logo">
            <span class="text-headline-md font-semibold text-primary-fixed-dim">${__('app.shortName')}</span>
          </div>
          <a href="#/profile" class="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center hover:brightness-110 transition-all">
            <span class="text-label-md font-bold text-primary-container">${(JSON.parse(localStorage.getItem('user') || '{}').name || 'U').charAt(0).toUpperCase()}</span>
          </a>
        </header>

        <main class="relative z-10 max-w-7xl mx-auto px-5 pt-8 pb-32">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-display text-primary">${__('debts.title')}</h1>
            <button id="btn-add-debt" class="bg-primary-container text-on-primary font-semibold px-5 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2">
              <span class="material-symbols-outlined">add</span>
              ${__('debts.addDebt')}
            </button>
          </div>

          <!-- Debt Summary Cards -->
          <div id="debt-summary" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"></div>

          <!-- Debts List -->
          <div id="debts-loading" class="flex items-center justify-center py-20">
            <span class="material-symbols-outlined animate-spin text-primary-container text-4xl">sync</span>
          </div>
          <div id="debts-content" class="hidden">
            <div class="space-y-4" id="debts-list"></div>
          </div>

          <div id="debts-empty" class="hidden text-center py-16">
            <span class="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4 block">credit_card_off</span>
            <p class="text-body-lg text-on-surface-variant mb-2">${__('debts.noDebts')}</p>
            <p class="text-label-md text-on-surface-variant/70">${__('debts.noDebtsHint')}</p>
            <button id="btn-first-debt" class="mt-6 bg-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all">${__('debts.addDebt')}</button>
          </div>
        </main>

        <nav class="bg-surface-container/90 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 flex justify-around items-end pb-4 pt-2 px-4 h-20">
          <a href="#/" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/">
            <span class="material-symbols-outlined">home</span>
            <span class="text-label-sm">${__('nav.home')}</span>
          </a>
          <a href="#/transactions" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/transactions">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="text-label-sm">${__('nav.history')}</span>
          </a>
          <button id="fab-add" class="mb-4 bg-primary-container text-on-primary p-4 rounded-full center-button-glow active:scale-90 transition-all">
            <span class="material-symbols-outlined text-3xl">add</span>
          </button>
          <a href="#/debts" class="flex flex-col items-center justify-center text-primary-fixed-dim font-bold transition-all nav-link" data-route="/debts">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">credit_score</span>
            <span class="text-label-sm">${__('nav.debts')}</span>
          </a>
          <a href="#/profile" class="flex flex-col items-center justify-center text-on-surface-variant transition-all nav-link" data-route="/profile">
            <span class="material-symbols-outlined">person</span>
            <span class="text-label-sm">${__('nav.profile')}</span>
          </a>
        </nav>
      </div>
    `;

    await this.loadDebts();
    this.bindEvents();
  },

  async loadDebts() {
    const loading = document.getElementById('debts-loading');
    const content = document.getElementById('debts-content');
    const empty = document.getElementById('debts-empty');
    const list = document.getElementById('debts-list');
    const summary = document.getElementById('debt-summary');

    try {
      const [debtsRes, summaryRes] = await Promise.all([
        api.debts.list(),
        api.debts.getSummary()
      ]);

      console.log('Debts response:', debtsRes);
      console.log('Summary response:', summaryRes);

      const debts = debtsRes.data || [];
      const summaryData = summaryRes.data || {};

      loading.classList.add('hidden');
      content.classList.remove('hidden');

      if (debts.length === 0) {
        content.classList.add('hidden');
        empty.classList.remove('hidden');
        summary.innerHTML = '';
        return;
      }

      empty.classList.add('hidden');

      // Render summary cards
      this.renderSummary(summaryData);

      // Render debts list
      list.innerHTML = debts.map(debt => this.renderDebtCard(debt)).join('');

      // Bind debt card events
      document.querySelectorAll('.debt-card').forEach(card => {
        const id = card.dataset.id;
        card.querySelector('.btn-edit')?.addEventListener('click', () => this.openDebtModal('edit', id));
        card.querySelector('.btn-delete')?.addEventListener('click', () => this.deleteDebt(id));
        card.querySelector('.btn-pay')?.addEventListener('click', () => this.openPaymentModal(id));
      });

    } catch (err) {
      console.error('Error loading debts:', err);
      loading.innerHTML = `<div class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-error mb-4">error</span>
        <p class="text-body-md text-on-surface-variant mb-2">${__('debts.failedToLoad')}</p>
        <p class="text-label-sm text-error">${escapeHtml(err.message)}</p>
        <button onclick="location.reload()" class="mt-4 bg-primary-container text-on-primary px-5 py-2 rounded-full text-label-sm hover:brightness-110 transition-all">${__('common.retry')}</button>
      </div>`;
    }
  },

  renderSummary(summary) {
    const container = document.getElementById('debt-summary');
    const cards = [
      { label: __('debts.totalDebt'), value: formatCurrency(summary.totalDebt || 0), icon: 'credit_card', color: 'text-secondary' },
      { label: __('debts.monthlyPayment'), value: formatCurrency(summary.monthlyPayment || 0), icon: 'schedule', color: 'text-warning' },
      { label: __('debts.activeDebts'), value: summary.activeDebtsCount || 0, icon: 'list_alt', color: 'text-primary-container' },
      { label: __('debts.nextPayment'), value: summary.nextPaymentName ? `${formatCurrency(summary.nextPaymentAmount || 0)} · ${summary.nextPaymentName}` : '—', icon: 'event', color: 'text-tertiary-fixed-dim' }
    ];

    container.innerHTML = cards.map(c => `
      <div class="glass-card rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-2">
          <span class="material-symbols-outlined ${c.color} text-2xl">${c.icon}</span>
          <p class="text-label-sm text-on-surface-variant">${c.label}</p>
        </div>
        <p class="text-numerical-lg font-bold">${c.value}</p>
      </div>
    `).join('');
  },

  renderDebtCard(debt) {
    // Ensure amounts are numbers
    const totalAmount = Number(debt.totalAmount) || 0;
    const remainingAmount = Number(debt.remainingAmount) || 0;
    const monthlyPayment = Number(debt.monthlyPayment) || 0;
    const progress = totalAmount > 0 ? ((totalAmount - remainingAmount) / totalAmount * 100).toFixed(1) : 0;
    
    // Fallback for formatCurrency if not available
    const fmt = (typeof formatCurrency === 'function') ? formatCurrency : (v) => '$' + Number(v || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    const statusClass = debt.status === 'ACTIVE' ? 'text-tertiary-fixed-dim' : 
                        debt.status === 'PAID_OFF' ? 'text-tertiary-fixed-dim' : 
                        debt.status === 'OVERDUE' ? 'text-secondary' : 'text-on-surface-variant';
    const statusLabel = __('debts.statuses.' + debt.status);
    const typeLabel = __('debts.types.' + debt.type);
    const categoryLabel = __('debts.categories.' + debt.category);

    return `
      <div class="debt-card glass-card rounded-2xl p-5" data-id="${debt.id}">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-body-lg font-semibold truncate">${escapeHtml(debt.name)}</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass}">${statusLabel}</span>
            </div>
            <p class="text-label-sm text-on-surface-variant">${typeLabel} · ${categoryLabel}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-pay bg-primary-container text-on-primary px-3 py-2 rounded-lg text-label-sm font-medium hover:brightness-110 transition-all flex items-center gap-1">
              <span class="material-symbols-outlined text-[18px]">payments</span>
              ${__('debts.makePayment')}
            </button>
            <button class="btn-edit p-2 rounded-lg hover:bg-surface-bright/20 text-on-surface-variant transition-all">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-delete p-2 rounded-lg hover:bg-surface-bright/20 text-on-surface-variant transition-all">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-label-sm text-on-surface-variant mb-1">${__('debts.remaining')}</p>
            <p class="text-numerical-lg font-bold">${fmt(remainingAmount)}</p>
          </div>
          <div>
            <p class="text-label-sm text-on-surface-variant mb-1">${__('debts.monthlyPayment')}</p>
            <p class="text-numerical-lg font-bold">${fmt(monthlyPayment)}</p>
          </div>
        </div>

        <div class="mb-3">
          <div class="flex justify-between text-label-sm mb-1">
            <span class="text-on-surface-variant">${__('debts.progress')}</span>
            <span class="font-medium">${progress}%</span>
          </div>
          <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div class="h-full bg-primary-container rounded-full transition-all" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="flex items-center justify-between text-label-sm text-on-surface-variant pt-3 border-t border-white/10">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">event</span>
            ${__('debts.dueDay')}: ${debt.dueDay}
          </span>
          <span>${debt.endDate ? `Fin: ${debt.endDate}` : ''}</span>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('btn-add-debt')?.addEventListener('click', () => this.openDebtModal('create'));
    document.getElementById('btn-first-debt')?.addEventListener('click', () => this.openDebtModal('create'));
    document.getElementById('fab-add')?.addEventListener('click', () => transactionModal.show('create'));
  },

  openDebtModal(mode = 'create', debtId = null) {
    const isEdit = mode === 'edit';
    let debt = null;

    if (isEdit) {
      // Find debt in the list
      const cards = document.querySelectorAll('.debt-card');
      cards.forEach(card => {
        if (card.dataset.id === debtId) {
          // We'll fetch from API instead
        }
      });
    }

    if (isEdit) {
      this.fetchAndOpenDebtModal(debtId);
      return;
    }

    this.showDebtModal({});
  },

  async fetchAndOpenDebtModal(debtId) {
    try {
      const res = await api.debts.get(debtId);
      this.showDebtModal(res.data, true);
    } catch (err) {
      toast.error(err.message);
    }
  },

  showDebtModal(debt = {}, isEdit = false) {
    const typeOptions = [
      { value: 'PERSONAL_LOAN', label: __('debts.types.PERSONAL_LOAN') },
      { value: 'MORTGAGE', label: __('debts.types.MORTGAGE') },
      { value: 'AUTO_LOAN', label: __('debts.types.AUTO_LOAN') },
      { value: 'STUDENT_LOAN', label: __('debts.types.STUDENT_LOAN') },
      { value: 'CREDIT_CARD', label: __('debts.types.CREDIT_CARD') },
      { value: 'FAMILY_FRIEND', label: __('debts.types.FAMILY_FRIEND') },
      { value: 'OTHER', label: __('debts.types.OTHER') }
    ];

    const categoryOptions = [
      { value: 'HOUSING', label: __('debts.categories.HOUSING') },
      { value: 'TRANSPORTATION', label: __('debts.categories.TRANSPORTATION') },
      { value: 'EDUCATION', label: __('debts.categories.EDUCATION') },
      { value: 'PERSONAL', label: __('debts.categories.PERSONAL') },
      { value: 'MEDICAL', label: __('debts.categories.MEDICAL') },
      { value: 'BUSINESS', label: __('debts.categories.BUSINESS') },
      { value: 'OTHER', label: __('debts.categories.OTHER') }
    ];

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up max-h-[90vh] overflow-y-auto mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${isEdit ? __('debts.edit') : __('debts.addDebt')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>

        <form id="debt-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.name')}</label>
            <input type="text" name="name" value="${escapeAttr(debt.name ?? '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('debts.namePlaceholder')}" required/>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.type')}</label>
            <select name="type" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required>
              ${typeOptions.map(o => `<option value="${o.value}" ${debt.type === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.totalAmount')}</label>
              <input type="number" name="totalAmount" value="${debt.totalAmount ?? ''}" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="0.00" required/>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.monthlyPayment')}</label>
              <input type="number" name="monthlyPayment" value="${debt.monthlyPayment ?? ''}" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="0.00" required/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.dueDay')}</label>
              <input type="number" name="dueDay" value="${debt.dueDay ?? ''}" min="1" max="31" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="1-31" required/>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.interestRate')}</label>
              <input type="number" name="interestRate" value="${debt.interestRate ?? ''}" step="0.01" min="0" max="100" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="0"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.startDate')}</label>
              <input type="date" name="startDate" value="${escapeAttr(debt.startDate || new Date().toISOString().split('T')[0])}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required/>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.endDate')}</label>
              <input type="date" name="endDate" value="${escapeAttr(debt.endDate ?? '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md"/>
            </div>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.category')}</label>
            <select name="category" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required>
              ${categoryOptions.map(o => `<option value="${o.value}" ${debt.category === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.note')}</label>
            <input type="text" name="note" value="${escapeAttr(debt.note ?? '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('debts.notePlaceholder')}"/>
          </div>

          <p id="modal-error" class="text-error text-label-sm hidden"></p>

          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">
            ${isEdit ? __('debts.debtUpdated') : __('debts.createDebt')}
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#debt-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const errorEl = overlay.querySelector('#modal-error');
      errorEl.classList.add('hidden');

      // Validate required fields
      if (!form.name.value || !form.type.value || !form.totalAmount.value || 
          !form.monthlyPayment.value || !form.dueDay.value || !form.startDate.value || !form.category.value) {
        errorEl.textContent = 'Por favor completa todos los campos obligatorios';
        errorEl.classList.remove('hidden');
        return;
      }

      const data = {
        name: form.name.value,
        type: form.type.value,
        totalAmount: parseFloat(form.totalAmount.value),
        monthlyPayment: parseFloat(form.monthlyPayment.value),
        dueDay: parseInt(form.dueDay.value),
        startDate: form.startDate.value,
        endDate: form.endDate.value || null,
        interestRate: form.interestRate.value ? parseFloat(form.interestRate.value) : null,
        category: form.category.value,
        note: form.note.value || null
      };

      console.log('Creating/updating debt:', data, 'isEdit:', isEdit);

      try {
        if (isEdit) {
          await api.debts.update(debt.id, data);
          toast.success(__('debts.debtUpdated'));
        } else {
          await api.debts.create(data);
          toast.success(__('debts.debtCreated'));
        }

        overlay.remove();
        await this.loadDebts();
      } catch (err) {
        console.error('Debt submission error:', err);
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  },

  openPaymentModal(debtId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up max-h-[90vh] overflow-y-auto mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${__('debts.makePayment')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>

        <form id="payment-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('debts.paymentAmount')}</label>
            <input type="number" name="amount" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="0.00" required autofocus/>
          </div>

          <p id="modal-error" class="text-error text-label-sm hidden"></p>

          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">
            ${__('debts.makePayment')}
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#payment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const errorEl = overlay.querySelector('#modal-error');
      errorEl.classList.add('hidden');

      const amount = parseFloat(form.amount.value);

      try {
        await api.debts.makePayment(debtId, amount);
        toast.success(__('debts.paymentSuccess'));
        overlay.remove();
        this.loadDebts();
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  },

  async deleteDebt(debtId) {
    if (!confirm(__('debts.deleteConfirm'))) return;

    try {
      await api.debts.delete(debtId);
      toast.success(__('debts.debtDeleted'));
      this.loadDebts();
    } catch (err) {
      toast.error(err.message);
    }
  }
};

router.add('/debts', () => debtsScreen.render());