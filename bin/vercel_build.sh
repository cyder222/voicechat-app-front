#!/bin/sh -ex
git submodule update --init --recursive
yarn
yarn gen:typescript-fetch
yarn add --dev typescript @types/node
yarn add -D babel-plugin-styled-components
yarn build