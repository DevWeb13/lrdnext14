'use server';

import { generateResetPasswordToken } from '@/app/utils/generate-reset-password-token';
import { Collection } from 'mongodb';

/**
 * The function adds a reset token and its expiration date to a user's document in a collection and
 * returns the reset token.
 * @param {string} email - The email parameter is a string that represents the email address of the
 * user for whom the reset token is being generated.
 * @param {Collection} users - The `users` parameter is a collection that represents a database
 * collection or table containing user data. It is used to perform database operations such as updating
 * user records.
 * @returns the `resetPasswordToken` value.
 */
export async function addResetPasswordToken(email: string, users: Collection) {
  const { resetPasswordToken, resetPasswordTokenExpiredAt } =
    generateResetPasswordToken();

  await users.updateOne(
    { email },
    { $set: { resetPasswordToken, resetPasswordTokenExpiredAt } }
  );

  return resetPasswordToken;
}
