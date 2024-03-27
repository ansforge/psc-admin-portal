#!/bin/bash

. $(dirname $0)/backend_setup.sh

for file in ${SCRIPT_DIR}/*.pid; do
  kill $(cat $file)
  rm $file
done