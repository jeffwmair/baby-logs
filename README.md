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

## Environment Setup

I'm using Vagrant (Ubuntu), mainly for Mysql.  So the initial setup is very easy.  Simply run `vagrant up` from your command-prompt (run as Admin).  This will provision the server and install and start the application

### Running Locally with VS Code

To run locally, I use `virtualenv` to manage my python dependencies.  So from a Windows Command-Prompt, create the virtualenv (if not created) with `virtualenv venv` (run that from the workspace root).  Then cd into `venv/Scripts` and run `Activate`.

Next install the pip packages with `pip install -r requirements.txt`

Once the environment is activated, launch VS Code from within that activated environment inside the command-prompt

Now you should be able to start & debug the application in VS Code, using the launch.json included in this repo.  

The application can be reached at [http://localhost:8080/](http://localhost:8080).

### Running inside Development VM

You can also run the application inside the vagrant VM.  After the initial vagrant up, ssh into the box and switch to /vagrant/app dir.  Then `python -m server` will start the app.  It should be available on `localhost:8071`.

### Debugging Unit Tests

To run the tests at the command line:
`python -m unittest discover`
This will find all th tests under the test package that start with "test"

There is a launch configuration in vscode running 1 unit test module at a time.  Currently not sure how to run "all" unit tests, but likely not hard to do.

## URLS

 - [http://localhost:8080/](http://localhost:8080/) (local)
 - [http://localhost:8071/](http://localhost:8071/) (directly to the app)
 - [http://localhost:8070/babylogs/](http://localhost:8070/babylogs/) (via apache reverse proxy)

 ## Other tips
 
 Create baby profiles in the DB:

 insert into baby (firstname, lastname, birthdate) values ('Baby', 'McBabyface', date('2015-01-01'));