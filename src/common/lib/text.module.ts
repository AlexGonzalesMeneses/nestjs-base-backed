import * as crypto from 'crypto';

export const encrypt = (password: string): string =>
  crypto.createHash('sha256').update(password).digest('hex');

export const nano = function (template: string, data: string): any {
  template.replace(/\{([\w.]*)\}/g, function (str, key) {
    const keys = key.split('.');
    let v = data[keys.shift()];
    for (let i = 0, l = keys.length; i < l; i++) {
      v = v[keys[i]];
    }
    return typeof v !== 'undefined' && v !== null ? v : '';
  });
};
