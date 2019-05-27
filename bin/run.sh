#!/bin/bash
APP_DIR=$PWD/app

MT_VOL="-v $PWD/app/app_files:/usr/src/app/app_files"

docker run $MT_VOL -p 4000:4000 -it --rm --name gotcha gotcha
