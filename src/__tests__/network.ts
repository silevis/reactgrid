import { networkInterfaces } from 'os';

export function getLocalIpAdresses(): string[] {
    const nets = networkInterfaces();
    const addresses: string[] = [];
    Object.keys(nets).forEach((name) => {
        nets[name]
            ?.filter((net) => net.family === 'IPv4' && !net.internal && !addresses.includes(net.address))
            .forEach((net) => {
                addresses.push(net.address);
            })
    });
    if (addresses.length < 1) {
        throw new Error(`Cannot obtain local IP addresses`);
    }
    return addresses;
}
