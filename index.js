'use strict';

var path = require('path');

var css = require('css');
var findFile = require('find-file');
var fs = require('graceful-fs');
var parseImport = require('parse-import');

function clone(obj) {
  if (null === obj || "object" != typeof obj) {
    return obj;
  }

  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
}


/**
 * Inline stylesheet using `@import`
 *
 * @param {Object} style
 * @param {Object} opts
 * @api public
 */

function Import(style, opts) {
    this.opts = opts || {};
    this.opts.path = (typeof opts.path === 'string' ? [opts.path] : (opts.path || [process.cwd()]));
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

        var data = parseImport(rule.import);
        var opts = clone(self.opts);
        opts.file = self._check(data.path, self.opts.path);
        var dirname = path.dirname(opts.file);
        if (opts.path.indexOf(dirname) === -1 ) {
            opts.path = opts.path.slice()
            opts.path.unshift(dirname);
        }

        var media = data.condition;
        var res;
        var content = self._read(opts.file);
        parseStyle(content, opts)

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
    var file = findFile(name, { path: this.opts.path, global: false });

    if (!file) {
        //@todo handle a stack trace of the import ?
        throw new Error('failed to find ' + name + (opts.file ? " (from " + opts.file + ")" : "") + " in [ " + this.opts.path.join(", ") + " ]");
    }

    return file[0];
};

/**
 * Parse @import in given style
 *
 * @param {Object} style
 * @param {Object} opts
 */
function parseStyle(style, opts) {
    var inline = new Import(style, opts);
    var rules = inline.process();

    style.rules = rules;
}


/**
 * Module exports
 */

module.exports = function (opts) {
    return function (style) {
        parseStyle(style, opts)
    };
};
