#!/bin/bash

mkdir -p ~/.aws/

cat <<EOF > ~/.aws/credentials
[amplify]
aws_access_key_id=$AWS_ACCESS_KEY_AMPLIFY
aws_secret_access_key=$AWS_SECRET_KEY_AMPLIFY
EOF

cat <<EOF > ~/.aws/config
[profile amplify]
region=us-west-2
EOF
