const i18n = {
  locale: 'en',
  translations: {},
  fallbackTranslations: {},

  async init() {
    const saved = localStorage.getItem('locale');
    this.locale = saved || navigator.language?.split('-')[0] || 'en';
    if (!['en', 'es'].includes(this.locale)) this.locale = 'en';
    await this.load(this.locale);
  },

  async load(locale) {
    try {
      const res = await fetch(`js/lang/${locale}.json`);
      this.translations = await res.json();
    } catch {
      this.translations = {};
    }
    try {
      const res = await fetch('js/lang/en.json');
      this.fallbackTranslations = await res.json();
    } catch {
      this.fallbackTranslations = {};
    }
  },

  t(key, params = {}) {
    let msg = key.split('.').reduce((obj, k) => obj?.[k], this.translations);
    if (msg == null) {
      msg = key.split('.').reduce((obj, k) => obj?.[k], this.fallbackTranslations);
    }
    if (msg == null) return key;

    if (typeof msg === 'object') {
      const count = params.count ?? 1;
      msg = count === 1 ? (msg.one || msg.other) : (msg.other || msg.one);
    }

    if (typeof msg !== 'string') return key;

    return msg.replace(/\{\{(\w+)\}\}/g, (_, k) => {
      const val = params[k];
      return val != null ? val : `{{${k}}}`;
    });
  },

  setLocale(locale) {
    if (!['en', 'es'].includes(locale)) return;
    this.locale = locale;
    localStorage.setItem('locale', locale);
  },

  getLocale() {
    return this.locale;
  },

  getLanguages() {
    return [
      { code: 'en', label: 'English', nativeLabel: 'English' },
      { code: 'es', label: 'Spanish', nativeLabel: 'Español' }
    ];
  }
};

function __(key, params) {
  return i18n.t(key, params);
}

function tc(category) {
  const key = `categories.${category}`;
  const translated = i18n.t(key);
  if (translated === key) {
    if (!category) return '';
    return category.charAt(0) + category.slice(1).toLowerCase();
  }
  return translated;
}
