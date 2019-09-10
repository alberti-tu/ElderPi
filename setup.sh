#!/bin/bash
if [ $(id -u) -ne 0 ] ; then echo "Please run as root" ; exit 1 ; fi

echo "Updating packages..."
apt update -y
apt upgrade -y

echo "Installing NodeJS and NPM..."
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt install nodejs -y

echo "Updating NPM and Angular to the latest version..."
npm install -g npm
npm install -g @angular/cli

echo "Installing programs..."
apt install mariadb-server screen -y
mysql --user="root" --database="mysql" --execute="update user set plugin='' where User='root'; flush privileges;"

echo "Changing the Network Manager"
apt install network-manager network-manager-gnome openvpn \openvpn-systemd-resolved network-manager-openvpn \network-manager-openvpn-gnome -y
apt purge openresolv dhcpcd5 -y
ln -sf /lib/systemd/resolv.conf /etc/resolv.conf

echo "Cleaning packages..."
apt clean -y
apt autoremove -y

cd ElderPi-client
npm install
cd ..

cd ElderPi-server
npm install
cd ..

cd ElderPi-server/certificate
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365
cd ../..

echo "Process finished!"
echo "Now reboot..."

reboot


