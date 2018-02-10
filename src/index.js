import path from 'path';
import rtlcss from 'rtlcss';

const cssOnly = filename => path.extname(filename) === '.css';

class RtlCssPlugin {
  constructor(options) {
    if (typeof options === 'string') {
      options = {
        filename: options
      };
    }
    this.options = options || {
      filename: '[name].rtl.css'
    };
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      // Explore each chunk (build output):
      compilation.chunks.forEach(chunk => {
        // Explore each asset filename generated by the chunk:
        chunk.files.filter(cssOnly).forEach(filename => {
          // Get the asset source for each file generated by the chunk:
          const src = compilation.assets[filename].source();
          const dst = rtlcss.process(src);
          const dstFileName = compilation.getPath(this.options.filename, {chunk});

          compilation.assets[dstFileName] = {
            source() {
              return dst;
            },
            size() {
              return dst.length;
            }
          };
          chunk.files.push(dstFileName);
        });
      });

      callback();
    });
  }
}

module.exports = RtlCssPlugin;
