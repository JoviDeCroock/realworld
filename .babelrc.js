const plugins = [
  process.env.NODE_ENV !== 'production' && "@prefresh/babel-plugin",
  '@babel/plugin-syntax-dynamic-import'
].filter(Boolean);

module.exports = {
  env: {
    modern: {
      presets: [
        ['@babel/preset-modules', { loose: true }]
      ],
      plugins: [
        ...plugins,
        ['babel-plugin-transform-jsx-to-htm', {
          'import': {
            'module': 'htm/preact',
            'export': 'html'
          }
        }]
      ],
    },
    server: {
      presets: [
        ['@babel/preset-modules', { loose: true }]
      ],
      plugins: [
        ...plugins,
        ['babel-plugin-transform-jsx-to-htm', {
          'import': {
            'module': 'htm/preact',
            'export': 'html'
          }
        }]
      ],
    }
  },
};
