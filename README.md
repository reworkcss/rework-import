# rework-inline [![Build Status](https://travis-ci.org/kevva/rework-inline.svg?branch=master)](https://travis-ci.org/kevva/rework-inline)

> Inline stylesheets using `@import`

## Install

```bash
$ npm install --save rework-inline
```

## Usage

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

### encoding

Type: `String`  
Default: `utf8`

Use if your CSS is encoded in anything other than UTF-8.

### path

Type: `String|Array`  
Default: `process.cwd()`

A string or an array of paths in where to look for files.

## License

MIT © [Kevin Mårtensson](http://kevinmartensson.com)
