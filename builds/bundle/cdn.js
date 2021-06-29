import {
  amp,
  caps,
  ord,
  quotes,
  smartypants,
  typogrify,
  widont,
} from '../../src/';

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(amp);
  window.Alpine.plugin(caps);
  window.Alpine.plugin(ord);
  window.Alpine.plugin(quotes);
  window.Alpine.plugin(smartypants);
  window.Alpine.plugin(typogrify);
  window.Alpine.plugin(widont);
});
