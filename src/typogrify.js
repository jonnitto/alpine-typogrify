import { amp } from './amp';
import { caps } from './caps';
import { quotes } from './quotes';
import { ord } from './ord';
import { smartypants } from './smartypants';
import { widont } from './widont';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  // eslint-disable-next-line no-empty-pattern
  Alpine.directive('typogrify', (el, {}, { effect, evaluateLater }) => {
    const evaluate = evaluateLater();
    const text = el.innerHTML;
    effect(() => {
      evaluate(() => {
        mutateDom(() => {
          el.innerHTML = ord(quotes(caps(smartypants(widont(amp(text))))));
        });
      });
    });
  });
}

export { amp, caps, quotes, ord, smartypants, widont, directive as default };
