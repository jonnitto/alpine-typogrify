function regex(regexp, flag) {
  return new RegExp(regexp, flag);
}

// RegExp for skip some tags
const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;

function getClassName(className, modifier) {
  return className || `typogrify typogrify--${modifier}`;
}

function tokenize(text) {
  var tokens = [],
    lastIndex = 0,
    re_tag = /([^<]*)(<[^>]*>)/gi,
    curr_token;

  while ((curr_token = re_tag.exec(text)) !== null) {
    var pre_text = curr_token[1],
      tag_text = curr_token[2];

    if (pre_text) {
      tokens.push({ type: 'text', txt: pre_text });
    }
    tokens.push({ type: 'tag', txt: tag_text });
    lastIndex = re_tag.lastIndex;
  }

  if (re_tag.lastIndex <= text.length) {
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
