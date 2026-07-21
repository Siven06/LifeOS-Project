class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  add(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve(force = false) {
    const hash = window.location.hash.slice(1) || '/';
    if (!force && this.currentRoute === hash) return;
    this.currentRoute = hash;

    if (this.routes[hash]) {
      this.routes[hash]();
    } else {
      this.routes['/'] && this.routes['/']();
    }
    setTimeout(() => this.updateNavHighlight(), 50);
  }

  onAfterResolve(callback) {
    this.afterResolve = callback;
    return this;
  }

  start() {
    this.currentRoute = null;
    this.resolve();
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  updateNavHighlight() {
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.dataset.route;
      const isActive = route === this.currentRoute;
      link.classList.toggle('text-primary-fixed-dim', isActive);
      link.classList.toggle('font-bold', isActive);
      const indicator = link.querySelector('.nav-indicator');
      if (indicator) {
        indicator.classList.toggle('opacity-100', isActive);
        indicator.classList.toggle('opacity-0', !isActive);
      }
      if (isActive) {
        link.querySelector('.material-symbols-outlined')?.style.setProperty('font-variation-settings', "'FILL' 1");
      } else {
        link.querySelector('.material-symbols-outlined')?.style.removeProperty('font-variation-settings');
      }
    });
  }
}

const router = new Router();
