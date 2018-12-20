#!/bin/bash
##
## displays change logs form git 
##
set -ex

# fetch tags, to be sure we have all the require info
git fetch --tags

# collect the commits since the last tag
export GIT_RELEASE_NOTES="$(git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h %s")"

# expose as env var for subsequent build steps
envman add --key GIT_RELEASE_NOTES --value "$GIT_RELEASE_NOTES"
