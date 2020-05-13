#!/bin/bash
# Local deploytment script - deploys to S3 & Cloudfront

aws s3 sync build/ s3://async-web --cache-control max-age=172800 --delete
aws s3 cp s3://async-web/index.html s3://async-web/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths /index.html