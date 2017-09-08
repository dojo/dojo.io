#!/bin/bash

set -ev
pushd .
if [ -d "site/source/tutorials/$TUTORIAL/demo/initial/biz-e-corp" ]; then
    cd site/source/tutorials/$TUTORIAL/demo/initial/biz-e-corp
    npm install
    dojo build
fi
popd
pushd .
if [ -d "site/source/tutorials/$TUTORIAL/demo/finished/biz-e-corp" ]; then
    cd site/source/tutorials/$TUTORIAL/demo/finished/biz-e-corp
    npm install
    dojo test
fi
popd

exit 0;
