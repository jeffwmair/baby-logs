# Baby Logs
Application to track baby sleeping, feeding and diapers.

## Screenshots

**Dashboard**

![Alt text](/docs/DashboardPage.png)

**Entry Page**

![Alt text](/docs/EntryPage.png)

**Report Page**

![Alt text](/docs/ReportPage.png)

## Getting Started

Steps to get going.  Note: there is a scripts/recreate_database.sh script, but it relies on a seed data script that I have excluded (personal info).  But you can basically use it for the 1st step.

```bash
# Setup the Mysql database.  
$ mysql <yourdb> < database/create_tables.sql
# Create your python virtual env using:
$ virtualenv venv
# Activate the environment
$ source activate_environment.sh
#After activating the environment, run the load_requirements_into_venv script.
$ source scripts/load_requirements_into_venv.sh
# run unit tests (if you like)
$ source scripts/runtests.sh     # note that we are sourcing these scripts
# run the web server (go to http://localhost:8080)
$ source scripts/start.sh
```

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
