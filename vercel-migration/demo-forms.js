// The preview never submits a request or clears a visitor's local cart.
document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !['proposal-form', 'quote-form'].includes(form.id)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const status = form.querySelector('#home-quote-status, #quote-status');
  if (status) {
    status.hidden = false;
    status.textContent = 'Демонстраційна версія — заявки не надсилаються';
  }
}, true);
