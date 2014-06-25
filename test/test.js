/*global describe, it */
'use strict';

var path = require('path');
var fs = require('fs');

var assert = require('assert');
var rework = require('rework');

var imprt = require('../');

var fixturesDir = path.join(__dirname, 'fixtures')

describe('imprt()', function () {
    it('should import stylsheets', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'original.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: fixturesDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets recursively', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'original-recursive.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected-recursive.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: fixturesDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets relatively', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'original-relative.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected-relative.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: fixturesDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should support transform', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'original-transform.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected-transform.css'), 'utf8');

        var css = rework(original)
            .use(imprt({
                path: fixturesDir,
                transform: require("css-whitespace")
            }))
            .toString()
        assert.equal(css, expected);
    });

    it('should output readable trace', function () {
        var source = path.join(fixturesDir, 'import-missing.css');
        var original = fs.readFileSync(source, 'utf8');
        var reworkObj = rework(original, {source: source})

        assert.throws(
            function() {
                reworkObj.use(imprt({path: [fixturesDir, "../node_modules"]}))
            },
            function(err) {
                var expectedError = "Failed to find missing-file.css" +
                "\n    from " + fixturesDir + "/import-missing.css" +
                "\n    in [ " +
                "\n        " + fixturesDir + "," +
                "\n        ../node_modules" +
                "\n    ]"
                if ( err instanceof Error && err.message == expectedError ) {
                    return true
                }
            },
            "unexpected error"
        );
    });

    it('should work without a specified path', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'original-cwd.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected-cwd.css'), 'utf8');

        var css = rework(original)
            .use(imprt())
            .toString();

        assert.equal(css, expected);
    });

    it('should not need `path` option if `source` option has been passed to rework', function () {
        var source = path.join(fixturesDir, 'original.css');
        var original = fs.readFileSync(source, 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'expected.css'), 'utf8');

        var css = rework(original, {source: source})
            .use(imprt())
            .toString();

        assert.equal(css, expected);
    });
});
