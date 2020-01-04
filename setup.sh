#!/bin/bash
if [ "$(id -u)" -ne 0 ] ; then echo "Please run as root" ; exit 1 ; fi

# Updating packages...
apt update -y
apt upgrade -y

# Installing NodeJS and NPM...
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt install nodejs -y

# Installing latest verison of NodeJS
npm cache clean -f
npm install -g n
n stable
PATH="$PATH"

# Installing programs...
apt install mariadb-server screen -y

# Root permisions for database access
mysql --user="root" --database="mysql" --execute="update user set plugin='' where User='root'; flush privileges;"

# Compiling server...
cd ElderPi-server || exit
npm install
mkdir certificate
mkdir public
cd ..

# Compiling client...
cd ElderPi-client || exit
npm install
ng build --prod
cd ..

# Generating SSL certificates...
openssl req -nodes -new -x509 -keyout ElderPi-server/certificate/server.key -out ElderPi-server/certificate/server.cert -days 365

# Cleaning packages...
apt clean -y
apt autoremove -y
