#!/bin/bash

#echo Hellajksjla

mongo inStyle --eval 'db.users.drop(); db.images.drop();'
rm ./public/images/*

echo Hello
