/* eslint-env node */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * @typedef {import("webpack").Configuration} WebpackConfig
 * @typedef {import("webpack").Entry} WebpackEntry
 * @typedef {import("webpack").EntryFunc} WebpackEntryFunc
 * @typedef {{ webpack: (config: WebpackConfig) => WebpackConfig, [key: string]: any }} NextConfig
 */

require("dotenv").config();
const CopyPlugin = require("copy-webpack-plugin");

/** @type {(config: NextConfig) => NextConfig} */
const nextConfig = {
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      TEST_VAR: process.env.TEST_VAR,
      DEV_MODE: process.env.ENV_DEV_MODE,
    },
    future: { webpack5: true },
    webpack(config, { isServer, dev }) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        dns: false,
        tls: false,
      };
      config.output.chunkFilename = isServer
      ? `${dev ? "[name]" : "[name].[fullhash]"}.js`
      : `static/chunks/${dev ? "[name]" : "[name].[fullhash]"}.js`;
    // Overcome webpack referencing `window` in chunks
    config.output.globalObject = "(typeof self !== 'undefined' ? self : this)";
    config.plugins.push(
      new CopyPlugin({
          patterns: [
              {
                  from: "./node_modules/onnxruntime-web/dist/*.wasm",
                  to: "[name].[ext]",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/*.wasm",
                to: "static/[name].[ext]",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/*.wasm",
                to: "server/[name].[ext]",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/*.wasm",
                to: "static/chunks/[name].[ext]",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/*.wasm",
                to: "./public/[name].[ext]",
              },
          ],
      }),
    );
    return config;
    },
  };           

module.exports = nextConfig;
