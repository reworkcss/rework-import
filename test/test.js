/*global describe, it */
'use strict';

var path = require('path');
var fs = require('fs');

var assert = require('assert');
var rework = require('rework');

var imprt = require('../');

describe('imprt()', function () {
    it('should import stylsheets', function () {
        var original = fs.readFileSync(path.join(__dirname, 'fixtures/original.css'), 'utf8');
        var expected = fs.readFileSync(path.join(__dirname, 'fixtures/expected.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: path.join(__dirname, 'fixtures') }))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets recursively', function () {
        var original = fs.readFileSync(path.join(__dirname, 'fixtures/original-recursive.css'), 'utf8');
        var expected = fs.readFileSync(path.join(__dirname, 'fixtures/expected-recursive.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: path.join(__dirname, 'fixtures') }))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets relatively', function () {
        var original = fs.readFileSync(path.join(__dirname, 'fixtures/original-relative.css'), 'utf8');
        var expected = fs.readFileSync(path.join(__dirname, 'fixtures/expected-relative.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: path.join(__dirname, 'fixtures') }))
            .toString();

        assert.equal(css, expected);
    });
});
