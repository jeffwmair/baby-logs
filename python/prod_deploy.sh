#!/bin/bash
if [[ -z $1 ]]; then
	echo "Please provide ssh connection"
	exit 1
fi

SERVER=$1

ssh $SERVER << _EOF_
mkdir -p /var/www/html/ljpy
_EOF_

rsync -azP * \
	--exclude "*.swp" \
	--exclude "*.sh" \
	--exclude ".DS_Store" \
	--exclude ".gitignore" \
	--exclude "README.md" \
	--exclude "credentials.properties" \
	--exclude "scripts/" \
	--exclude "database/" \
	--exclude "test/" \
	--exclude "venv/" \
	$SERVER:/var/www/html/ljpy
