import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { nanoid, customAlphabet } from 'nanoid';
import { v5, v4 } from 'uuid';
import zxcvbn from 'zxcvbn-typescript';
import { Configurations } from '../../common/params';
@Injectable()
export class TextService {
  /**
   * Metodo para encriptar un password
   * @param password contraeña
   */
  static async encrypt(password: string) {
    const hashText = await hash(password, Configurations.SALT_ROUNDS);
    return hashText;
  }

  static async compare(passwordInPlainText, hashedPassword) {
    const isPasswordMatching = await compare(
      passwordInPlainText,
      hashedPassword,
    );
    return isPasswordMatching;
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

  /**
   * Metodo para generar un texto aleatorio corto de acuerdo a un alfabeto
   * @returns string
   */
  static generateShortRandomText(length = 8): string {
    const nanoid = customAlphabet(
      '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      length,
    );
    return nanoid();
  }

  /**
   * Metodo para generar un texto aleatorio corto
   * @returns string
   */
  static generateNanoId(): string {
    return nanoid();
  }

  static validateLevelPassword(password: string) {
    const result = zxcvbn(password);
    if (result.score >= Configurations.SCORE_PASSWORD) {
      return true;
    }
    return false;
  }

  static decodeBase64 = (base64) => {
    const text = TextService.atob(base64);
    return decodeURI(text);
  };

  static atob = (a) => Buffer.from(a, 'base64').toString('ascii');

  static btoa = (b) => Buffer.from(b).toString('base64');
}
