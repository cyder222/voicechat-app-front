#!/bin/sh -ex
git submodule update --init --recursive

yarn gen:typescript-fetch

cd workers
yarn --ignore-engines
yarn gulp
cd ..
yarn build
