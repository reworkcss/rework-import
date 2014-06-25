/*global describe, it */
'use strict';

var path = require('path');
var fs = require('fs');

var assert = require('assert');
var rework = require('rework');

var imprt = require('../');

var fixturesDir = path.join(__dirname, 'fixtures')
var importsDir = path.join(fixturesDir, 'imports')

describe('imprt()', function () {
    it('should import stylsheets', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'simple.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'simple.out.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: importsDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets recursively', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'recursive.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'recursive.out.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: importsDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should import stylsheets relatively', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'relative.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'relative.out.css'), 'utf8');

        var css = rework(original)
            .use(imprt({ path: importsDir}))
            .toString();

        assert.equal(css, expected);
    });

    it('should support transform', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'transform.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'transform.out.css'), 'utf8');

        var css = rework(original)
            .use(imprt({
                path: importsDir,
                transform: require("css-whitespace")
            }))
            .toString()
        assert.equal(css, expected);
    });

    it('should work without a specified path', function () {
        var original = fs.readFileSync(path.join(fixturesDir, 'cwd.css'), 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'cwd.out.css'), 'utf8');

        var css = rework(original)
            .use(imprt())
            .toString();

        assert.equal(css, expected);
    });

    it('should not need `path` option if `source` option has been passed to rework', function () {
        var source = path.join(fixturesDir, 'relative-to-source.css');
        var original = fs.readFileSync(source, 'utf8');
        var expected = fs.readFileSync(path.join(fixturesDir, 'relative-to-source.out.css'), 'utf8');

        var css = rework(original, {source: source})
            .use(imprt())
            .toString();

        assert.equal(css, expected);
    });

    it('should output readable trace', function () {
        var source = path.join(importsDir, 'import-missing.css');
        var original = fs.readFileSync(source, 'utf8');
        var reworkObj = rework(original, {source: source})

        assert.throws(
            function() {
                reworkObj.use(imprt({path: [importsDir, "../node_modules"]}))
            },
            function(err) {
                var expectedError = "Failed to find missing-file.css" +
                "\n    from " + importsDir + "/import-missing.css" +
                "\n    in [ " +
                "\n        " + importsDir + "," +
                "\n        ../node_modules" +
                "\n    ]"
                if ( err instanceof Error && err.message == expectedError ) {
                    return true
                }
            }
        );
    });

});
