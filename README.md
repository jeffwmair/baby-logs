# Baby Logs
Application to track baby sleeping, feeding and diapers.

## Web Server & Python Configuration
My deployment (production & dev) consists of:
* python (cherrypy) in a virtualenvironment
* apache web server using a reverse proxy to redirect requests to the cherrypy instance running at its own port

### Example for dev:
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

## Dashboard
![Alt text](/docs/DashboardPage.png)

## Entry Page
![Alt text](/docs/EntryPage.png)

## Report Page
![Alt text](/docs/ReportPage.png)
