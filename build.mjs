import fs from 'fs';
import brotliSize from 'brotli-size';
import esbuild from 'esbuild';

if (!fs.existsSync(`./dist`)) {
  fs.mkdirSync(`./dist`, '0744');
}

fs.readdirSync('./builds').forEach((folder) => {
  if (!fs.existsSync(`./dist/${folder}`)) {
    fs.mkdirSync(`./dist/${folder}`, '0744');
  }
  // Go through each file in the package's "build" directory
  // and use the appropriate bundling strategy based on its name.
  fs.readdirSync(`./builds/${folder}`).forEach((file) => {
    bundleFile(folder, file);
  });
});

function bundleFile(packageName, file) {
  // Based on the filename, give esbuild a specific configuration to build.
  ({
    // This output file is meant to be loaded in a browser's <script> tag.
    'cdn.js': () => {
      build({
        entryPoints: [`builds/${packageName}/${file}`],
        outfile: `dist/${packageName}/${file}`,
        bundle: true,
        platform: 'browser',
        define: { CDN: true },
      });

      // Build a minified version.
      build({
        entryPoints: [`builds/${packageName}/${file}`],
        outfile: `dist/${packageName}/${file.replace('.js', '.min.js')}`,
        bundle: true,
        minify: true,
        platform: 'browser',
        define: { CDN: true },
      }).then(() => {
        outputSize(
          packageName,
          `dist/${packageName}/${file.replace('.js', '.min.js')}`
        );
      });
    },
    // This file outputs two files: an esm module and a cjs module.
    // The ESM one is meant for "import" statements (bundlers and new browsers)
    // and the cjs one is meant for "require" statements (node).
    'module.js': () => {
      build({
        entryPoints: [`builds/${packageName}/${file}`],
        outfile: `dist/${packageName}/${file.replace('.js', '.mjs')}`,
        bundle: false,
        platform: 'neutral',
        mainFields: ['main', 'module'],
      });

      build({
        entryPoints: [`builds/${packageName}/${file}`],
        outfile: `dist/${packageName}/${file.replace('.js', '.cjs')}`,
        bundle: true,
        target: ['node10.4'],
        platform: 'node',
      });
    },
  }[file]());
}

function build(options) {
  options.define || (options.define = {});

  options.define['process.env.NODE_ENV'] = process.argv.includes('--watch')
    ? `'production'`
    : `'development'`;

  return esbuild
    .build({
      watch: process.argv.includes('--watch'),
      ...options,
    })
    .catch(() => process.exit(1));
}

function outputSize(packageName, file) {
  const size = bytesToSize(brotliSize.sync(fs.readFileSync(file)));
  console.log('\x1b[32m', `${packageName}: ${size}`);
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
