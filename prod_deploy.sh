#!/bin/bash
if [[ -z $1 ]]; then
	echo "Please provide ssh connection"
	exit 1
fi

SERVER=$1

ssh $SERVER << _EOF_
mkdir -p public_html/liamjournal
_EOF_

rsync -azP * --exclude "scripts/" --exclude "credentials.php" --exclude "database/" --exclude "*.sh" $SERVER:public_html/liamjournal
