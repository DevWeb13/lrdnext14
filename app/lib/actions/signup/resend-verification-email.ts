'use server';

import connect from '@/app/utils/connect-db';
import { FormErrorState } from '@/types/form-error-state';
import { redirect } from 'next/navigation';
import { sendVerificationEmail } from './send-verification-email';
import { addEmailVerificationToken } from './add-email-verification-token';
import User from '@/models/User';

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
    await connect();

    const { emailVerificationToken, emailVerificationTokenExpiredAt } =
      await addEmailVerificationToken(id, User);

    console.log({ emailVerificationToken, emailVerificationTokenExpiredAt });
    await sendVerificationEmail({
      name: name!,
      id,
      email: email!,
      hashedPassword: newPassword!,
      emailVerificationToken,
      emailVerificationTokenExpiredAt,
    });
    console.log('Email sent');

    prevState.message = null;
  } catch (error) {
    return {
      errors: {},
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }
  redirect('/auth/checked-email');
}
