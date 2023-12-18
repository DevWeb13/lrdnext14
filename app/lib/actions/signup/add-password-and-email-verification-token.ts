'use server';

import { generateEmailVerificationToken } from '@/app/utils/generate-email-verification-token';
import { ObjectId } from 'mongodb';
import { Document, Model } from 'mongoose';

export async function addPasswordAndEmailVerificationToken(
  id: string,
  password: string,
  User: Model<Document>,
) {
  const { emailVerificationToken, emailVerificationTokenExpiredAt } =
    generateEmailVerificationToken();

  await User.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        password,
        emailVerificationToken,
        emailVerificationTokenExpiredAt,
      },
    },
  );

  return { emailVerificationToken, emailVerificationTokenExpiredAt };
}
