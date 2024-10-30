# Backend Setup: MySQL WSL Installation Guide

### Run:
sudo apt-get\
install mysql-server\
sudo mysql_secure_installation

when prompted `n` for validate password component `y` for all others

### Check MySQL service status:
--------------------------------

### Run:
sudo systemctl status mysql


### Edit MySQL Server to allow access through MySQL Workbench / External Connections:
---------------------------------------

### Run:
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

#bind-address = `127.0.0.1` -> `0.0.0.0`

ctrl-O to save, ctrl-X to exit

### Restart MySQL Server:
--------------------------

### Run:

sudo service mysql restart

### Get WSL IP address:

### Run:
hostname -I

## Log into MySQL and enter commands to set up outside user:

### Run:

sudo mysql

CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';

GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

## Mysql Workbench:

Install on windows
click (+) next to MYSQL Connections
Enter IP address from hostname-I
Username: myuser
Password -> Store in vault: mypassword
Test Connection -> ok


# Frontend & Backend Setup:

## Node Setup:

### Install Node and npm:

sudo apt install nodejs npm

### Verify installation:
node -v
npm -v

### cd into `./backend` and add required node packages: 
npm install

#### Create `.env` file in the `./backend` folder and setup enviornmental variables
VITE_HOST=`localhost`\
VITE_USER=`myuser`\
VITE_PASSWORD=`your password`\
VITE_DATABASE=`financialtracker`

### cd into `./frontend` and add required node packages: 
npm install

### Start Backend:
cd `./backend`\
node server.js

### Start Frontend:
cd `./frontend`\
npm run dev

# Docker Setup

### Install Docker Desktop:
Windows: <https://docs.docker.com/desktop/install/windows-install/>\
Linux: <https://docs.docker.com/desktop/install/linux/ubuntu/>\
MacOS: <https://docs.docker.com/desktop/install/mac-install/>

### Running w/ Docker:
`docker-compose up --build`
