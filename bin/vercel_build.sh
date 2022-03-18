#!/bin/sh -ex
git submodule update --init --recursive

yarn gen:typescript-fetch

cd workers
yarn install --ignore-engines

yarn add -D gulp del gulp-babel --ignore-engines

yarn run build-worklet
cd ..
yarn build
