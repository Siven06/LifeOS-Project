const authScreen = {
  render() {
    const isRegister = window.location.hash.includes('register');
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center px-6">
        <div class="w-full max-w-md slide-up">
          <div class="text-center mb-10">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-primary-container">account_balance</span>
            </div>
            <h1 class="text-headline-lg font-display text-primary-fixed-dim">LifeOS</h1>
            <p class="text-body-md text-on-surface-variant mt-2">Personal Finance Dashboard</p>
          </div>

          <div class="glass-card rounded-2xl p-8">
            <h2 class="text-headline-md text-center mb-8">${isRegister ? 'Create Account' : 'Welcome Back'}</h2>

            <form id="auth-form" class="space-y-5">
              <div id="name-field" class="${isRegister ? '' : 'hidden'}">
                <label class="text-label-sm text-on-surface-variant mb-2 block">Full Name</label>
                <input type="text" name="name" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="John Doe"/>
              </div>

              <div>
                <label class="text-label-sm text-on-surface-variant mb-2 block">Email</label>
                <input type="email" name="email" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="you@example.com"/>
              </div>

              <div>
                <label class="text-label-sm text-on-surface-variant mb-2 block">Password</label>
                <input type="password" name="password" class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors text-body-md" placeholder="••••••••"/>
              </div>

              <p id="auth-error" class="text-error text-label-sm hidden"></p>

              <button type="submit" class="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-body-md font-semibold">
                ${isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p class="text-center text-label-md text-on-surface-variant mt-6">
              ${isRegister ? 'Already have an account?' : "Don't have an account?"}
              <a href="#${isRegister ? '/login' : '/register'}" class="text-primary-container hover:underline ml-1">
                ${isRegister ? 'Sign In' : 'Register'}
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
        toast.success(isRegister ? 'Account created successfully' : 'Welcome back!');
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
