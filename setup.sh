#!/bin/bash
if [ "$(id -u)" -ne 0 ] ; then echo "Please run as root" ; exit 1 ; fi

# Updating packages...
apt update -y
apt upgrade -y

# Installing NodeJS and NPM...
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt install nodejs -y

# Updating NPM and Angular to the latest version...
npm install -g npm
npm install -g @angular/cli

# Installing programs...
apt install mariadb-server screen dnsmasq hostapd -y

# Root permisions for database access
mysql --user="root" --database="mysql" --execute="update user set plugin='' where User='root'; flush privileges;"

# Stop services for Access Point
systemctl stop dnsmasq
systemctl stop hostapd

# Configuring static IP
cp config/dhcpcd.conf /etc/dhcpcd.conf
service dhcpcd restart

# Configuring DHCP server
mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
cp config/dnsmasq.conf /etc/dnsmasq.conf
systemctl reload dnsmasq

# Configuring Wi-Fi atributes...
cp config/hostapd.conf /etc/hostapd/hostapd.conf
cp config/hostapd /etc/default/hostapd

# Starting services for Acces Point
systemctl unmask hostapd
systemctl enable hostapd
systemctl start hostapd

# Compiling client...
cd ElderPi-client || exit
npm install
npm run-script build
cd ..

# Compiling server...
cd ElderPi-server || exit
npm install
mkdir certificate
cd ..

# Generating SSL certificates...
openssl req -nodes -new -x509 -keyout ElderPi-server/certificate/server.key -out ElderPi-server/certificate/server.cert -days 365

# Cleaning packages...
apt clean -y
apt autoremove -y
