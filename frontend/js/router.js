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

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    if (this.currentRoute === hash) return;
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
      link.classList.toggle('text-primary-fixed-dim', route === this.currentRoute);
      link.classList.toggle('font-bold', route === this.currentRoute);
      if (route === this.currentRoute) {
        link.querySelector('.material-symbols-outlined')?.style.setProperty('font-variation-settings', "'FILL' 1");
      } else {
        link.querySelector('.material-symbols-outlined')?.style.removeProperty('font-variation-settings');
      }
    });
  }
}

const router = new Router();
