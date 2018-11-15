import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";

import packageJson from "./package.json";

const external = [...Object.keys(packageJson.dependencies), "react"];

export default {
  input: "./src/index.tsx",
  plugins: [resolve(), commonjs(), typescript()],
  external,
  output: [
    {
      format: "esm",
      file: "index.js",
      dir: "./lib/esm"
    },
    {
      format: "amd",
      file: "index.js",
      dir: "./lib/amd"
    }
  ]
};
