const authScreen = {
  render() {
    const isRegister = window.location.hash.includes('register');
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center px-6">
        <div class="w-full max-w-md slide-up">
          <div class="text-center mb-10">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
              <img src="images/logo_lifeos.png" class="w-10 h-10" alt="LifeOS Logo">
            </div>
            <h1 class="text-headline-lg font-display text-primary-fixed-dim">${__('app.name')}</h1>
            <p class="text-body-md text-on-surface-variant mt-2">${__('app.tagline')}</p>
          </div>

          <div class="glass-card rounded-2xl p-8">
            <h2 class="text-headline-md text-center mb-8">${isRegister ? __('auth.createAccount') : __('auth.welcomeBack')}</h2>

            <form id="auth-form" class="space-y-5">
              <div id="name-field" class="${isRegister ? '' : 'hidden'}">
                <label class="text-label-sm text-on-surface-variant mb-2 block">${__('auth.fullName')}</label>
                <input type="text" name="name" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('auth.namePlaceholder')}"/>
              </div>

              <div>
                <label class="text-label-sm text-on-surface-variant mb-2 block">${__('auth.email')}</label>
                <input type="email" name="email" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('auth.emailPlaceholder')}"/>
              </div>

              <div>
                <label class="text-label-sm text-on-surface-variant mb-2 block">${__('auth.password')}</label>
                <input type="password" name="password" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="${__('auth.passwordPlaceholder')}"/>
              </div>

              <p id="auth-error" class="text-error text-label-sm hidden"></p>

              <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md font-semibold">
                ${isRegister ? __('auth.createAccount') : __('auth.signIn')}
              </button>
            </form>

            <p class="text-center text-label-md text-on-surface-variant mt-6">
              ${isRegister ? __('auth.alreadyHaveAccount') : __('auth.dontHaveAccount')}
              <a href="#${isRegister ? '/login' : '/register'}" class="text-primary-container hover:underline ml-1">
                ${isRegister ? __('auth.signIn') : __('auth.register')}
              </a>
            </p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const password = form.password.value;
      const name = form.name?.value;
      const errorEl = document.getElementById('auth-error');

      try {
        errorEl.classList.add('hidden');
        const res = isRegister
          ? await api.auth.register(name, email, password)
          : await api.auth.login(email, password);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        toast.success(isRegister ? __('auth.accountCreated') : __('auth.welcomeBackMsg'));
        router.navigate('/');
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  }
};

router.add('/login', () => authScreen.render());
router.add('/register', () => authScreen.render());
