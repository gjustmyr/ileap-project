"""
Encryption utilities for secure data transmission
Matches frontend encryption for password transport
"""
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
import hashlib

# Secret key - must match frontend
SECRET_KEY = 'ILEAP_SECURE_TRANSPORT_KEY_2026'


def decrypt_password(encrypted_password: str) -> str:
    """
    Decrypt password sent from frontend
    Uses AES decryption matching CryptoJS format
    
    Args:
        encrypted_password: Base64 encoded encrypted password from frontend
        
    Returns:
        Decrypted plaintext password
    """
    try:
        # CryptoJS uses a specific format: "Salted__" + salt (8 bytes) + ciphertext
        encrypted_data = base64.b64decode(encrypted_password)
        
        # Extract salt (CryptoJS prepends "Salted__" + 8 byte salt)
        if encrypted_data[:8] != b'Salted__':
            raise ValueError("Invalid encrypted format")
        
        salt = encrypted_data[8:16]
        ciphertext = encrypted_data[16:]
        
        # Derive key and IV from password and salt using EVP_BytesToKey (matching CryptoJS)
        # This matches the OpenSSL EVP_BytesToKey function used by CryptoJS
        password_bytes = SECRET_KEY.encode()
        key_iv = b''
        prev = b''
        
        # Generate enough bytes for 256-bit key (32 bytes) + 128-bit IV (16 bytes) = 48 bytes
        while len(key_iv) < 48:
            prev = hashlib.md5(prev + password_bytes + salt).digest()
            key_iv += prev
        
        key = key_iv[:32]  # 256 bits for AES-256
        iv = key_iv[32:48]  # 128 bits for IV
        
        # Decrypt using AES-256-CBC
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)
        
        return decrypted.decode('utf-8')
    except Exception as e:
        print(f"Decryption error: {e}")
        raise ValueError("Failed to decrypt password")


def encrypt_data(data: str) -> str:
    """
    Encrypt data for sending to frontend
    (Not used for passwords, but available for other secure data)
    """
    # Implementation if needed for reverse encryption
    pass
