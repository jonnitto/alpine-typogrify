[![npm version]][npm] [![GitHub stars]][stargazers] [![GitHub watchers]][subscription] [![GitHub license]][license] [![GitHub issues]][issues] [![GitHub forks]][network] [![Sponsor @Jonnitto on GitHub]][sponsor]

# alpine-typogrify

**alpine-typogrify** provides a set of functions for [Alpine.js] which automatically apply various transformations to plain text to yield
typographically-improved HTML.

This package is inspired by [typogr.js].

## Installation

Run `npm install alpine-typogrify` or `yarn add alpine-typogrify` in your console.

## 101

```html
<script src="https://unpkg.com/alpine-typogrify" defer></script>
<script src="https://unpkg.com/alpinejs" defer></script>

<div x-data x-typogrify>
  <h3>"Lorem ipsum" & dolor SIT amet</h3>
  <p>
    his viris "similique" appellantur cu, P.R.I. at erat mandamus adversarium.
    1st, 2nd, 3rd, 4th, "Alii eripuit utroque sit in, quem 'disputando' vel ex."
    Mea erant 'indoctum' ex IDS312, ad errem explicari...
  </p>
</div>
```

results to

```html
<div x-data x-typogrify>
  <h3>
    <span class="typogrify typogrify--quotes typogrify--dquo">“</span>
    Lorem ipsum” <span class="typogrify typogrify--amp">&amp;</span> dolor
    <span class="typogrify typogrify--caps">SIT</span><span class="typogrify typogrify--widont">&nbsp;</span>amet
  </h3>
  <p>
    his viris “similique” appellantur cu,
    <span class="typogrify typogrify--caps">P.R.I.</span> at erat mandamus adversarium. 
    1<span class="typogrify typogrify--ord">st</span>, 2<span class="typogrify typogrify--ord">nd</span>, 
    3<span class="typogrify typogrify--ord">rd</span>, 4<span class="typogrify typogrify--ord">th</span>, 
    “Alii eripuit utroque sit in, quem ‘disputando’ vel ex.” Mea erant ‘indoctum’ ex 
    <span class="typogrify typogrify--caps">IDS312</span>, ad errem<span class="typogrify typogrify--widont">&nbsp;</span>explicari…
  </p>
</div>
```

[Take a look at the example file]

# Directives

Every directive is split into two parts: The directive for [Alpine.js] and the function that manipulate the input. If a wrapping `<span>` is added to some text, a class with the schema `typogrify typogrify--FUNCTION_NAME` will be added. You can change this class if you pass a value to the directive, e.g. `<div x-amp="'text-red-500'">`, or if you build your javascript on your own, you can also import the function and overwrite the default class name:

```js
import Alpine from 'alpinejs';
import directive, { amp } from 'alpine-typografiy/dist/amp/module.mjs';

amp.className = 'text-red-500';
Alpine.plugin(directive);
Alpine.start();
```

or you can add multiple directives at once:

```js
import Alpine from 'alpinejs';
import {
  amp,
  caps,
  ord,
  quotes,
  smartypants,
  typogrify,
  widont,
  functions,
} from 'alpine-typogrify';

functions.amp.className = 'text-red-500';

Alpine.plugin(amp);
Alpine.plugin(caps);
Alpine.plugin(ord);
Alpine.plugin(quotes);
Alpine.plugin(smartypants);
Alpine.plugin(typogrify);
Alpine.plugin(widont);

Alpine.start();
```

## x-amp

Wraps ampersands in HTML with `<span class="typogrify typogrify--amp">` so they can be styled with CSS. Ampersands are also normalized to `&amp;`. Requires ampersands to have whitespace or an `&nbsp;` on both sides. Will not change any ampersand which has already been wrapped in this fashion.

## x-caps

Wraps multiple capital letters in `<span class="typogrify typogrify--caps"></span>` so they can be styled.

## x-ord

Wraps number suffix's in `<span class="typogrify typogrify--ord"></span>` so they can be styled.

## x-quotes

Wraps initial quotes in `<span class="typogrify typogrify--quotes typogrify--dquo">` for double quotes or `<span class="typogrify typogrify--quotes typogrify--quo">` for single quotes. Works inside these block elements:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- `p`
- `li`
- `dt`
- `dd`

It also accounts for potential opening inline elements: `a`, `em`,
`strong`, `span`, `b`, `i`.

## x-smartypants

- Straight quotes ( " and ' '") into “curly” quote HTML entities (&lsquo; | &rsquo; | &ldquo; | &rdquo;)
- Backticks-style quotes (``like this''') into “curly” quote HTML entities (&lsquo; | &rsquo; | &ldquo; | &rdquo;)
- Dashes (“--” and “---”) into n-dash and m-dash entities (&ndash; | &mdash;)
- Three consecutive dots (“...”) into an ellipsis entity (&hellip;)

## x-widont

Based on Shaun Inman's PHP utility of the same name, it replaces the
space between the last two words in a string with `&nbsp;` to avoid
a final line of text with only one word.

Works inside these block elements:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- `p`
- `li`
- `dt`
- `dd`

It also accounts for potential closing inline elements: `a`, `em`,
`strong`, `span`, `b`, `i`.

## x-typogrify

Applies all of the following filters, in order:

- amp
- widont
- smartypants
- caps
- quotes
- ord

[npm version]: https://img.shields.io/npm/v/alpine-typogrify
[npm]: https://www.npmjs.com/package/alpine-typogrify
[github issues]: https://img.shields.io/github/issues/Jonnitto/alpine-typogrify
[issues]: https://github.com/Jonnitto/alpine-typogrify/issues
[github forks]: https://img.shields.io/github/forks/Jonnitto/alpine-typogrify
[network]: https://github.com/Jonnitto/alpine-typogrify/network
[github stars]: https://img.shields.io/github/stars/Jonnitto/alpine-typogrify
[stargazers]: https://github.com/Jonnitto/alpine-typogrify/stargazers
[github license]: https://img.shields.io/github/license/Jonnitto/alpine-typogrify
[license]: LICENSE
[sponsor @jonnitto on github]: https://img.shields.io/badge/sponsor-Support%20this%20package-informational
[sponsor]: https://github.com/sponsors/jonnitto
[github watchers]: https://img.shields.io/github/watchers/Jonnitto/alpine-typogrify.svg
[subscription]: https://github.com/Jonnitto/alpine-typogrify/subscription
[alpine.js]: https://alpinejs.dev
[typogr.js]: https://github.com/ekalinin/typogr.js/
[take a look at the example file]: example.html
