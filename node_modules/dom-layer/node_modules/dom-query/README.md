# dom-query

[![Build Status](https://travis-ci.org/crysalead-js/dom-query.svg?branch=master)](https://travis-ci.org/crysalead-js/dom-query)

DOM query selector based on `document.querySelector` with fallback engine support.

## API

### query(selector, [element])

Query `selector` against the document or `element` and return a single match.

```js
query('ul > li');
query('ul > li', root);
```

If selector is a dom element, it is returned right away.

### query.all(selector, [element])

Query `selector` against the document or `element` and return an array of all matches.

```js
query.all('ul > li');
query.all('ul > li', root);
```

If selector is a dom element or a NodeList, it is returned and wrapped inside an array.

## Fallback engines

To allow some fallback engine (for compatibility support) you can set it up with the following:

```js
query.engine({
  one: function(selector, element) {} // the one fall back engine
  all: function(selector, element) {} // the all fall back engine
});
```

## Acknowledgement

This module has been built on top of [component-query](https://github.com/component/query).
