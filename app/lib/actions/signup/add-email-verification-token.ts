'use server';

import { generateEmailVerificationToken } from '@/app/utils/generate-email-verification-token';
import { ObjectId } from 'mongodb';
import { Document, Model } from 'mongoose';

export async function addEmailVerificationToken(
  id: string,
  User: Model<Document>,
) {
  const { emailVerificationToken, emailVerificationTokenExpiredAt } =
    generateEmailVerificationToken();

  await User.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        emailVerificationToken,
        emailVerificationTokenExpiredAt,
      },
    },
  );

  return { emailVerificationToken, emailVerificationTokenExpiredAt };
}
