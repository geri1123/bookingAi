// Token-et e Meta-s (WhatsApp/Messenger/Instagram) s'ruhen kurre ne DB si tekst i thjeshte.
export abstract class ChannelTokenEncryptor {
  abstract encrypt(plainToken: string): string;
  abstract decrypt(encryptedToken: string): string;
}
