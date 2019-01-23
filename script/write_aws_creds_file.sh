#!/bin/bash

mkdir ~/.aws/
echo "[amplify]\naws_access_key_id=$AWS_ACCESS_KEY_AMPLIFY\naws_secret_access_key=$AWS_SECRET_KEY_AMPLIFY" > ~/.aws/credentials
