import { randomBytes } from 'crypto';

export function generateEmailVerificationToken() {
  // Générer un jeton de 32 octets
  const emailVerificationToken = randomBytes(32).toString('hex');

  // Définir une date d'expiration, par exemple, 24 heures à partir de maintenant
  const emailVerificationTokenExpiredAt = new Date();
  emailVerificationTokenExpiredAt.setHours(
    emailVerificationTokenExpiredAt.getHours() + 24
  );

  return { emailVerificationToken, emailVerificationTokenExpiredAt };
}
