const goalsScreen = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold">${__('goals.title')}</h1>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-headline-md">${__('goals.savingsGoals')}</h2>
            <button id="btn-add-goal" class="bg-primary-container text-on-primary px-4 py-2 rounded-xl text-label-md flex items-center gap-2 hover:brightness-110 transition-all">
              <span class="material-symbols-outlined text-[18px]">add</span> ${__('goals.addGoal')}
            </button>
          </div>
          <div id="goals-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center justify-center py-12 md:col-span-2">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>
        </main>
      </div>
    `;

    document.getElementById('btn-add-goal')?.addEventListener('click', () => this.showGoalModal());
    await this.loadGoals();
  },

  async loadGoals() {
    const list = document.getElementById('goals-list');
    try {
      const res = await api.goals.list();
      const goals = res.data;

      if (goals.length === 0) {
        list.innerHTML = `
          <div class="glass-card rounded-2xl p-8 text-center md:col-span-2">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">flag</span>
            <p class="text-body-md text-on-surface-variant">${__('goals.noGoals')}</p>
            <p class="text-label-sm text-on-surface-variant mt-1">${__('goals.noGoalsHint')}</p>
          </div>`;
        return;
      }

      list.innerHTML = goals.map(g => `
        <div class="glass-card rounded-2xl p-6 flex flex-col items-center text-center slide-up">
          <div class="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle class="text-white/5" cx="64" cy="64" fill="transparent" r="54" stroke="currentColor" stroke-width="8"/>
              <circle class="transition-all duration-1000 ease-out" cx="64" cy="64" fill="transparent" r="54" stroke="${escapeHtml(g.color || '#7000ff')}" stroke-dasharray="${2 * Math.PI * 54}" stroke-dashoffset="${2 * Math.PI * 54 * (1 - g.progressPercent / 100)}" stroke-width="8" stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold" style="color: ${escapeHtml(g.color || '#7000ff')}">${g.progressPercent}%</span>
            </div>
          </div>
          <h3 class="text-headline-md mb-1">${escapeHtml(g.title)}</h3>
          <p class="text-label-sm text-on-surface-variant">${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)}</p>
          <div class="flex gap-2 mt-4 w-full">
            <button class="btn-update-goal flex-1 bg-primary-container/20 text-primary-container text-label-sm py-2 rounded-lg hover:bg-primary-container/30 transition-all" data-id="${escapeAttr(g.id)}">${__('goals.update')}</button>
            <button class="btn-delete-goal text-error text-label-sm py-2 px-3 rounded-lg hover:bg-error/10 transition-all" data-id="${escapeAttr(g.id)}">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.btn-update-goal').forEach(btn => {
        btn.addEventListener('click', () => this.showProgressModal(btn.dataset.id));
      });
      list.querySelectorAll('.btn-delete-goal').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(__('goals.deleteConfirm'))) return;
          try {
            await api.goals.delete(btn.dataset.id);
            toast.success(__('goals.goalDeleted'));
            this.loadGoals();
          } catch (err) {
            toast.error(__('goals.failedToDelete', { message: err.message }));
          }
        });
      });
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12 md:col-span-2">${__('goals.failedToLoad')}</p>`;
    }
  },

  showGoalModal() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${__('goals.newGoal')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <form id="goal-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('goals.titleField')}</label>
            <input type="text" name="title" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('goals.titlePlaceholder')}" required/>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('goals.targetAmount')}</label>
            <input type="number" name="targetAmount" step="0.01" min="0.01" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="100000" required/>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('goals.color')}</label>
            <div class="flex gap-3" id="color-picker">
              ${['#7000ff', '#00f5ff', '#00e676', '#ff6b6b', '#ffa726', '#42a5f5'].map(c =>
                `<button type="button" class="color-opt w-10 h-10 rounded-full border-2 ${c === '#7000ff' ? 'border-white' : 'border-transparent'} transition-all" style="background:${c}" data-color="${c}"></button>`
              ).join('')}
            </div>
          </div>
          <p id="goal-error" class="text-error text-label-sm hidden"></p>
          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">${__('goals.createGoal')}</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    let selectedColor = '#7000ff';
    overlay.querySelectorAll('.color-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('.color-opt').forEach(b => b.className = 'color-opt w-10 h-10 rounded-full border-2 border-transparent transition-all');
        btn.className = 'color-opt w-10 h-10 rounded-full border-2 border-white transition-all';
        selectedColor = btn.dataset.color;
      });
    });

    overlay.querySelector('#goal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const errorEl = overlay.querySelector('#goal-error');
        errorEl.classList.add('hidden');
        await api.goals.create({
          title: form.title.value,
          targetAmount: parseFloat(form.targetAmount.value),
          icon: 'savings',
          color: selectedColor
        });
        overlay.remove();
        toast.success(__('goals.goalCreated'));
        this.loadGoals();
      } catch (err) {
        const errorEl = overlay.querySelector('#goal-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  },

  showProgressModal(goalId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${__('goals.updateProgress')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <form id="progress-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('goals.currentAmount')}</label>
            <input type="number" name="amount" step="0.01" min="0" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('goals.progressPlaceholder')}" required/>
          </div>
          <p id="progress-error" class="text-error text-label-sm hidden"></p>
          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">${__('goals.update')}</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#progress-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const errorEl = overlay.querySelector('#progress-error');
        errorEl.classList.add('hidden');
        await api.goals.updateProgress(goalId, parseFloat(form.amount.value));
        overlay.remove();
        this.loadGoals();
      } catch (err) {
        const errorEl = overlay.querySelector('#progress-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};

router.add('/goals', () => goalsScreen.render());
