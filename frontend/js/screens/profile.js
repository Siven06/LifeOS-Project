const profileScreen = {
  render() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'U').charAt(0).toUpperCase();
    const currentLocale = i18n.getLocale();
    const currentCurrency = getCurrencyCode();

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold flex-1">${__('profile.title')}</h1>
          <a href="#/alerts" class="relative p-2 rounded-full hover:bg-surface-bright/20 text-on-surface-variant">
            <span class="material-symbols-outlined">notifications</span>
            <span id="profile-alert-badge" class="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 hidden">0</span>
          </a>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div class="glass-card rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
            <div class="absolute -top-20 -right-20 w-48 h-48 bg-primary-container/5 rounded-full blur-[80px]"></div>
            <div class="relative z-10">
              <div class="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center border-2 border-primary-container/30 ring-2 ring-primary-container/10">
                <span class="text-display font-bold text-primary-container">${escapeHtml(initials)}</span>
              </div>
              <h2 class="text-headline-md">${escapeHtml(user.name || __('common.loading'))}</h2>
              <p class="text-body-md text-on-surface-variant">${escapeHtml(user.email || '')}</p>
              <div class="flex items-center justify-center gap-2 mt-2">
                <span class="text-label-sm text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">verified</span> ${__('profile.verified')}
                </span>
                <span class="text-label-sm text-primary-container bg-primary-container/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">stars</span> ${__('profile.proAccount')}
                </span>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[20px]">manage_accounts</span>
              ${__('profile.accountSettings')}
            </h3>
            <div class="space-y-1">
              <button class="profile-link flex items-center gap-4 w-full p-3 rounded-xl hover:bg-surface-bright/10 transition-colors text-left" id="btn-personal-info">
                <div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-primary-container text-[20px]">person</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-body-md font-semibold">${__('profile.personalInfo')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.personalInfoDesc')}</p>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </button>
              <div class="profile-link flex items-center gap-4 w-full p-3 rounded-xl cursor-default">
                <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-secondary text-[20px]">security</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-body-md font-semibold">${__('profile.securityPrivacy')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.securityPrivacyDesc')}</p>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/50">chevron_right</span>
              </div>
              <div class="profile-link flex items-center gap-4 w-full p-3 rounded-xl cursor-default">
                <div class="w-10 h-10 rounded-full bg-tertiary-fixed-dim/10 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">account_balance</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-body-md font-semibold">${__('profile.connectedBanks')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.connectedBanksDesc', { count: '3' })}</p>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/50">chevron_right</span>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[20px]">settings_suggest</span>
              ${__('profile.preferences')}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-body-md font-semibold">${__('profile.defaultCurrency')}</p>
                  <div class="flex gap-2 mt-2">
                    ${['USD', 'EUR', 'GBP', 'COP'].map(c => `
                      <button class="currency-btn px-3 py-1.5 rounded-lg text-label-sm transition-all border ${c === currentCurrency ? 'bg-primary-container/20 text-primary-container border-primary-container/30' : 'bg-surface-container-highest text-on-surface-variant border-white/10 hover:bg-surface-container'}" data-currency="${c}">${c}</button>
                    `).join('')}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-body-md font-semibold">${__('profile.language')}</p>
                  <p class="text-label-sm text-on-surface-variant">${currentLocale === 'es' ? 'Español' : 'English (US)'}</p>
                </div>
                <button id="btn-change-lang" class="text-label-sm text-primary-container hover:underline">${__('profile.change')}</button>
              </div>
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-body-md font-semibold">${__('profile.theme')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.themeDark')}</p>
                </div>
                <button class="w-14 h-7 rounded-full bg-primary-container relative pointer-events-none">
                  <div class="w-5 h-5 rounded-full bg-on-primary absolute top-1 right-1 shadow-sm"></div>
                </button>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[20px]">notifications_active</span>
              ${__('profile.smartAlerts')}
            </h3>
            <div class="space-y-4">
              <label class="flex items-center justify-between py-2 cursor-pointer">
                <div class="min-w-0 flex-1">
                  <p class="text-body-md font-semibold">${__('profile.spendingAlerts')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.spendingAlertsDesc')}</p>
                </div>
                <div class="toggle checked w-12 h-6 rounded-full bg-primary-container relative flex-shrink-0 ml-3">
                  <div class="w-4 h-4 rounded-full bg-on-primary absolute top-1 right-1 shadow-sm transition-all"></div>
                </div>
              </label>
              <label class="flex items-center justify-between py-2 cursor-pointer">
                <div class="min-w-0 flex-1">
                  <p class="text-body-md font-semibold">${__('profile.weeklyReports')}</p>
                  <p class="text-label-sm text-on-surface-variant">${__('profile.weeklyReportsDesc')}</p>
                </div>
                <div class="toggle w-12 h-6 rounded-full bg-surface-container-highest relative flex-shrink-0 ml-3">
                  <div class="w-4 h-4 rounded-full bg-on-surface-variant absolute top-1 left-1 shadow-sm transition-all"></div>
                </div>
              </label>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 mb-6">
            <h3 class="text-headline-md mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[20px]">info</span>
              ${__('profile.supportLegal')}
            </h3>
            <div class="space-y-1">
              <a href="#" class="profile-link flex items-center gap-4 w-full p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-on-surface-variant text-[20px]">help</span>
                </div>
                <p class="text-body-md flex-1">${__('profile.helpCenter')}</p>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </a>
              <a href="#" class="profile-link flex items-center gap-4 w-full p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-on-surface-variant text-[20px]">gavel</span>
                </div>
                <p class="text-body-md flex-1">${__('profile.privacyPolicy')}</p>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </a>
              <a href="#" class="profile-link flex items-center gap-4 w-full p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-on-surface-variant text-[20px]">description</span>
                </div>
                <p class="text-body-md flex-1">${__('profile.termsOfService')}</p>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </a>
              <a href="#" class="profile-link flex items-center gap-4 w-full p-3 rounded-xl hover:bg-surface-bright/10 transition-colors">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-on-surface-variant text-[20px]">rate_review</span>
                </div>
                <p class="text-body-md flex-1">${__('profile.rateApp')}</p>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </a>
            </div>
          </div>

          <button id="btn-logout" class="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-3 text-error hover:bg-surface-container-higher transition-colors mb-3">
            <span class="material-symbols-outlined">logout</span>
            <span class="text-body-md font-semibold">${__('profile.signOut')}</span>
          </button>
          <button id="btn-delete-account" class="w-full text-center text-label-sm text-error/60 hover:text-error py-3 transition-colors">
            ${__('profile.deleteAccount')}
          </button>
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
            <a href="#/profile" class="flex flex-col items-center justify-center flex-1 gap-0.5 text-primary-fixed-dim font-bold transition-all nav-link relative group" data-route="/profile">
              <div class="relative flex flex-col items-center">
                <div class="w-10 h-6 flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/5">
                  <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1">person</span>
                </div>
                <span class="text-[10px] leading-none font-semibold tracking-wide">${__('nav.profile')}</span>
              </div>
              <div class="absolute -top-px left-1/4 right-1/4 h-[3px] bg-primary-container rounded-full nav-indicator opacity-100"></div>
            </a>
          </div>
        </nav>
      </div>
    `;

    this.bindEvents();
    this.loadAlertCount();
  },

  bindEvents() {
    document.getElementById('btn-edit-profile')?.addEventListener('click', () => this.showEditModal());
    document.getElementById('btn-personal-info')?.addEventListener('click', () => this.showEditModal());

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.navigate('/login');
    });

    document.getElementById('btn-delete-account')?.addEventListener('click', () => {
      if (confirm(__('profile.deleteAccount') + '?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate('/login');
      }
    });

    document.getElementById('btn-change-lang')?.addEventListener('click', () => this.showLanguageModal());

    document.querySelectorAll('.currency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.currency;
        localStorage.setItem('currency', code);
        document.querySelectorAll('.currency-btn').forEach(b => {
          b.className = 'currency-btn px-3 py-1.5 rounded-lg text-label-sm transition-all border bg-surface-container-highest text-on-surface-variant border-white/10 hover:bg-surface-container';
        });
        btn.className = 'currency-btn px-3 py-1.5 rounded-lg text-label-sm transition-all border bg-primary-container/20 text-primary-container border-primary-container/30';
        this.render();
      });
    });

    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('checked');
        const isChecked = toggle.classList.contains('checked');
        const knob = toggle.querySelector('div');
        if (isChecked) {
          toggle.style.background = '';
          knob.className = 'w-4 h-4 rounded-full bg-on-primary absolute top-1 right-1 shadow-sm transition-all';
        } else {
          toggle.style.background = '';
          knob.className = 'w-4 h-4 rounded-full bg-on-surface-variant absolute top-1 left-1 shadow-sm transition-all';
        }
      });
    });

    document.getElementById('fab-add')?.addEventListener('click', () => transactionModal.show('create'));
  },

  async loadAlertCount() {
    try {
      const res = await api.alerts.count();
      const count = res.data || 0;
      const badge = document.getElementById('profile-alert-badge');
      if (badge && count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
      }
    } catch (err) {}
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
          <div>
            <label class="text-label-sm text-on-surface-variant mb-2 block">${__('profile.email')}</label>
            <input type="email" name="email" value="${escapeAttr(user.email || '')}" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" disabled/>
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
  },

  showLanguageModal() {
    const currentLocale = i18n.getLocale();
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-sm bg-surface-container border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 slide-up mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-headline-md">${__('profile.language')}</h3>
          <button id="modal-close" class="material-symbols-outlined p-2 hover:bg-surface-bright/20 rounded-full text-on-surface-variant">close</button>
        </div>
        <div class="flex gap-3" id="lang-selector">
          ${i18n.getLanguages().map(lang => `
            <button class="lang-opt flex-1 py-3 rounded-xl text-label-md font-semibold transition-all border ${lang.code === currentLocale ? 'bg-primary-container/20 text-primary-container border-primary-container/30' : 'bg-surface-container-highest text-on-surface-variant border-white/10 hover:bg-surface-container'}" data-lang="${lang.code}">
              ${lang.nativeLabel}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modal-backdrop').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-close').addEventListener('click', () => overlay.remove());

    overlay.querySelectorAll('.lang-opt').forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        if (lang === currentLocale) { overlay.remove(); return; }
        i18n.setLocale(lang);
        await i18n.load(lang);
        overlay.remove();
        this.render();
      });
    });
  }
};

router.add('/profile', () => profileScreen.render());
