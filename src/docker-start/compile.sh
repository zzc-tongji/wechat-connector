#!/bin/sh
set -x

# work directory
SCRIPT_PATH=`cd "$(dirname "$0")"; pwd -P`
cd $SCRIPT_PATH

# compile
gcc -include whereami.h -c whereami.c
gcc -include whereami.h -c main.c
gcc whereami.o main.o -o docker-start

# clean
rm -f whereami.o
rm -f main.o

# move
mv docker-start ../../runtime/
