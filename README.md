# Baby Logs
Application to track baby sleeping, feeding and diapers.

Basic usage is to go to the **Entry** screen and enter instances of sleep, feedings, and diaper changes.  Then you can view the day's overview on the **Overview** page, with some high level metrics, or view daily & weekly summaries on the **Charts** page.

## Screenshots

**Dashboard**

![Alt text](/docs/DashboardPage.png)

**Entry Page**

![Alt text](/docs/EntryPage.png)

**Report Page**

![Alt text](/docs/ReportPage.png)

## Requirements:

* Python 2.7
* VirtualEnvironment (sudo apt-get install python-virtualenv)
* Mysql (default login must have access to create databases, users, add tables; ie, put user/password into ~/.my.cnf)
* Apache for reverse-proxying

## Installing Requirements (new section!)
```bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install python -y
sudo apt-get install virtualenv -y
sudo apt-get install mysql-server -y
sudo apt-get install apache2 -y
```

### Additional Apache Setup for Reverse Proxying to the Python App

```bash
# add the proxy module to apache
cd /etc/apache2/mods-enabled && ln -s ../mods-available/proxy_http.load proxy_http.load
cd /etc/apache2/mods-enabled && ln -s ../mods-available/proxy.load proxy.load

# edit apache2.conf (/etc/apache2/apache2.conf), and add the following (replace babylogs with whatever directory you want; ie, http://server/babylogs/):
ProxyPreserveHost On
ProxyRequests Off
ProxyPass /babylogs http://127.0.0.1:8080/
ProxyPassReverse /babylogs http://127.0.0.1:8080/

# restart
sudo apachectl restart
```

## Getting Started

First verify that the requirements are installed:
```bash
# This should open an python interactive prompt. 
# Just hit ctrl-d to exit.
$ python		

# This should log you directly into mysql.  
# If not, you may need to configure your .my.cnf file.
$ mysql

# This should give a meaningful version number like 14.0.5
$ virtualenv --version
```

Clone the repo

```bash
git clone https://github.com/jeffwmair/baby-logs.git && cd baby-logs
```

Bootstrap the system:
```bash
# Create your python virtual env using:
$ virtualenv venv

# Activate the environment
$ source activate_environment.sh

# After activating the environment, run the load_requirements_into_venv script.
$ ./scripts/load_requirements_into_venv.sh

# Configure your credentials.properties.
# Copy the sample to credentials.properties, then edit the file and set
# your desired mysql user, password, dbname (and host if its not localhost)
$ cp credentials.properties.sample credentials.properties

# Setup our mysql database; from credentials.properties, the provided dbname will be created; user will be created and assigned to the db
$ ./scripts/init_db.sh

# run unit tests (if you like)
$ ./scripts/runtests.sh     

# at this point you can import your database backup if you have one
$ mysql {your_db_name} < backup.sql

# run the web server (disconnect so we can exit from the ssh session)
$ ./scripts/start.sh > logs.txt &
```

## Visit the Application
Browse to:

[http://yourserver/babylogs/ -- via apache](http://yourserver/babylogs/)

or

[http://yourserver:8080/ -- python app](http://yourserver:8080/)
