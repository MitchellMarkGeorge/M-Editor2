const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    target: 'electron-renderer', //should i use this???
    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'build'),
      
    },
    devServer: { overlay: true },

    

    module: {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                  }
                
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]

            },

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
        ]
    }, 

    plugins: [
        new CleanWebpackPlugin(), 
        new HtmlWebPackPlugin({
            template: "./index.html",
            
          }),

        new CopyPlugin([
          {from: 'M-Editor.png', to: 'M-Editor.png'},
          {from: 'main.js', to: 'main.js'}
        ])

    



        // new ErrorOverlayPlugin()
    ],

    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts'],
        
      }
  };