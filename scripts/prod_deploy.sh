#!/bin/bash
if [[ -z $1 ]]; then
	echo "Please provide ssh connection"
	return
fi

cd "$BABY_LOGGER"

SERVER=$1

ssh $SERVER << _EOF_
mkdir -p /var/www/html/liamjournal
_EOF_

rsync -azP * \
	--exclude "*.swp" \
	--exclude "notes" \
	--exclude ".DS_Store" \
	--exclude ".gitignore" \
	--exclude "README*md" \
	--exclude "credentials.properties*" \
	--exclude "scripts/" \
	--exclude "*.sh" \
	--exclude "database/" \
	--exclude "test/" \
	--exclude "venv/" \
	$SERVER:/var/www/html/liamjournal