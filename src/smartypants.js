import { tokenize, regex, isNotString, reSkipTags } from './utlis';

function directive(Alpine) {
  const mutateDom = Alpine.mutateDom;
  // eslint-disable-next-line no-empty-pattern
  Alpine.directive('amp', (el, {}, { effect, evaluateLater }) => {
    const evaluate = evaluateLater();
    const text = el.innerHTML;
    effect(() => {
      evaluate(() => {
        mutateDom(() => {
          el.innerHTML = smartypants(text);
        });
      });
    });
  });
}

export {
  smartypants,
  smartEscapes,
  smartDashes,
  smartEllipses,
  smartBackticks,
  smartQuotes,
  directive as default,
};

/**
 * Translates plain ASCII punctuation characters into
 * "smart" typographic punctuation HTML entities.
 */
function smartypants(text) {
  if (isNotString(text)) {
    return;
  }
  const result = [];
  let skippedTagStack = [];
  let skippedTag = '';
  let skipMatch = '';
  let inPre = false;
  // This is a cheat, used to get some context for one-character
  // tokens that consist of just a quote char. What we do is remember
  // the last character of the previous text token, to use as context
  // to curl single-character quote tokens correctly.
  let prevTokenLastChar = '';
  let lastChar;
  let txt;

  tokenize(text).forEach(function (token) {
    if (token.type === 'tag') {
      // Don't mess with quotes inside some tags.
      // This does not handle self <closing/> tags!
      result.push(token.txt);

      // is it a skipped tag ?
      if ((skipMatch = reSkipTags.exec(token.txt)) !== null) {
        skippedTag = skipMatch[2].toLowerCase();

        // closing tag
        if (skipMatch[1]) {
          if (skippedTagStack.length > 0) {
            if (skippedTag === skippedTagStack[skippedTagStack.length - 1]) {
              skippedTagStack.pop();
            }
          }
          if (skippedTagStack.length === 0) {
            inPre = false;
          }
        }
        // opening tag
        else {
          skippedTagStack.push(skippedTag);
          inPre = true;
        }
      }
    } else {
      txt = token.txt;

      // Special case rock ’n’ roll—use apostrophes
      txt = txt.replace(/(rock )'n'( roll)/gi, '$1&#8217;n&#8217;$2');

      // Remember last char of this token before processing
      lastChar = txt.slice(-1);

      if (!inPre) {
        txt = smartBackticks(smartEllipses(smartDashes(smartEscapes(txt))));
        // backticks need to be processed before quotes
        // quotes
        switch (txt) {
          case "'": // Special case: single-character ' token
            txt = /\S/.test(prevTokenLastChar) ? '&#8217;' : '&#8216;';
            break;
          case '"': // Special case: single-character " token
            txt = /\S/.test(prevTokenLastChar) ? '&#8221;' : '&#8220;';
            break;
          default:
            // Normal case
            txt = smartQuotes(txt);
        }
      }

      prevTokenLastChar = lastChar;
      result.push(txt);
    }
  });

  return result.join('');
}

/**
 * Returns input string, with after processing the following backslash
 * escape sequences. This is useful if you want to force a "dumb"
 * quote or other character to appear.
 *
 */
function smartEscapes(text) {
  return text
    .replace(/\\"/g, '&#34;')
    .replace(/\\'/g, '&#39;')
    .replace(/\\-/g, '&#45;')
    .replace(/\\\./g, '&#46;')
    .replace(/\\\\/g, '&#92;')
    .replace(/\\`/g, '&#96;');
}

/**
 * Returns input text, with each instance of "--"
 * translated to an em-dash HTML entity.
 *
 */
function smartDashes(text) {
  return text
    .replace(/---/g, '&#8212;') // em  (yes, backwards)
    .replace(/([^<][^!]|[^!]|^)--(?!>)/g, '$1&#8211;'); // en  (yes, backwards)
}

/**
 * Returns input string, with each instance of "..."
 * translated to an ellipsis HTML entity.
 *
 */
function smartEllipses(text) {
  return text.replace(/\.\.\./g, '&#8230;').replace(/\. \. \./g, '&#8230;');
}

/**
 * Returns input string, with ``backticks'' -style double quotes
 * translated into HTML curly quote entities.
 *
 */
function smartBackticks(text) {
  return text.replace(/``/g, '&#8220;').replace(/''/g, '&#8221;');
}

/**
 * Returns input string, with "educated" curly quote
 * HTML entities.
 *
 */
function smartQuotes(text) {
  const punctCls = '[!"#\\$\\%\\\'()*+,-.\\/:;<=>?\\@\\[\\\\]\\^_`{|}~]';
  const rePunctStr = '(?=%s\\B)'.replace('%s', punctCls);
  const closeCls = '[^\\ \\t\\r\\n\\[\\{\\(\\-]';
  const decDashes = '&#8211;|&#8212;';
  const reOpeningSingleQuotes = regex(
    '(' +
      '\\s|' + // a whitespace char, or
      '&nbsp;|' + // a non-breaking space entity, or
      '--|' + // dashes, or
      '&[mn]dash;|' + // named dash entities
      decDashes +
      '|' + // or decimal entities
      '&#x201[34];' + // or hex
      ')' +
      "'" + // the quote
      '(?=\\w)',
    'g'
  );
  const reClosingSingleQuotes = regex(
    '(' + closeCls + ')' + "'" + '(?!\\s | s\\b | \\d)',
    'g'
  );
  const reClosingSingleQuotes2 = regex(
    '(' + closeCls + ')' + "'" + '(?!\\s | s\\b)',
    'g'
  );
  const reOpeningDoubleQuotes = regex(
    '(' +
      '\\s|' + // a whitespace char, or
      '&nbsp;|' + // a non-breaking space entity, or
      '--|' + // dashes, or
      '&[mn]dash;|' + // named dash entities
      decDashes +
      '|' + // or decimal entities
      '&#x201[34];' + // or hex
      ')' +
      '"' + // the quote
      '(?=\\w)',
    'g'
  );

  const reClosingDoubleQuotes = regex('"(?=\\s)', 'g');
  const reClosingDoubleQuotes2 = regex('(' + closeCls + ')"', 'g');

  return (
    text
      // Special case if the very first character is a quote
      // followed by punctuation at a non-word-break.
      // Close the quotes by brute force:
      .replace(regex("^'%s".replace('%s', rePunctStr), 'g'), '&#8217;')
      .replace(regex('^"%s'.replace('%s', rePunctStr), 'g'), '&#8221;')

      // Special case for double sets of quotes, e.g.:
      //  <p>He said, "'Quoted' words in a larger quote."</p>
      .replace(/"'(?=\w)/g, '&#8220;&#8216;')
      .replace(/'"(?=\w)/g, '&#8216;&#8220;')

      // Special case for decade abbreviations (the '80s):
      .replace(/\b'(?=\d{2}s)/g, '&#8217;')

      // Opening single quotes
      .replace(reOpeningSingleQuotes, '$1&#8216;')
      // Closing single quotes
      .replace(reClosingSingleQuotes, '$1&#8217;')
      .replace(reClosingSingleQuotes2, '$1&#8217;$2')
      // Any remaining single quotes should be closing ones
      .replace("'", '&#8217;')

      // Opening double quotes
      .replace(reOpeningDoubleQuotes, '$1&#8220;')
      // Closing double quotes
      .replace(reClosingDoubleQuotes, '&#8221;')
      .replace(reClosingDoubleQuotes2, '$1&#8221;')
      // Any remaining quotes should be opening ones.
      .replace('"', '&#8220;')
  );
}
