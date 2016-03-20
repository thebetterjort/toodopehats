# dom-element-css

[![Build Status](https://travis-ci.org/crysalead-js/dom-element-css.svg?branch=master)](https://travis-ci.org/crysalead-js/dom-element-css)

DOM element style manipulation function.

## API

### css(element, name, value)

Gets/sets a style.

```js
css(element, "color", "black"); // Setter
css(element, "color"); // Getter
```

### css(element, object)

Sets a style using an object as value.

```js
css(element, {
  color: "black",
  background: "white"
});
```

## Acknowledgement

The [component team](https://github.com/component) which provides a lot of solid working bases to plagiarize :-p.
