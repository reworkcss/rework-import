
module.exports = function(cwd){
  var path = require('path')
    , fs = require('graceful-fs')
    , css = require('css')

  cwd = path.resolve(cwd)

  return function(style){
    expand(style)
  }

  // checks for imports and reads/ exands them into the style.rules
  function expand(style){
    var rules = []

    for (var i = 0; i < style.rules.length; i++){
      var rule = style.rules[i]
        , isNotImport = rule.type !== 'import'

      if (isNotImport || !filename(rule.import)) {
        rules.push(rule)
        continue
      }

      var expanded = scan(filename(rule.import))
      rules = rules.concat(expanded.rules)
    }

    style.rules = rules

    if (hasImports(style)) expand(style)
  }

  function hasImports(style){
    var imports = style
        .rules
        .filter(function(rule){
          return rule.type === 'import'
        })

    return !! imports.length
  }

  function scan(filename){
    var data = fs.readFileSync(filename, 'utf8')
    var style = css.parse(data).stylesheet

    return style
  }

  function filename(id){
    // ignore imports that are urls
    if (/^\s*http/.test(id)) return

    var file = id
        // extract from url(<filename>)
        .replace(/^url\(/, '')
        .replace(/\)$/, '')
        // extract from single and double quotes
        .replace(/^("|\')/, '')
        .replace(/("|\')$/, '')

    // append .css if it's missing
    if (path.extname(file) === '') file += '.css'

    // resolve against the cwd
    file = path.resolve(cwd, file)

    return file
  }
}
