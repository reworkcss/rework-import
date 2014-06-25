# rework-import [![Build Status](https://travis-ci.org/reworkcss/rework-import.svg?branch=master)](https://travis-ci.org/reworkcss/rework-import)

Import stylesheets using `@import` and an optional media query. Pass a string or
an array of paths to the `path` option in where to search for stylesheets.
Handle recursive & relative imports.

## Install

```bash
$ npm install --save rework-import
```

## Usage

As a Rework plugin:

```js
var imprt = require('rework-import');

// simple usage
rework(data)
    .use(imprt({path: 'path/to/your/stylsheets'}))
    .toString();

// using multiples paths
rework(data)
    .use(imprt({path: [
        'path/to/your/stylsheets',
        'node_modules',
    ]}))
    .toString();

// with css-whitespace
rework(data)
    .use(imprt({transform: require('css-whitespace')}))
    .toString();
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
_Note: this is mainly used for the first level import. Nested `@import` will also benefit of the relative dirname of imported files._

#### transform

Type: `Function`  
Default: `null`

A function to transform the content of imported files. Take one argument (file content) & should return the modified content.  
Useful if you use [`css-whitespace`](https://github.com/reworkcss/css-whitespace).

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

MIT © [Jason Campbell](https://github.com/jxson) and [Kevin Mårtensson](http://github.com/kevva)
