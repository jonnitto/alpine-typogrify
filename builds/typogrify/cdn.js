import typogrify from '../../src/typogrify';

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(typogrify);
});
