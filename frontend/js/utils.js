function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'");
}

function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

const CURRENCIES = {
  USD: { locale: 'en-US', code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { locale: 'de-DE', code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { locale: 'en-GB', code: 'GBP', symbol: '£', name: 'British Pound' },
  COP: { locale: 'es-CO', code: 'COP', symbol: '$', name: 'Peso Colombiano' }
};

function getCurrencyCode() {
  return localStorage.getItem('currency') || 'USD';
}

function getCurrencyConfig() {
  const code = getCurrencyCode();
  return CURRENCIES[code] || CURRENCIES.USD;
}

function formatCurrency(amount) {
  if (amount == null) return '$0.00';
  const cfg = getCurrencyConfig();
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return cfg.symbol + Number(amount).toLocaleString();
  }
}

function formatCurrencyShort(amount) {
  if (amount == null) return '$0';
  const cfg = getCurrencyConfig();
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return cfg.symbol + Number(amount).toLocaleString();
  }
}

function formatCurrencySign(amount, type) {
  const prefix = type === 'INCOME' ? '+' : '-';
  return prefix + formatCurrency(Math.abs(amount));
}

const ThemeManager = {
  STORAGE_KEY: 'theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    this.apply(saved, false);
  },

  getCurrent() {
    return localStorage.getItem(this.STORAGE_KEY) || 'dark';
  },

  apply(theme, persist = true) {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    if (theme === 'light') {
      html.classList.remove('dark');
      document.getElementById('meta-theme-color')?.setAttribute('content', '#F8F9FA');
    } else {
      html.classList.add('dark');
      document.getElementById('meta-theme-color')?.setAttribute('content', '#0A0A0B');
    }
    if (persist) {
      localStorage.setItem(this.STORAGE_KEY, theme);
      if (localStorage.getItem('token')) {
        api.users.updateTheme(theme).catch(() => {});
      }
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  },

  toggle() {
    const current = this.getCurrent();
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    return next;
  },

  getLabelKey() {
    const current = this.getCurrent();
    return current === 'dark' ? 'profile.themeDark' : 'profile.themeLight';
  }
};
