#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-notes-manager-f3e8b792/frontend_notes
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

