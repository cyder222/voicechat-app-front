#!/bin/sh -ex
git submodule update --init --recursive

yarn gen:typescript-fetch
yarn build