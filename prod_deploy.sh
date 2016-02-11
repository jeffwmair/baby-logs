#!/bin/bash
if [[ -z $1 ]]; then
	echo "Please provide ssh connection"
	exit 1
fi

SERVER=$1

ssh $SERVER << _EOF_
mkdir -p /var/www/html/liamjournal
_EOF_

rsync -azP * \
	--exclude "*.swp" \
	--exclude "*.sh" \
	--exclude ".DS_Store" \
	--exclude "notes" \
	--exclude "README.md" \
	--exclude "credentials.php" \
	--exclude "scripts/" \
	--exclude "database/" \
	--exclude "python/" \
	--exclude "resources/" \
	--exclude "js_tests/" \
	--exclude "test/" \
	--exclude "docs/" \
	$SERVER:/var/www/html/liamjournal
