const plugins = [
  process.env.NODE_ENV !== 'production' && "react-refresh/babel",
  '@babel/plugin-syntax-dynamic-import'
].filter(Boolean);

const presets = [

];

module.exports = {
  env: {
    legacy: {
      presets: [
        ['@babel/preset-typescript', {
          jsxPragma: 'h',
        }],
        [
          '@babel/preset-env', {
            exclude: ['@babel/plugin-transform-typeof-symbol'],
            modules: false,
            loose: true,
            corejs: 3,
            targets: {
              browsers: ['last 2 versions', 'ie >= 11']
            },
            useBuiltIns: 'entry',
          }
        ]
      ],
      plugins: [
        ...plugins,
        ['@babel/plugin-transform-runtime', { corejs: 3 }],

        ['@babel/plugin-transform-react-jsx', {
          'pragma': 'h',
          'pragmaFrag': 'Fragment',
        }],
        [
          'auto-import', {
            'declarations': [
              { 'members': ['h', 'Fragment'], 'path': 'preact' }
            ]
          }
        ],
      ],
    },
    modern: {
      presets: [
        '@babel/preset-typescript',
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
  }
};
