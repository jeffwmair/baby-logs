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

**DB Setup**

Setup the Mysql database.  

```bash
$ mysql <yourdb> < database/create_tables.sql
```

**Environment Activation**

Activate the environment by sourcing `activate_environment.sh`. This introduces an environment variable used by other scripts, and it activates the python `virtual environment`.
```bash
$ source activate_environment.sh
```

**Run the Tests**

After activating the environment, run the tests with:
```bash
$ source scripts/runtests.sh     # note that we are sourcing these scripts
```

**Start the web server**

After calling the following script, the server should be running at http://localhost:8080

```bash
$ source scripts/start.sh
```

## Web Server & Python Configuration
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
