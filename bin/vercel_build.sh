#!/bin/sh -ex
git submodule update --init --recursive

yarn add -D typescript @types/node
yarn add -D babel-plugin-styled-components
yarn gen:typescript-fetch
yarn build