#!/bin/bash
# Upload files to Github - https://github.com/talesCPV/number_match.git

read -p 'Comit to github? (y/n) ->' -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]
then

    git init

    git add *

    git commit -m "by_script"

    git remote add origin "https://github.com/talesCPV/number_match.git"

    git commit -m "by_script"

    git push -f origin master

fi

