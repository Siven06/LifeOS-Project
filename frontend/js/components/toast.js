const toast = {
  show(message, type = 'success', duration = 3000) {
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'toast-container fixed top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-[200] slide-up';

    const colors = {
      success: 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim border-tertiary-fixed-dim/30',
      error: 'bg-error/20 text-error border-error/30',
      info: 'bg-primary-container/20 text-primary-container border-primary-container/30'
    };

    const icons = {
      success: 'check_circle',
      error: 'error',
      info: 'info'
    };

    container.innerHTML = `
      <div class="${colors[type] || colors.info} backdrop-blur-xl border rounded-xl px-5 py-4 flex items-center gap-3 shadow-2xl min-w-[300px] sm:min-w-[400px] max-w-[90vw]">
        <span class="material-symbols-outlined">${icons[type] || icons.info}</span>
        <span class="text-body-md">${message}</span>
      </div>
    `;

    document.body.appendChild(container);

    setTimeout(() => {
      container.style.transition = 'opacity 0.3s, transform 0.3s';
      container.style.opacity = '0';
      container.style.transform = 'translateY(-20px)';
      setTimeout(() => container.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error', 5000); },
  info(msg) { this.show(msg, 'info'); }
};
