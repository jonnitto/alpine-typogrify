import { getClassName, isNotString, regex } from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  Alpine.directive(
    'quotes',
    (el, { expression }, { effect, evaluateLater }) => {
      const evaluate = evaluateLater(expression || null);
      const text = el.innerHTML;
      effect(() => {
        evaluate((value) => {
          mutateDom(() => {
            el.innerHTML = quotes(text, value);
          });
        });
      });
    }
  );
}

export { quotes, directive as default };

/**
 * Wraps initial quotes in ``class="typogrify typogrify--dquo"`` for double quotes
 * or ``class="typogrify typogrify--quo"`` for single quotes. Works in these block
 * tags ``(h1-h6, p, li, dt, dd)`` and also accounts for potential opening inline
 * elements ``a, em, strong, span, b, i``
 */
function quotes(text, className) {
  if (isNotString(text)) {
    return;
  }

  const reQuote = regex(
    '(?:(?:<(?:p|h[1-6]|li|dt|dd)[^>]*>|^)' + // start with an opening
      // p, h1-6, li, dd, dt
      // or the start of the string
      '\\s*' + // optional white space!
      '(?:<(?:a|em|span|strong|i|b)[^>]*>\\s*)*)' + //optional opening inline tags,
      // with more optional white space for each.
      '(?:("|&ldquo;|&#8220;)|' + // Find me a quote! /only need to find
      "('|&lsquo;|&#8216;))", // the left quotes and the primes/
    'i'
  );

  return text.replace(reQuote, function (matchedStr, dquo, squo) {
    const classname = getClassName(className, dquo ? 'dquo' : 'quo');
    const quote = dquo ? dquo : squo;
    const beforeQuote = matchedStr.slice(0, matchedStr.lastIndexOf(quote));
    return `${beforeQuote}<span class="${classname}">${quote}</span>`;
  });
}
