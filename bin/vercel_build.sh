#!/bin/sh -ex
git submodule update --init --recursive
yarn install
yarn gen:typescript-fetch
yarn add --dev typescript @types/node
yarn build