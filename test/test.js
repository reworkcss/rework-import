'use strict';

var importer = require('../');
var path = require('path');
var fixture = path.join.bind(null, __dirname, 'fixtures');
var read = require('fs').readFileSync;
var rework = require('rework');
var test = require('ava');

test('import stylesheet', function (t) {
    var src = read(fixture('simple/index.css'), 'utf8');
    var expected = read(fixture('simple/expected.css'), 'utf8').trim();
    var css = rework(src)
        .use(importer({path: fixture('simple')}))
        .toString();

    t.assert(css === expected);
    t.end();
});

test('import stylesheets recursively', function (t) {
    var src = read(fixture('recursive/index.css'), 'utf8');
    var expected = read(fixture('recursive/expected.css'), 'utf8').trim();
    var css = rework(src)
        .use(importer({path: fixture('recursive')}))
        .toString();

    t.assert(css === expected);
    t.end();
});

test('import stylesheets relatively', function (t) {
    var src = read(fixture('relative/index.css'), 'utf8');
    var expected = read(fixture('relative/expected.css'), 'utf8').trim();
    var css = rework(src)
        .use(importer({path: fixture('relative')}))
        .toString();

    t.assert(css === expected);
    t.end();
});

test('import stylesheets with custom transform', function (t) {
    var src = read(fixture('transform/index.css'), 'utf8');
    var expected = read(fixture('transform/expected.css'), 'utf8').trim();
    var css = rework(src)
        .use(importer({
            path: fixture('transform'),
            transform: require('css-whitespace')
        }))
        .toString();

    t.assert(css === expected);
    t.end();
});

test('import stylesheets without `path` option', function (t) {
    var src = read(fixture('cwd/index.css'), 'utf8');
    var expected = read(fixture('cwd/expected.css'), 'utf8').trim();
    var css = rework(src)
        .use(importer())
        .toString();

    t.assert(css === expected);
    t.end();
});

test('import stylesheets with `path` passed to rework', function (t) {
    var src = read(fixture('simple/index.css'), 'utf8');
    var expected = read(fixture('simple/expected.css'), 'utf8').trim();
    var css = rework(src, {source: fixture('simple/index.css')})
        .use(importer())
        .toString();

    t.assert(css === expected);
    t.end();
});

test('show readable trace on import error', function (t) {
    var src = read(fixture('missing/index.css'), 'utf8');
    var msg = [
        'Failed to find foo.css in [',
        '    ' + fixture('missing'),
        ']'
    ].join('\n');

    try {
        rework(src)
            .use(importer({path: fixture('missing')}))
            .toString();
    } catch (err) {
        t.assert(err);
        t.assert(err.message === msg);
        t.end();
    }
});

test('import stylesheets with sourcemap', function (t) {
    var src = read(fixture('sourcemap/index.css'), 'utf8');
    var css = rework(src, {source: fixture('sourcemap/index.css')})
        .use(importer())
        .toString({
            sourcemap: true,
            sourcemapAsObject: true
        });

    t.assert(css.map.sources[0] === fixture('sourcemap/foo.css'));
    t.assert(css.map.sources[1] === fixture('sourcemap/index.css'));
    t.end();
});
