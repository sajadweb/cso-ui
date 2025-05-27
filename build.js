// build.js
const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const packageJson = require('./package.json');

const version = packageJson.version;
const distDir = `dist/${version}`;

//
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

//
const banner = `/*! Csoeventi ui Widget v${version} | MIT License | powerby https://github.com/sajadweb */\n`;

// پردازش JavaScript
const jsCode = fs.readFileSync('src/csoeventi-ui.js', 'utf8');
const jsResult = UglifyJS.minify(jsCode, {
  output: {
    preamble: banner
  }
});

fs.writeFileSync(`${distDir}/csoeventi-ui.min.js`, jsResult.code);

// پردازش CSS
const cssInput = fs.readFileSync('src/csoeventi-ui-style.css', 'utf8');
const cssResult = new CleanCSS({}).minify(cssInput);
fs.writeFileSync(`${distDir}/csoeventi-ui-style.min.css`, banner + cssResult.styles);

// آپدیت latest symlink
try {
  fs.unlinkSync('dist/latest');
} catch (err) {}
fs.symlinkSync(version, 'dist/latest');