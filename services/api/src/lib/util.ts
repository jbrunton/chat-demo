import * as crypto from 'crypto';

export const getRandomString = () => crypto.randomBytes(4).toString('hex');
