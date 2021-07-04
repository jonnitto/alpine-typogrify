import amp from './amp';
import caps from './caps';
import ord from './ord';
import quotes from './quotes';
import smartypants from './smartypants';
import typogrify, * as exp from './typogrify';
import widont from './widont';

const functions = {
  amp: exp.amp,
  caps: exp.caps,
  ord: exp.ord,
  quotes: exp.quotes,
  smartypants: exp.smartypants,
  widont: exp.widont,
};

export { amp, caps, ord, quotes, smartypants, typogrify, widont, functions };
