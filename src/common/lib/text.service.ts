import { createHash } from 'crypto';
import { v5, v4 } from 'uuid';

export class TextService {
  /**
   * Metodo para encriptar un password
   * @param password contraeña
   */
  static encrypt(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  static nano(template: string, data: string): string {
    return template.replace(/\{([\w.]*)\}/g, function (str, key) {
      const keys = key.split('.');
      let v = data[keys.shift()];
      for (let i = 0, l = keys.length; i < l; i++) {
        v = v[keys[i]];
      }
      return typeof v !== 'undefined' && v !== null ? v : '';
    });
  }
  /**
   * Metodo para convertir un texto a formato uuid
   * @param text Texto
   * @param namespace Uuid base
   */
  static textToUuid(
    text: string,
    namespace = 'bb5d0ffa-9a4c-4d7c-8fc2-0a7d2220ba45',
  ): string {
    return v5(text, namespace);
  }

  static generateUuid(): string {
    return v4();
  }
}
