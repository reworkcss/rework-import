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

### inline(cwd)

Import stylesheets using `@import` and an optional media query. Pass in an array 
of paths to `cwd` in which to search for files.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) (c) [Kevin Mårtensson](http://kevinmartensson.com)
