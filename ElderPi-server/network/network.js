const network = require('network');
const ip = require('ip');

let ip_local = '';  // IPv4 of WSN interface
let subnet = '';    // Subnet mask lenght

// Set the ip address and subnet mask of the selected interface
const interfaces = async function interfaces(search) {
    await network.get_interfaces_list(function(err, inet) {
        if(err) return console.error(err);

        for(let i = 0; i < inet.length; i++) {
            if(inet[i].name === search) {
                ip_local = inet[i].ip_address;
                subnet = ip.subnet(inet[i].ip_address, inet[i].netmask).subnetMaskLength;
                return console.log(search + ' interface configured for WSN')
            }
        }

        console.error('Can not configure ' + search + ' interface for WSN')
    });
};

// Check if the ip address is at LAN side
const isFromLan = function isFromLan(ip_remote) {
    if(ip_remote == null) return true;  // Allow acces from Localhost
    return ip.cidrSubnet(ip_local + '/' + subnet).contains(ip_remote);
};

module.exports = {
    interfaces: interfaces,
    isFromLan: isFromLan
};
