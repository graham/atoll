#!/bin/bash

cd es6 ; ../node_modules/babel-cli/bin/babel.js --presets es2015 *.es6 --out-dir ../js/ -w
