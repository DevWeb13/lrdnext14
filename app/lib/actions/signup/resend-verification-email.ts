'use server';

import { connectToCollection } from '@/app/utils/connect-db';
import { FormErrorState } from '@/types/form-error-state';
import { redirect } from 'next/navigation';
import { sendVerificationEmail } from './send-verification-email';
import { addEmailVerificationToken } from './add-email-verification-token';

export async function resendVerificationEmail(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState> {
  const resendVerificationEmailData = {
    id: formData.get('id')!.toString(),
    email: formData.get('email')!.toString(),
    password: formData.get('newPassword')!.toString(),
    name: formData.get('name')!.toString(),
  };

  const {
    id,
    email,
    name,
    password: newPassword,
  } = resendVerificationEmailData;

  try {
    const { client, collection } = await connectToCollection('users');
    console.log({ client, collection });
    const { emailVerificationToken, emailVerificationTokenExpiredAt } =
      await addEmailVerificationToken(id, collection);

    console.log({ emailVerificationToken, emailVerificationTokenExpiredAt });
    await sendVerificationEmail({
      userName: name!,
      id,
      email: email!,
      hashedPassword: newPassword!,
      emailVerificationToken,
      emailVerificationTokenExpiredAt,
    });
    console.log('Email sent');
    client.close();
    console.log('You deconnected to MongoDb');
    prevState.message = null;
    console.log(prevState);
  } catch (error) {
    return {
      errors: {},
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }
  redirect('/auth/checked-email');
}
