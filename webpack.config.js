const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import plugin

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    static: './dist',
    proxy: [
      {
        context: ['/api'], // Menentukan path yang ingin di-redirect
        target: 'https://notes-api.dicoding.dev/v2',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    ]
  },  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Menambahkan plugin untuk mengekstrak CSS
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css', // Output file CSS di dalam folder dist
    }),
  ],
  mode: 'development',
};
