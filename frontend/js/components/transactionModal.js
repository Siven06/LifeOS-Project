const transactionModal = {
  show(mode = 'create', transaction = null, defaultType = 'EXPENSE') {
    const isExpense = mode === 'create' ? defaultType === 'EXPENSE' : transaction?.type === 'EXPENSE';
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up max-h-[90vh] overflow-y-auto mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${mode === 'create' ? 'New Transaction' : 'Edit Transaction'}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>

        <form id="transaction-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Type</label>
            <div class="flex gap-2">
              <button type="button" class="type-btn flex-1 py-3 rounded-xl text-label-md font-semibold transition-all ${isExpense ? 'bg-secondary-container/20 text-secondary border border-secondary-container/30' : 'bg-surface-container-highest text-on-surface-variant border border-white/10'}" data-type="EXPENSE">
                <span class="material-symbols-outlined align-middle mr-1">remove_circle</span> Expense
              </button>
              <button type="button" class="type-btn flex-1 py-3 rounded-xl text-label-md font-semibold transition-all ${!isExpense ? 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim border border-tertiary-fixed-dim/30' : 'bg-surface-container-highest text-on-surface-variant border border-white/10'}" data-type="INCOME">
                <span class="material-symbols-outlined align-middle mr-1">add_circle</span> Income
              </button>
            </div>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Description</label>
            <input type="text" name="description" value="${escapeAttr(transaction?.description ?? '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="Transaction name" required/>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Amount ($)</label>
            <input type="number" name="amount" value="${transaction?.amount ?? ''}" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="0.00" required/>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Category</label>
            <select name="category" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required>
              <option value="">Select category</option>
              ${['SALARY', 'FREELANCE', 'INVESTMENT', 'FOOD', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH', 'EDUCATION', 'OTHER'].map(c =>
                `<option value="${c}" ${transaction?.category === c ? 'selected' : ''}>${c.charAt(0) + c.slice(1).toLowerCase()}</option>`
              ).join('')}
            </select>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Date</label>
            <input type="date" name="date" value="${escapeAttr(transaction?.date || new Date().toISOString().split('T')[0])}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md"/>
          </div>

          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">Note (optional)</label>
            <input type="text" name="note" value="${escapeAttr(transaction?.note ?? '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="Add a note"/>
          </div>

          <p id="modal-error" class="text-error text-label-sm hidden"></p>

          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">
            ${mode === 'create' ? 'Add Transaction' : 'Save Changes'}
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('.type-btn').forEach(b => {
          const t = b.dataset.type;
          b.className = `type-btn flex-1 py-3 rounded-xl text-label-md font-semibold transition-all bg-surface-container-highest text-on-surface-variant border border-white/10`;
        });
        const type = btn.dataset.type;
        btn.className = `type-btn flex-1 py-3 rounded-xl text-label-md font-semibold transition-all ${type === 'EXPENSE' ? 'bg-secondary-container/20 text-secondary border border-secondary-container/30' : 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim border border-tertiary-fixed-dim/30'}`;
      });
    });

    overlay.querySelector('#transaction-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const activeType = overlay.querySelector('.type-btn.bg-secondary-container\\/20, .type-btn.bg-tertiary-fixed-dim\\/20');
      const type = activeType ? activeType.dataset.type : (transaction?.type || 'EXPENSE');

      const data = {
        description: form.description.value,
        amount: parseFloat(form.amount.value),
        type: type,
        category: form.category.value,
        date: form.date.value || new Date().toISOString().split('T')[0],
        note: form.note.value || null
      };

      try {
        const errorEl = overlay.querySelector('#modal-error');
        errorEl.classList.add('hidden');

        if (mode === 'create') {
          await api.transactions.create(data);
          toast.success('Transaction added');
        } else {
          await api.transactions.update(transaction.id, data);
          toast.success('Transaction updated');
        }

        overlay.remove();
        router.resolve();
      } catch (err) {
        const errorEl = overlay.querySelector('#modal-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};
