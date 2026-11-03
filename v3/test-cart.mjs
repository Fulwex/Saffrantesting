import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const listeners = new Map();
const storage = new Map();
const toast = { querySelector: () => ({textContent: ''}), classList: { add() {}, remove() {} } };
const doc = {
  querySelectorAll: () => [],
  querySelector: selector => selector === '.cart-toast' ? toast : null,
  addEventListener: (name, handler) => {
    const handlers = listeners.get(name) || [];
    handlers.push(handler);
    listeners.set(name, handlers);
  }
};
const context = {
  document: doc,
  window: { name: '' },
  localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  location: { search: '', protocol: 'https:' },
  URLSearchParams,
  setTimeout: () => 1,
  clearTimeout: () => {},
  console
};
vm.runInNewContext(fs.readFileSync('cart.js', 'utf8'), context);
const button = (color, index) => ({
  dataset: { id: 'towels-classic-color', name: 'Рушник кольоровий', category: 'Рушники', tier: 'Кольорова лінія', image: 'white.webp' },
  textContent: 'Додати до запиту',
  closest: () => ({ querySelector: selector => ({
    '.js-spec': { value: '50×90 см' },
    '.js-fabric': null,
    '.js-embroidery': { checked: false },
    '.js-color': { value: color, dataset: { preview: 'colors.png', count: '5' }, selectedOptions: [{ dataset: { index: String(index) } }] }
  })[selector] })
});
const fire = target => listeners.get('click')[0]({ target: { closest: () => target } });
fire(button('Графіт', 3));
fire(button('Графіт', 3));
fire(button('Кремовий', 0));
const items = context.window.SaffranCart.getItems();
assert.equal(items.length, 2);
assert.equal(items[0].quantity, 2);
assert.equal(items[0].color, 'Графіт');
assert.equal(items[0].previewIndex, 3);
assert.equal(items[1].color, 'Кремовий');
assert.equal(items[1].quantity, 1);
assert.ok(storage.has('saffran-quote-cart-v3'));
console.log('Cart grouping and color state passed.');
