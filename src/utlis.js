function regex(regexp, flag) {
  return new RegExp(regexp, flag);
}

// RegExp for skip some tags
const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;

function getClassName(className, modifier) {
  return className || `typogrify typogrify--${modifier}`;
}

function tokenize(text) {
  let tokens = [];
  let lastIndex = 0;
  const reTag = /([^<]*)(<[^>]*>)/gi;
  let currToken;

  while ((currToken = reTag.exec(text)) !== null) {
    const preText = currToken[1];
    const tagText = currToken[2];
    if (preText) {
      tokens.push({ type: 'text', txt: preText });
    }
    tokens.push({ type: 'tag', txt: tagText });
    lastIndex = reTag.lastIndex;
  }

  if (reTag.lastIndex <= text.length) {
    // if last char is a dot and not a '…'
    // then push two tokens
    if (text.slice(-1) == '.' && text.slice(-2) != '..') {
      tokens.push({
        type: 'text',
        txt: text.slice(lastIndex, text.length - 1),
      });
      tokens.push({ type: 'text', txt: text.slice(-1) });
    } else {
      tokens.push({ type: 'text', txt: text.slice(lastIndex) });
    }
  }

  return tokens;
}

function isNotString(string) {
  return !string || typeof string !== 'string';
}

export { reSkipTags, regex, tokenize, getClassName, isNotString };
