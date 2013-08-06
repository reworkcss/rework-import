# rework-import

A `rework` plugin for reading and concatenating css that uses `@import`

    var imprt = require('rework-import')

    rework(data)
    .use(imprt('your-stylesheets-dir'))
    .toString()


