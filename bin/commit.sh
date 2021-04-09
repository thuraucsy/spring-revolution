#!/usr/bin/env bash

set -e

git branch

GIT_STATUS="$(git status --short)"
echo "$GIT_STATUS"

if [[ $GIT_STATUS != *"build/v1/backup/"* ]]; then
	echo "master ဆီ commit လုပ်စရာမလိုသေး"
	exit
fi

GIT_PREV_COMMIT_MSG="$(git log --oneline -1)"
echo "$GIT_PREV_COMMIT_MSG"

git config user.email "${GITHUB_EMAIL}"
git config user.name "${GITHUB_USERNAME}"
git add build/v1/backup/

GIT_COMMIT_MSG="auto commit by using github actions"
echo "$GIT_COMMIT_MSG"
if [[ $GIT_PREV_COMMIT_MSG == *"$GIT_COMMIT_MSG" ]]; then
	echo "git history ရှင်းနေစေဖို့ commit အသစ်မဖန်တီးဘဲ အဟောင်းကို replace လုပ်ပစ်ပါမယ်"
	git commit --amend --no-edit
else
	git commit -m "$GIT_COMMIT_MSG"
fi

git push --force "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@${GITHUB_REFERENCE}" HEAD:master