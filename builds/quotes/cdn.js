import quotes from '../../src/quotes';

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(quotes);
});
