#!/bin/bash
# Deploys to S3 & Cloudfront

aws s3 sync build/ s3://async-web --cache-control max-age=172800 --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths /index.html