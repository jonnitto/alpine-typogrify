import {
  tokenize,
  regex,
  isNotString,
  getClassName,
  wrapContent,
  reSkipTags,
} from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  Alpine.directive('caps', (el, { expression }, { effect, evaluateLater }) => {
    const evaluate = evaluateLater(expression || null);
    const text = el.innerHTML;
    effect(() => {
      evaluate((value) => {
        mutateDom(() => {
          el.innerHTML = caps(text, value);
        });
      });
    });
  });
}

export { caps, directive as default };

/**
 * Wraps multiple capital letters in ``<span class="typogrify typogrify--caps">``
 * so they can be styled with CSS.
 */
function caps(text, className) {
  if (isNotString(text)) {
    return;
  }
  if (!className) {
    className = caps.className;
  }
  if (!className) {
    return text;
  }

  const result = [];
  let inSkippedTag = false;
  let closeMatch;
  const reCap = regex(
    '(' +
      '(\\b[A-Z\\d]*' + // Group 2: Any amount of caps and digits
      '[A-Z]\\d*[A-Z]' + // A cap string must at least include two caps
      // (but they can have digits between them)
      "[A-Z\\d']*\\b)" + // Any amount of caps and digits or dumb apostsrophes
      '|(\\b[A-Z]+\\.\\s?' + // OR: Group 3: Some caps, followed by a '.' and an optional space
      '(?:[A-Z]+\\.\\s?)+)' + // Followed by the same thing at least once more
      '(?:\\s|\\b|$)' +
      ')',
    'g'
  );

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
          token.txt.replace(reCap, function (matchedStr, g1, g2, g3) {
            // This is necessary to keep dotted cap strings to pick up extra spaces
            let caps;
            let tail;
            if (g2) {
              return wrapContent(g2, className);
            } else {
              if (g3.slice(-1) === ' ') {
                caps = g3.slice(0, -1);
                tail = ' ';
              } else {
                caps = g3;
                tail = '';
              }
              return wrapContent(caps, className) + tail;
            }
          })
        );
      }
    }
  });

  return result.join('');
}
caps.className = getClassName('caps');
