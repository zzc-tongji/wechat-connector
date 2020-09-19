#!/bin/sh
set -x

# work directory
SCRIPT_PATH=`cd "$(dirname "$0")"; pwd -P`
cd $SCRIPT_PATH

# signal
trap "$SCRIPT_PATH/docker-stop.sh" SIGTERM

# start
cd ..
yarn start
exit $?
