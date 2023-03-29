#!/bin/bash

GITHUB_REMOTE='git@github.com:kjeld-dpg/design-tokens-freemium.git'
BITBUCKET_REMOTE='git@bitbucket.org:persgroep/design-tokens-freemium.git'

REMOTES=$(git remote -v)

# Remove the origin branch to prevent remote duplicates
if [[ "$REMOTES" == *"origin"* ]]; then
    git remote rm origin
fi

# Update the remote url for GitHub if it exists, otherwise add it to the local repository.
if [[ "$REMOTES" == *"github"*"$GITHUB_REMOTE"* ]]; then
    git remote set-url github $GITHUB_REMOTE
else
    git remote add github $GITHUB_REMOTE
fi

# Update the remote url for Bitbucket if it exists, otherwise add it to the local repository.
if [[ "$REMOTES" == *"bitbucket"*"$BITBUCKET_REMOTE"* ]]; then
    git remote set-url bitbucket $BITBUCKET_REMOTE
else
    git remote add bitbucket $BITBUCKET_REMOTE
fi

read -p 'Branch name: ' BRANCH

git fetch --all --prune

git checkout $BRANCH
if [ $? == '0' ]
then
    git pull github $BRANCH
    git pull bitbucket $BRANCH
    git push bitbucket $BRANCH
else
    echo 'Please provide a valid branch name'
fi