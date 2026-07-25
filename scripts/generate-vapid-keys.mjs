import { createECDH } from 'node:crypto';

const vapid = createECDH('prime256v1');
vapid.generateKeys();

console.log('VAPID_PUBLIC_KEY=' + vapid.getPublicKey().toString('base64url'));
console.log('VAPID_PRIVATE_KEY=' + vapid.getPrivateKey().toString('base64url'));
