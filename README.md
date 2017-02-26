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

## Setup

I'm using vagrant, so you just need to run `vagrant up`, which use make use of a bootstrap script to configure the dependencies.

Once the vagrant machine is up, login with `vagrant ssh`, switch to the vagrant-sync'd directory `/vagrant`, and run the installation (next section).

### Install the application

```bash
./scripts/install.sh
```

## Login
Browse to:

[http://localhost:8091/](http://localhost:8091/)
