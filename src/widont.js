import { getClassName, regex, isNotString } from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  Alpine.directive(
    'widont',
    (el, { expression }, { effect, evaluateLater }) => {
      const evaluate = evaluateLater(expression || null);
      const text = el.innerHTML;
      effect(() => {
        evaluate((value) => {
          mutateDom(() => {
            el.innerHTML = widont(text, value);
          });
        });
      });
    }
  );
}

export { widont, directive as default };

/**
 * Replaces the space between the last two words in a string with ``&nbsp;``
 * Works in these block tags ``(h1-h6, p, li, dd, dt)`` and also accounts for
 * potential closing inline elements ``a, em, strong, span, b, i``
 *
 */
function widont(text, className) {
  if (isNotString(text)) {
    return;
  }
  if (!className) {
    className = widont.className;
  }
  const inlineTags = 'a|em|span|strong|i|b';
  const word =
    '(?:<(?:' +
    inlineTags +
    ')[^>]*?>)*?[^\\s<>]+(?:</(?:' +
    inlineTags +
    ')[^>]*?>)*?';
  const reWidont = regex(
    '(' + // matching group 1
      '\\s+' +
      word + // space and a word with a possible bordering tag
      '\\s+' +
      word + // space and a word with a possible bordering tag
      ')' +
      '(?:\\s+)' + // one or more space characters
      '(' + // matching group 2
      '[^<>\\s]+' + // nontag/nonspace characters
      '(?:\\s*</(?:a|em|span|strong|i|b)[^>]*?>\\s*\\.*)*?' + // one or more inline closing tags
      // can be surronded by spaces
      // and followed by a period.
      '(?:\\s*?</(?:p|h[1-6]|li|dt|dd)>|$)' + // allowed closing tags or end of line
      ')',
    'gi'
  );
  return text.replace(reWidont, `$1<span class="${className}">&nbsp;</span>$2`);
}
widont.className = getClassName('widont');
