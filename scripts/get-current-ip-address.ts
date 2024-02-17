// Name: Get current ip address

import "@johnlindquist/kit"

import { networkInterfaces } from "os"

const addresses = [];
const allInterfaces = networkInterfaces();

for (const interfaceKey in allInterfaces) {
    const interfaces = allInterfaces[interfaceKey];
    for (let i = 0; i < interfaces.length; i++) {
        const address = interfaces[i];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

clipboard.writeText(addresses[0])
