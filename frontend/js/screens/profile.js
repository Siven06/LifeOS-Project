const profileScreen = {
  render() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'U').charAt(0).toUpperCase();
    const currentLocale = i18n.getLocale();

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold">${__('profile.title')}</h1>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="glass-card rounded-2xl p-6 mb-6 text-center">
            <div class="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center border-2 border-primary-container/30">
              <span class="text-display font-bold text-primary-container">${escapeHtml(initials)}</span>
            </div>
            <h2 class="text-headline-md">${escapeHtml(user.name || __('common.loading'))}</h2>
            <p class="text-body-md text-on-surface-variant">${escapeHtml(user.email || '')}</p>
            <button id="btn-edit-profile" class="mt-4 bg-primary-container/20 text-primary-container text-label-sm px-5 py-2 rounded-full hover:bg-primary-container/30 transition-all">
              ${__('profile.editProfile')}
            </button>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4">${__('profile.accountDetails')}</h3>
            <div class="space-y-4">
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">${__('profile.name')}</label>
                <p class="text-body-md font-semibold">${escapeHtml(user.name || '-')}</p>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">${__('profile.email')}</label>
                <p class="text-body-md font-semibold">${escapeHtml(user.email || '-')}</p>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">${__('profile.userId')}</label>
                <p class="text-body-md text-on-surface-variant truncate">${user.userId || '-'}</p>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4">${__('profile.language')}</h3>
            <div class="flex gap-3" id="language-selector">
              ${i18n.getLanguages().map(lang => `
                <button class="lang-btn flex-1 py-3 rounded-xl text-label-md font-semibold transition-all border ${lang.code === currentLocale ? 'bg-primary-container/20 text-primary-container border-primary-container/30' : 'bg-surface-container-highest text-on-surface-variant border-white/10 hover:bg-surface-container'}" data-lang="${lang.code}">
                  ${lang.nativeLabel}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4">${__('profile.quickLinks')}</h3>
            <div class="space-y-2">
              <a href="#/goals" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <span class="material-symbols-outlined text-secondary">flag</span>
                <span class="text-body-md">${__('profile.savingsGoals')}</span>
                <span class="material-symbols-outlined ml-auto text-on-surface-variant">chevron_right</span>
              </a>
              <a href="#/budgets" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <span class="material-symbols-outlined text-primary-container">account_balance_wallet</span>
                <span class="text-body-md">${__('profile.budgets')}</span>
                <span class="material-symbols-outlined ml-auto text-on-surface-variant">chevron_right</span>
              </a>
            </div>
          </div>

          <button id="btn-logout" class="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-3 text-error hover:bg-surface-container-highest transition-colors">
            <span class="material-symbols-outlined">logout</span>
            <span class="text-body-md font-semibold">${__('profile.signOut')}</span>
          </button>
        </main>
      </div>
    `;

    document.getElementById('btn-edit-profile')?.addEventListener('click', () => this.showEditModal());
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.navigate('/login');
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        if (lang === currentLocale) return;
        i18n.setLocale(lang);
        await i18n.load(lang);
        this.render();
      });
    });
  },

  showEditModal() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${__('profile.editProfile')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <form id="profile-form" class="space-y-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('profile.name')}</label>
            <input type="text" name="name" value="${escapeAttr(user.name || '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" required/>
          </div>
          <p id="profile-error" class="text-error text-label-sm hidden"></p>
          <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md">${__('profile.saveChanges')}</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const errorEl = overlay.querySelector('#profile-error');
        errorEl.classList.add('hidden');
        const res = await api.users.updateProfile({ name: form.name.value });
        const updatedUser = res.data || { ...user, name: form.name.value };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        overlay.remove();
        toast.success(__('profile.profileUpdated'));
        this.render();
      } catch (err) {
        const errorEl = overlay.querySelector('#profile-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};

router.add('/profile', () => profileScreen.render());
