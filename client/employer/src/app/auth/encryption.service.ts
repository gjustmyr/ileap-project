import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  // Secret key for encryption - should match backend
  private readonly SECRET_KEY = 'ILEAP_SECURE_TRANSPORT_KEY_2026';

  constructor() {}

  /**
   * Encrypt password before sending to server
   * Uses AES encryption with the secret key
   */
  encryptPassword(password: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        password,
        this.SECRET_KEY,
      ).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt password');
    }
  }

  /**
   * Encrypt any data before transmission
   */
  encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }
}
