import * as crypto from 'crypto';

export const encrypt = (password: string): string =>
    crypto.createHash('sha256')
          .update(password)
          .digest('hex');

export const nano = (template: string, data: string): string =>
    template.replace(/\{([\w.]*)\}/g, function (str, key) {
        let keys = key.split('.');
        let v = data[keys.shift()];
        for ( let i: number = 0, l = keys.length; i < l; i++ ) { v = v[keys[i]]; }
        return (typeof v !== 'undefined' && v !== null) ? v : '';
    });
