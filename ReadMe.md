mysql wsl installation guide
---------------------------------

sudo apt-get install mysql-server
sudo mysql_secure_installation

n for validate password component
y for all others

check mysql service status:
sudo systemctl status mysql

edit mysql server to allow access through mysql workbench / external connections:
------------------------------------
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

change: #bind-address = 127.0.0.1 -> #bind-address = 0.0.0.0

ctrl-O to save, ctrl-X to exit

restart mysql server:
sudo service mysql restart

get wsl ip address:
hostname -I

log into mysql and enter these commands to set up outside user:
------------------------------------------
sudo mysql

CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';

GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

Mysql Workbench:
------------------------------------------
Install on windows
click (+) next to MYSQL Connections
Enter IP address from hostname-I
Username: myuser
Password -> Store in vault: mypassword
Test Connection -> ok


Node setup:
-------------------------------------------
Install Node and npm:
sudo apt install nodejs npm

verify installation:
node -v
npm -v

Add required node packages:
npm init -y
npm install express mysql2 cors

run node server:
node server.js
