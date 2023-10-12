// Name: Get current ip address

import "@johnlindquist/kit"

import os from "os"

const networkInterfaces = os.networkInterfaces();
const addresses = [];

for (const interfaceKey in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceKey];
    for (let i = 0; i < interfaces.length; i++) {
        const address = interfaces[i];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

clipboard.writeText(addresses[0])
