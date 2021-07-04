import { reSkipTags, getClassName, isNotString } from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  Alpine.directive('amp', (el, { expression }, { effect, evaluateLater }) => {
    const evaluate = evaluateLater(expression || null);
    const text = el.innerHTML;
    effect(() => {
      evaluate((value) => {
        mutateDom(() => {
          el.innerHTML = amp(text, value);
        });
      });
    });
  });
}

export { amp, directive as default };

/**
 * Wraps apersands in HTML with ``<span class="typogrify typogrify--amp">``
 * so they can be styled with CSS. Apersands are also normalized to ``&amp;``.
 * Requires ampersands to have whitespace or an ``&nbsp;`` on both sides.
 */
function amp(text, className) {
  if (isNotString(text)) {
    return;
  }
  if (!className) {
    className = amp.className;
  }

  // (    $1   )(     $2       )(   $3    )
  const reAmp = /(\s|&nbsp;)(&|&amp;|&\#38;)(\s|&nbsp;)/g;
  // ( prefix) ( txt )(  suffix )
  const reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;

  return text.replace(reIntraTag, function (str, prefix, text, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    if (prefix.match(reSkipTags)) {
      return prefix + text + suffix;
    }
    text = text.replace(reAmp, `$1<span class="${className}">&amp;</span>$3`);

    return prefix + text + suffix;
  });
}
amp.className = getClassName("amp");
