'use strict';

var css = require('css');
var fs = require('fs');
var path = require('path');

/**
 * Inline stylesheets using `@import`
 */

module.exports = function (cwd) {
    if (!Array.isArray(cwd)) {
        cwd = Array.prototype.slice.call(arguments);
    }

    function check(filename) {
        filename = filename
            .replace(/^url\s?\(/, '')
            .replace(/\)$/, '')
            .replace(/^("|\')/, '')
            .replace(/("|\')$/, '');

        var file = cwd.map(function (dir) {
            return path.join(dir, filename);
        }).filter(fs.existsSync)[0];

        if (!file) {
            throw new Error('failed to find ' + filename);
        }

        return file;
    }

    function read(file) {
        var data = fs.readFileSync(file, 'utf8');
        var style = css.parse(data).stylesheet;

        return style;
    }

    return function (style) {
        var rules = [];

        style.rules.forEach(function (rule) {
            if (rule.type !== 'import') {
                return rules.push(rule);
            }

            var re = /(url\s?\()?(\'|")(.*)(\'|")(\))?/g;
            var imprt = rule.import.match(re).toString();
            var media = rule.import.replace(re, '').replace(' ', '');
            var file = check(imprt);
            var data = read(file);
            var res;

            if (media === '') {
                res = data.rules;
            } else {
                res = {
                    type: 'media',
                    media: media,
                    rules: data.rules
                };
            }

            rules = rules.concat(res);
        });

        style.rules = rules;
    };
};
