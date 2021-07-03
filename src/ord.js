import { reSkipTags, tokenize, getClassName, isNotString } from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  Alpine.directive('ord', (el, { expression }, { effect, evaluateLater }) => {
    const evaluate = evaluateLater(expression || null);
    const text = el.innerHTML;
    effect(() => {
      evaluate((value) => {
        mutateDom(() => {
          el.innerHTML = ord(text, value);
        });
      });
    });
  });
}
export { ord, directive as default };

/**
 * Wraps date suffix in <span class="className"> so they can be styled with CSS.
 */
function ord(text, className) {
  if (isNotString(text)) {
    return;
  }
  className = getClassName(className, 'ord');

  const result = [];
  const reSuffix = /(\d+)(st|nd|rd|th)/g;
  let inSkippedTag = false;
  let closeMatch;

  tokenize(text).forEach(function (token) {
    if (token.type === 'tag') {
      result.push(token.txt);

      closeMatch = reSkipTags.exec(token.txt);
      inSkippedTag = closeMatch && closeMatch[1] === undefined;
    } else {
      if (inSkippedTag) {
        result.push(token.txt);
      } else {
        result.push(
          token.txt.replace(reSuffix, `$1<span class="${className}">$2</span>`)
        );
      }
    }
  });

  return result.join('');
}
