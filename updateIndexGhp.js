const p = require('./package.json');
const url = p.homepage;
const html = require('fs').readFileSync('./docs/index.html', 'utf8')
  .replace('<script type="text/javascript" src="/build/bundle.js"></script>', `<script type="text/javascript" src="${url}build/bundle.js"></script>`)
require('fs').writeFileSync('./docs/index.html', html, 'utf8')