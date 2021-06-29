import smartypants from '../../src/smartypants';

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(smartypants);
});
