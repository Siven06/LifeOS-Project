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
