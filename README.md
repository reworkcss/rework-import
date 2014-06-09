# rework-import [![Build Status](https://travis-ci.org/kevva/rework-inline.svg?branch=master)](https://travis-ci.org/kevva/rework-inline)

Import stylesheets using `@import` and an optional media query. Pass a string or
an array of paths to the `path` option in where to search for stylesheets.

## Install

```bash
$ npm install --save rework-import
```

## Usage

As a Rework plugin:

```js
var imprt = require("rework-import")

rework(data)
    .use(imprt("your-stylesheets-dir"))
    .toString()
```

### Options

#### encoding

Type: `String`  
Default: `utf8`

Use if your CSS is encoded in anything other than UTF-8.

#### path

Type: `String|Array`  
Default: `process.cwd()`

A string or an array of paths in where to look for files.

## What to expect

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

## License

MIT © [Jason Campbell](https://github.com/jxson) & [Kevin Mårtensson](http://kevinmartensson.com)
