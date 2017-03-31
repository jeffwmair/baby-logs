#!/bin/bash
# deals with sporadit issue of not being able to hit the web resource that provides apt-get packages.  That's google's dns server
sudo echo "nameserver 8.8.8.8" > /etc/resolv.conf
apt-get install -y git
apt-get install -y python-pip
debconf-set-selections <<< 'mysql-server mysql-server/root_password password mysqlrootpass'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password mysqlrootpass'
apt-get install -y mysql-server-5.5
apt-get install -y apache2
# add the proxy module to apache
cd /etc/apache2/mods-enabled && ln -s ../mods-available/proxy_http.load proxy_http.load
cd /etc/apache2/mods-enabled && ln -s ../mods-available/proxy.load proxy.load
cat /vagrant/vagrant-scripts/apache2.conf >> /etc/apache2/apache2.conf
apachectl restart
MYCNF=".my.cnf"
cp /vagrant/vagrant-scripts/$MYCNF /home/vagrant/
chown vagrant /home/vagrant/$MYCNF