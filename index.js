'use strict';

var css = require('css');
var findFile = require('find-file');
var fs = require('fs');
var parseImport = require('parse-import');

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
        if (rule.type !== 'import') {
            return rules.push(rule);
        }

        var content;
        var data = parseImport(rule.import);
        var file = self._check(data.path);
        var media = data.condition;
        var res;

        content = self._read(file);

        if (!media || !media.length) {
            res = content.rules;
        } else {
            res = {
                type: 'media',
                media: media,
                rules: content.rules
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
    var style = css.parse(data).stylesheet;

    return style;
};

/**
 * Check if a file exists
 *
 * @param {String} name
 * @api private
 */

Import.prototype._check = function (name) {
    var file = findFile(name, { path: this.path, global: false })[0];

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
