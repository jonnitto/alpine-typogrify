import caps from '../../src/caps';

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(caps);
});
