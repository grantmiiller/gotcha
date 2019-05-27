#!/bin/bash
APP_DIR=$PWD/app

MT_VOL="-v $PWD/app:/usr/src/app"

docker run $MT_VOL -p 4000:4000 -it --rm --name gotcha gotcha
