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

## Installing Requirements (new section!)
```bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install python -y
sudo apt-get install virtualenv -y
sudo apt-get install mysql-server -y
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

# run the web server
$ ./scripts/start.sh
```

If there are no problems with any of the above steps, you should be able to access the system at [http://localhost:8080](http://localhost:8080)

## Web Server &  Reverse Proxying
My deployment (production & dev) consists of:
* python (cherrypy) in a virtualenvironment
* apache web server using a reverse proxy to redirect requests to the cherrypy instance running at its own port

**Example for dev:**
Snippet from httpd.conf:

```xml
<VirtualHost *:80>
ProxyPreserveHost On
ProxyRequests Off
ServerName babylogger_python
ProxyPass /ljpy http://localhost:8080/
ProxyPassReverse /ljpy http://localhost:8080/
</VirtualHost>
```

This also requires that I have a host mapping setup from babylogger_python to 127.0.0.1 in my hosts file.

Then go to: [http://babylogger_python/ljpy/](http://babylogger_python/ljpy/) **(Note the trailing forward slash!!)**

Some more information can be found here: https://github.com/jeffwmair/samplecode/tree/master/apache-virtualhosts

**Startup Note:**

When starting via the start.sh script, in order to be able to later disconnect the terminal from the shell, the process output must be redirected to a file.  So start like this:

```shell
./start.sh > log.txt &
```
