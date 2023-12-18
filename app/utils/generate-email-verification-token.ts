import { randomBytes } from 'crypto';

/**
 * The function generates an email verification token and sets an expiration date for it.
 * @returns an object with two properties: "emailVerificationToken" and
 * "emailVerificationTokenExpiredAt". The "emailVerificationToken" property contains a randomly
 * generated token of 32 bytes, represented as a hexadecimal string. The
 * "emailVerificationTokenExpiredAt" property contains a date and time that is 24 hours from the
 * current time.
 */
export function generateEmailVerificationToken() {
  // Générer un jeton de 32 octets
  const emailVerificationToken = randomBytes(32).toString('hex');

  // Définir une date d'expiration, par exemple, 24 heures à partir de maintenant
  const emailVerificationTokenExpiredAt = new Date();
  emailVerificationTokenExpiredAt.setHours(
    emailVerificationTokenExpiredAt.getHours() + 24,
  );

  return { emailVerificationToken, emailVerificationTokenExpiredAt };
}
