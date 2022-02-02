#!/usr/bin/env bash

echo 'Compiling basics scenarios'
for filename in demo/basics/*.alc; do
bin/cli generate $filename -d  ./demo/basics/generated/
done

echo 'Compiling advanced scenario'
for filename in demo/advanced/*.alc; do
bin/cli generate $filename -d  ./demo/advanced/generated/
done
