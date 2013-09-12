/*global describe, it */
'use strict';

var assert = require('assert');
var fs = require('fs');
var inline = require('../inline');
var path = require('path');
var rework = require('rework');

describe('inline()', function () {
    it('should import stylsheets', function () {
        var original = fs.readFileSync(path.join(__dirname, 'fixtures/original.css'));
        var expected = fs.readFileSync(path.join(__dirname, 'fixtures/expected.css'));
        var css = rework(original)
            .use(inline(path.join(__dirname, 'fixtures')))
            .toString();

        assert.equal(css, expected);
    });
});
