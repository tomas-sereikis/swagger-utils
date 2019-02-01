#!/usr/bin/env bash

mkdir -p typings/generated
cp node_modules/joi-extract-type/dist/index.d.ts typings/generated/joi-extract-type.d.ts
