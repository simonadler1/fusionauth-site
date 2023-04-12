#!/bin/sh

filename=$1
filename_no_md=`echo $filename | sed 's/\.md//'`
section=$2
image_override=$3

if [ "x$2" = "x" ]; then
  echo "$0 filename newsection"
  echo "for example: $0 saml-vs-oauth.md oauth"
  exit 1
fi

mkdir -p astro/src/content/articles/$section

git mv site/learn/expert-advice/oauth/$file astro/src/content/articles/$section

mkdir -p astro/public/img/articles/$section/$file_no_md
git mv site/assets/img/advice/$file_no_md/  astro/public/img/articles/$section/$file_no_md

echo "update front matter, remove layout"

echo "update images"

grep image.liquid astro/src/content/articles/$section/$filename |sed 's/class=/=/' | sed 's/alt=/=/'|awk -F'=' '{print "!["$3"]("$2")"}'|sed 's/"[ ]*//g'|sed 's!assets/img/advice!img/articles/'$section'!'


#echo "handle includes if needed"

echo "add redirect to cloudfront, use this"

echo "'/learn/expert-advice/$section/$filename_no_md': '/articles/$section/$filename_no_md',"

