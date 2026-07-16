const alertsScreen = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-background pb-32">
        <header class="bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-5 h-16 sticky top-0 z-50 gap-4">
          <a href="#/" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-bright/20 rounded-full transition-colors">arrow_back</a>
          <h1 class="text-headline-md font-semibold flex-1">${__('alerts.title')}</h1>
          <button id="btn-dismiss-all" class="text-primary-container text-label-sm hover:underline">${__('alerts.dismissAll')}</button>
        </header>

        <main class="max-w-3xl mx-auto px-5 pt-6">
          <div id="alerts-list" class="space-y-4">
            <div class="flex items-center justify-center py-12">
              <span class="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
            </div>
          </div>
        </main>
      </div>
    `;

    document.getElementById('btn-dismiss-all')?.addEventListener('click', async () => {
      try {
        await api.alerts.dismissAll();
        toast.success(__('alerts.allDismissed'));
        this.loadAlerts();
      } catch (err) {
        toast.error(__('alerts.failedToDismissAll'));
      }
    });

    await this.loadAlerts();
  },

  async loadAlerts() {
    const list = document.getElementById('alerts-list');
    try {
      const res = await api.alerts.list();
      const alerts = res.data;

      if (alerts.length === 0) {
        list.innerHTML = `
          <div class="glass-card rounded-2xl p-8 text-center">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">notifications_off</span>
            <p class="text-body-md text-on-surface-variant">${__('alerts.noAlerts')}</p>
            <p class="text-label-sm text-on-surface-variant mt-1">${__('alerts.allCaughtUp')}</p>
          </div>`;
        return;
      }

      list.innerHTML = alerts.map(a => `
        <div class="glass-card rounded-2xl p-5 slide-up">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center ${this.getSeverityClass(a.severity)} flex-shrink-0">
              <span class="material-symbols-outlined">${this.getSeverityIcon(a.severity)}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-label-sm font-semibold ${this.getSeverityTextClass(a.severity)}">${escapeHtml(a.title)}</span>
                <span class="text-label-sm text-on-surface-variant">· ${this.timeAgo(a.createdAt)}</span>
              </div>
              <p class="text-body-md text-on-surface mb-3">${escapeHtml(a.message)}</p>
              ${a.actionLabel ? `<button class="text-primary-container text-label-sm font-semibold hover:underline dismiss-action">${escapeHtml(a.actionLabel)}</button>` : ''}
            </div>
            <button class="dismiss-btn text-on-surface-variant hover:text-on-surface p-1 flex-shrink-0" data-id="${escapeAttr(a.id)}">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.dismiss-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await api.alerts.dismiss(btn.dataset.id);
            toast.success(__('alerts.alertDismissed'));
            this.loadAlerts();
          } catch (err) {
            toast.error(__('alerts.failedToDismiss'));
          }
        });
      });
    } catch (err) {
      list.innerHTML = `<p class="text-center text-error text-body-md py-12">${__('alerts.failedToLoad')}</p>`;
    }
  },

  getSeverityIcon(severity) {
    const icons = { WARNING: 'warning', SUCCESS: 'check_circle', ERROR: 'error', INFO: 'info' };
    return icons[severity] || 'notifications';
  },

  getSeverityClass(severity) {
    const classes = {
      WARNING: 'bg-secondary/10 text-secondary',
      SUCCESS: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim',
      ERROR: 'bg-error/10 text-error',
      INFO: 'bg-primary-container/10 text-primary-container'
    };
    return classes[severity] || 'bg-primary-container/10 text-primary-container';
  },

  getSeverityTextClass(severity) {
    const classes = {
      WARNING: 'text-secondary',
      SUCCESS: 'text-tertiary-fixed-dim',
      ERROR: 'text-error',
      INFO: 'text-primary-container'
    };
    return classes[severity] || 'text-primary-container';
  },

  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return __('alerts.justNow');
    if (diff < 3600) return __('alerts.minutesAgo', { count: Math.floor(diff / 60) });
    if (diff < 86400) return __('alerts.hoursAgo', { count: Math.floor(diff / 3600) });
    if (diff < 604800) return __('alerts.daysAgo', { count: Math.floor(diff / 86400) });
    return date.toLocaleDateString();
  }
};

router.add('/alerts', () => alertsScreen.render());
