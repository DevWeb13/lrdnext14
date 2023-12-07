import { randomBytes } from 'crypto';

export function generateResetPasswordToken() {
  // Générer un jeton de 32 octets
  const resetPasswordToken = randomBytes(32).toString('hex');

  // Définir une date d'expiration, par exemple, 1 heure à partir de maintenant
  const resetPasswordTokenExpiredAt = new Date();
  resetPasswordTokenExpiredAt.setMinutes(
    resetPasswordTokenExpiredAt.getMinutes() + 5
  );

  return { resetPasswordToken, resetPasswordTokenExpiredAt };
}
