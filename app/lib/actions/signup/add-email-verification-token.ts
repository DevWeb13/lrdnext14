'use server';

import { generateEmailVerificationToken } from '@/app/utils/generate-email-verification-token';
import { Collection, ObjectId } from 'mongodb';

export async function addEmailVerificationToken(id: string, users: Collection) {
  const { emailVerificationToken, emailVerificationTokenExpiredAt } =
    generateEmailVerificationToken();

  await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: { emailVerificationToken, emailVerificationTokenExpiredAt } }
  );

  return { emailVerificationToken, emailVerificationTokenExpiredAt };
}
