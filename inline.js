'use strict';

var css = require('css');
var fs = require('fs');
var path = require('path');

/**
 * Read the contents of a stylesheet
 *
 * @param {String} file
 * @api private
 */

function read(file) {
    var data = fs.readFileSync(file, 'utf8');
    var style = css.parse(data).stylesheet;

    return style;
}

/**
 * Check if a file exists
 *
 * @param {String} filename
 * @param {String|Array} cwd
 * @api private
 */

function check(filename, cwd) {
    if (!Array.isArray(cwd)) {
        cwd = Array.prototype.slice.call(arguments);
    }

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

/**
 * Inline stylesheet using `@import`
 *
 * @param {String|Array} cwd
 * @api public
 */

module.exports = function (cwd) {
    return function (style) {
        var rules = [];

        style.rules.forEach(function (rule) {
            if (rule.type !== 'import') {
                return rules.push(rule);
            }

            var re = /(url\s?\()?(\'|")(.*)(\'|")(\))?/g;
            var imprt = rule.import.match(re).toString();
            var media = rule.import.replace(re, '').replace(' ', '');
            var file = check(imprt, cwd);
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
