# rework-inline [![Build Status](https://secure.travis-ci.org/kevva/rework-inline.png?branch=master)](http://travis-ci.org/kevva/rework-inline)

Inline stylesheets using `@import`.

## Getting started

Install with [npm](https://npmjs.org/package/rework-inline): `npm install rework-inline`

## Examples

```css
@import "foo.css" (min-width: 25em);

body {
    background: black;
}
```

yields:

```css
@media (min-width: 25em) {
    body {
        background: red;
    }

    h1 {
        color: grey;
    }
}

body {
    background: black;
}
```

## API

### inline(opts)

Import stylesheets using `@import` and an optional media query. Pass a string or 
an array of paths to the `path` option in where to search for stylesheets.

## Options

* `encoding` — Use if your CSS is encoded in anything other than UTF-8
* `path` — A string or an array of paths in where to look for files
* `whitespace` — Set to true if you're using [whitespace significant CSS](https://npmjs.org/package/css-whitespace)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) (c) [Kevin Mårtensson](http://kevinmartensson.com)
