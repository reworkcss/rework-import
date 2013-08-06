
module.exports = function(cwd){
  var path = require('path')
  var fs = require('graceful-fs')
  var css = require('css')

  cwd = path.resolve(cwd)

  return importer

  function importer(style, rework){
    var rules = []
    var imports = style.rules.map(map).filter(filter)
    var read = []

    // expand the media queries?

    imports.forEach(function(filename){
      if (read.indexOf(filename) >= 0) return

      var data = fs.readFileSync(filename, 'utf8')
      rules = css.parse(data).stylesheet.rules.concat(rules)
      read.push(filename)
    })

    rework.obj.stylesheet.rules = rules
  }

  function map(rule, index, array){
    // only care about imports
    if (rule.type !== 'import') return

    // ignore imports that are urls
    if (/^\s*http/.test(filename)) return

    var filename = rule.import
        // extract from url(<filename>)
        .replace(/^url\(/, '')
        .replace(/\)$/, '')
        // extract from single and double quotes
        .replace(/^("|\')/, '')
        .replace(/("|\')$/, '')

    // append .css if it's missing
    if (path.extname(filename) === '') filename += '.css'

    return path.resolve(cwd, filename)
  }

  function filter(filename, index, array){
    return !! filename
  }
}
