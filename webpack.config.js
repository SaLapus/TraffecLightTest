const path = require("path");

const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = "vue-style-loader";

const config = {
  entry: {
    index: {
      import: "./src/main.ts",
      dependOn: ["vue", "vuex", "router"],
    },
    vue: ["vue", "vue-class-component", "vue-property-decorator"],
    vuex: "vuex",
    router: "vue-router",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  devServer: {
    open: true,
    hot: false,
    liveReload: false,
    host: "localhost",
    static: {
      directory: path.join(__dirname, "dist"),
    },
    historyApiFallback: {
      index: "index.html",
    },
  },
  resolve: {
    extensions: [".ts", ".vue", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new DefinePlugin({
      BASE_URL: JSON.stringify("/"),
      "process.env.BASE_URL": JSON.stringify("/"),
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
      inject: "head",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "./", filter: (res) => !res.includes("html") }],
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            ts: "ts-loader",
          },
        },
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.js?$/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
