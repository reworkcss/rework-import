'use strict';

var css = require('css');
var fs = require('fs');
var path = require('path');
var whitespace = require('css-whitespace');

/**
 * Inline stylesheet using `@import`
 *
 * @param {Object} style
 * @param {Object} opts
 * @api public
 */

function Import(style, opts) {
    opts = opts || {};
    this.opts = opts;
    this.path = opts.path || process.cwd();
    this.rules = style.rules || [];
}

/**
 * Process stylesheet
 *
 * @api public
 */

Import.prototype.process = function () {
    var rules = [];
    var self = this;

    this.rules.forEach(function (rule) {
        var data;
        var file;
        var media;
        var regex = /(url\s?\()?(\'|")(.*)(\'|")(\))?/g;
        var res;

        if (rule.type !== 'import') {
            return rules.push(rule);
        }

        media = rule.import.replace(regex, '').replace(' ', '');
        file = self._check(rule.import.match(regex).toString());
        data = self._read(file);

        if (!media || !media.length) {
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

    return rules;
};

/**
 * Read the contents of a file
 *
 * @param {String} file
 * @api private
 */

Import.prototype._read = function (file) {
    var data = fs.readFileSync(file, this.opts.encoding || 'utf8');
    var style;

    if (this.opts.whitespace) {
        data = whitespace(data);
    }

    style = css.parse(data).stylesheet;

    return style;
};

/**
 * Check if a file exists
 *
 * @param {String} name
 * @api private
 */

Import.prototype._check = function (name) {
    this.path = Array.isArray(this.path) ? this.path : [this.path];
    var file;

    name = name
        .replace(/^url\s?\(/, '')
        .replace(/\)$/, '')
        .replace(/^("|\')/, '')
        .replace(/("|\')$/, '');

    file = this.path.map(function (dir) {
        return path.join(dir, name);
    }).filter(fs.existsSync)[0];

    if (!file) {
        throw new Error('failed to find ' + name);
    }

    return file;
};

/**
 * Module exports
 */

module.exports = function (opts) {
    return function (style) {
        var inline = new Import(style, opts);
        var rules = inline.process();

        style.rules = rules;
    };
};
